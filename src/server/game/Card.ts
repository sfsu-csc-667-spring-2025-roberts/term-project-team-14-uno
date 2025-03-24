class Card {
  value: number;
  img: string;
  color: string;

  constructor(value: number, img: string, color: string) {
    this.value = value;
    this.img = img;
    this.color = color;
  }
}

export enum Color {
  BLUE = "BLUE",
  RED = "RED",
  YELLOW = "YELLOW",
  GREEN = "GREEN",
}

export default Card;
