import GameState from "./GameState";
import { getIO } from "../socket/socket";
import Sockets from "../db/socket/index";
import Games from "../db/game/index";
import { GameDB, GameStateDB } from "../db/game/GameDbType";

interface GameMap {
  [gameId: string]: GameState;
}
interface PlayerMap {
  [playerId: string]: { socketId: string | null; gameId: string };
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

  joinGame(userId: number, username: string) {
    console.log("user joining with id ", userId);
    if (Object.keys(this.games).length === 0) {
      // or check if all games full?
      const gs = new GameState(String(GameStore.getGameId()));
      gs.addPlayer(userId, username);
      this.games[gs.gameId] = gs;
      this.players[userId] = { socketId: null, gameId: gs.gameId };
      // return {gameId: gs.gameId, startGame: false}; // maybe update if we allow single player
      Games.addGameRecord(gs.serializeOnlyGS());
      return gs.gameId;
    }
    // check for open game
    for (let id in this.games) {
      if (this.games[id].state === "uninitialized") {
        console.log("founduninitialized game: ", id);
        this.games[id].addPlayer(userId, username);
        this.players[userId] = { socketId: null, gameId: id };
        const start =
          this.games[id].players.length === this.games[id].numPlayers;
        // return {gameId: id, startGame: start};
        console.log(
          "start condition players: ",
          this.games[id].players.length,
          " and required num: ",
          this.games[id].numPlayers,
        );
        // if (start) {
        //   console.log("it is start")
        //   getIO().to(id).emit("start-game", "start");
        // }
        console.log("about to return ", id);
        return id;
      }
    }
    // all games full, create new
    const gs = new GameState(String(GameStore.getGameId()));
    gs.addPlayer(userId, username);
    this.games[gs.gameId] = gs;
    this.players[userId] = { socketId: null, gameId: gs.gameId };
    Games.addGameRecord(gs.serializeOnlyGS());
    return gs.gameId;
  }

  updateSocket(userId: number, socketId: string, gameId: string) {
    console.log("player entry in game manager: ", this.players[userId]);
    console.log("update socket user: ", userId, " and socket: ", socketId);
    this.players[userId].socketId = socketId;
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
