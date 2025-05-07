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
