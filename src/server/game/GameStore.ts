import GameState from "./GameState";
import { getIO } from "../socket/socket";
import Sockets from "../db/socket/index";
import Games from "../db/game/index";
import { CardDB, GameDB, GameStateDB, PlayerDB } from "../db/game/GameDbType";
import { Socket } from "../db/socket/SocketType";

interface GameMap {
  [gameId: string]: GameState;
}
interface PlayerMap {
  [playerId: string]: {
    [gameId: string]: { socketId: string | null };
  };
}

class GameStore {
  static instance: GameStore;
  static id: number = 1;

  games: GameMap;
  players: PlayerMap;

  constructor() {
    this.games = {};
    this.players = {};
  }

  static getInstance(): GameStore {
    if (!GameStore.instance) {
      GameStore.instance = new GameStore();
    }

    return GameStore.instance;
  }

  static getGameId() {
    return ++this.id;
  }

  async init() {
    const res = await Games.getGames();
    //make sure no conflict with new game ids
    const maxId = res.reduce((max, game) => {
      const numId = parseInt(game.game_id, 10);
      return isNaN(numId) ? max : Math.max(max, numId);
    }, 0);

    GameStore.id = maxId + 1;

    let game_db: GameDB;
    let g: GameStateDB;
    let players: PlayerDB[];
    let cards: CardDB[];
    let sockets: Socket[];
    let p: PlayerDB;
    let gs: GameState;
    for (let g of res) {
      players = await Games.getPlayers(g.game_id);
      cards = await Games.getCards(g.game_id);
      const discard = cards.find((card) => card.id === g.top_card_id);
      if (!discard) throw new Error("unable to find top card");
      cards = cards.filter((card) => card.location !== "discard");
      cards.push(discard);
      game_db = { game: g, players: players, cards: cards };
      gs = GameState.fromSQL(game_db);
      this.games[g.game_id] = gs;
      sockets = await Games.getSockets(g.game_id);
      console.log("in game store init with initialized game: ", gs.players);

      const socketMap = new Map<number, string>(); // user_id -> socket_id
      sockets.forEach((s) => {
        socketMap.set(s.user_id, s.socket_id);
      });

      sockets.forEach((player) => {
        const playerSocketId = socketMap.get(player.user_id) ?? null;
        if (!this.players[player.user_id.toString()]) {
          this.players[player.user_id.toString()] = {};
        }
        this.players[player.user_id.toString()][g.game_id] = {
          socketId: playerSocketId ? playerSocketId : null,
        };
      });
      // players.forEach((player) => {
      //   const playerSocketId = socketMap.get(player.user_id) ?? null;
      //   this.players[player.user_id.toString()][g.game_id] = {socketId: playerSocketId ? playerSocketId : null }
      // });
    }
  }

  newGame(userId: number, username: string, gid: string | null) {
    const gs = new GameState(gid ? gid : String(GameStore.getGameId()));
    gs.addPlayer(userId, username);
    this.games[gs.gameId] = gs;
    if (!this.players[userId]) {
      this.players[userId] = {};
    }
    this.players[userId][gs.gameId] = { socketId: null };
    // return {gameId: gs.gameId, startGame: false}; // maybe update if we allow single player
    Games.addGameRecord(gs.serializeOnlyGS());
    return gs.gameId;
  }

  joinSpecificGame(userId: number, username: string, gid: string) {
    const game = this.games[gid];
    if (!game) {
      console.log("unable to find specific game");
      return false;
    }
    this.games[gid].addPlayer(userId, username);
    if (!this.players[userId]) {
      this.players[userId] = {};
    }
    this.players[userId][gid] = { socketId: null };
    return true;
  }

  removeGame(gameId: string, players: number[]) {
    Games.deleteGame(gameId);
    delete this.games[gameId];
    for (let player of players) {
      delete this.players[player][gameId];
    }
  }

  async getOpenGames(userId: number | null) {
    let games = await Games.getOpenGames();
    console.log("get open games: ", games);
    if (userId) {
      games = games.filter((game) => {
        const gameState = this.games[game.game_id];
        console.log("game state in filter: ", gameState);
        const players = gameState.players;
        const currentPlayerFound = players.findIndex(
          (player) => player.userId === userId,
        );
        return currentPlayerFound === -1;
      });
    }

    return games;
  }

  updateSocket(userId: number, socketId: string, gameId: string) {
    console.log("player entry in game manager: ", this.players[userId]);
    console.log("update socket user: ", userId, " and socket: ", socketId);

    const oldSocketId = this.players[userId]?.[gameId]?.socketId;
    if (oldSocketId && oldSocketId !== socketId) {
      const oldSocket = getIO().sockets.sockets.get(oldSocketId);
      if (oldSocket) {
        console.log("Disconnecting old socket:", oldSocketId);
        oldSocket.disconnect(true);
      }
    }

    if (!this.players[userId]) {
      this.players[userId] = {};
      this.players[userId][gameId] = { socketId: null };
    }
    this.players[userId][gameId].socketId = socketId;
    Sockets.updateSocket(socketId, userId, gameId);
  }

  removeSocket(userId: number, gid: string) {
    console.log(
      "in game manager calling remove socket: ",
      userId,
      " game id: ",
      gid,
    );
    if (this.players[userId] && this.players[userId][gid]) {
      if (
        this.games[gid] &&
        (this.games[gid].state === "wait" || this.games[gid].state === "play")
      ) {
        // do nothing
      } else {
        delete this.players[userId][gid];

        // If user had no more games, clean up further
        if (Object.keys(this.players[userId]).length === 0) {
          delete this.players[userId];
        }
      }
    }

    // Optional: Check if the game should be ended or cleaned up
    const game = this.games[gid];
    if (game) {
      const remaining = game.players.filter(
        (p) => this.players[p.userId]?.[gid],
      );
      if (remaining.length === 0) {
        delete this.games[gid];
        console.log(`Game ${gid} removed due to all players disconnecting`);
      }
    }
  }

  getTestId(): number {
    if (Object.keys(this.games).length === 0) {
      return 0;
    }

    for (let id in this.games) {
      if (this.games[id].state === "uninitialized") {
        console.log("founduninitialized game: ", id);
        return this.games[id].players.length;
      }
    }
    return -1;
  }
}

const gameManager = GameStore.getInstance();

export default gameManager;
