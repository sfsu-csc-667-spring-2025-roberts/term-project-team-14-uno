import Card from "./Card";

class Player {
  id: string;
  index: number; //for which player in gs list
  hand: Card[];

  constructor(id: string, index: number) {
    this.id = id;
    this.index = index;
    this.hand = [];
  }
}

export default Player;
