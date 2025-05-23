import { v4 as uuidv4 } from "uuid";

export interface CardDB {
  id: string;
  game_id: string;
  value: number;
  color: string;
  type: string;
  img: string;
  location: string;
  owner_id: string | null;
  position: number | null;
}

class Card {
  id: string;
  value: number;
  img: string;
  color: Color;
  type: CardType;

  constructor(
    value: number,
    img: string,
    color: Color,
    type: CardType,
    id: string | null = null,
  ) {
    this.id = id ? id : uuidv4();
    this.value = value;
    this.img = img;
    this.color = color;
    this.type = type;
  }

  toCardDB(): CardDB {
    return {
      id: this.id,
      game_id: "-1",
      value: this.value,
      color: this.color,
      type: this.type,
      img: this.img,
      location: "-1",
      owner_id: null,
      position: -1,
    };
  }

  equals(other: Card): boolean {
    return (
      this.value === other.value &&
      this.img === other.img &&
      this.color === other.color &&
      this.type === other.type
    );
  }
}

export enum Color {
  BLUE = "BLUE",
  RED = "RED",
  YELLOW = "YELLOW",
  GREEN = "GREEN",
}

export enum CardType {
  REGULAR = "REGULAR",
  REVERSE = "REVERSE",
  SKIP = "SKIP",
  DRAW = "DRAW",
  WILD = "WILD",
}

export default Card;
