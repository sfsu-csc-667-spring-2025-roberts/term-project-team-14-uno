import GameState from "./GameState";

interface GameMap {
  [gameId: string]: GameState;
}

class GameStore {
  static instance: GameStore;
  static id: number = 1;

  games: GameMap;
  players: Object;

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
}

const gameManager = GameStore.getInstance();

export default gameManager;
