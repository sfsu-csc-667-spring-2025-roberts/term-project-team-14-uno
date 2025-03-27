class Card {
  value: number;
  img: string;
  color: Color;
  type: CardType;

  constructor(value: number, img: string, color: Color, type: CardType) {
    this.value = value;
    this.img = img;
    this.color = color;
    this.type = type;
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
  DRAW = "DRAW",
  WILD = "WILD",
}

export default Card;
