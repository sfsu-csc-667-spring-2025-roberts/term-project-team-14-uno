import Card from "./Card";

export interface Action {
  type: string;
  card?: Card;
  wildColor?: string;
  cardIndex?: number;
  playerId: string;
  gameId: string;
}
