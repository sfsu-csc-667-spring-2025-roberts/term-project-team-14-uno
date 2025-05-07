import Card from "./Card";
import Player from "./Player";

export interface PlayerGameState {
  gameState: string;
  topCard: Card | null;
  myPlayer: Player;
  myPlayerIdx: number;
  players: number[];
  turn: number;
}
