import GameState from "./GameState";

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

  joinGame(userId: string) {
    console.log();
    if (Object.keys(this.games).length === 0) {
      const gs = new GameState(String(GameStore.getGameId()));
      gs.addPlayer(userId);
      this.games[gs.gameId] = gs;
      this.players[userId] = { socketId: null, gameId: gs.gameId };
      return gs.gameId;
    }

    for (let id in this.games) {
      if (this.games[id].state === "uninitialized") {
        this.games[id].addPlayer(userId);
        return id;
      }
    }
    return null;
  }

  updateSocket(userId: string, socketId: string) {
    console.log(this.players[userId]);
    console.log("update socket user: ", userId, " and socket: ", socketId);
    this.players[userId].socketId = socketId;
  }
}

const gameManager = GameStore.getInstance();

export default gameManager;
