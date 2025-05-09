import Card from "./Card";

class Player {
  id: number;
  username: string | null;
  index: number; //for which player in gs list
  hand: Card[];

  constructor(id: number, username: string, index: number) {
    this.id = id;
    this.username = username;
    this.index = index;
    this.hand = [];
  }
}

export default Player;
