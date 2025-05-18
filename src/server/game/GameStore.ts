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
      game_db = { game: g, players: players, cards: cards };
      gs = GameState.fromSQL(game_db);
      this.games[g.game_id] = gs;
      sockets = await Games.getSockets(g.game_id);
      console.log("in game store init with sockets: ", sockets);

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
      console.log(
        "in game store init sockets for players added for a game: ",
        this.players,
      );
    }
  }

  newGame(userId: number, username: string) {
    const gs = new GameState(String(GameStore.getGameId()));
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

  // joinGame(userId: number, username: string) {
  //   console.log("user joining with id ", userId);
  //   if (Object.keys(this.games).length === 0) {
  //     // or check if all games full?
  //     const gs = new GameState(String(GameStore.getGameId()));
  //     gs.addPlayer(userId, username);
  //     this.games[gs.gameId] = gs;
  //     this.players[userId] = { socketId: null, gameId: gs.gameId };
  //     // return {gameId: gs.gameId, startGame: false}; // maybe update if we allow single player
  //     Games.addGameRecord(gs.serializeOnlyGS());
  //     return gs.gameId;
  //   }
  //   // check for open game
  //   for (let id in this.games) {
  //     if (this.games[id].state === "uninitialized") {
  //       console.log("founduninitialized game: ", id);
  //       this.games[id].addPlayer(userId, username);
  //       this.players[userId] = { socketId: null, gameId: id };
  //       const start =
  //         this.games[id].players.length === this.games[id].numPlayers;
  //       // return {gameId: id, startGame: start};
  //       console.log(
  //         "start condition players: ",
  //         this.games[id].players.length,
  //         " and required num: ",
  //         this.games[id].numPlayers,
  //       );
  //       // if (start) {
  //       //   console.log("it is start")
  //       //   getIO().to(id).emit("start-game", "start");
  //       // }
  //       console.log("about to return ", id);
  //       return id;
  //     }
  //   }
  //   // all games full, create new
  //   const gs = new GameState(String(GameStore.getGameId()));
  //   gs.addPlayer(userId, username);
  //   this.games[gs.gameId] = gs;
  //   this.players[userId] = { socketId: null, gameId: gs.gameId };
  //   Games.addGameRecord(gs.serializeOnlyGS());
  //   return gs.gameId;
  // }

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

  getOpenGames() {
    const games = Games.getOpenGames();
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
