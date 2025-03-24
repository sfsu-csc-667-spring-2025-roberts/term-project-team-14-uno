import Card from "./Card";

class Player {
  id: string;
  hand: Card[];

  constructor(id: string) {
    this.id = id;
    this.hand = [];
  }
}

export default Player;
