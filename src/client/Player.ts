import Card from "./Card";
import { v4 as uuidv4 } from "uuid";

class Player {
  uuid: string;
  userId: number;
  username: string | null;
  index: number; //for which player in gs list
  hand: Card[];

  constructor(id: number, username: string | null, index: number) {
    this.uuid = uuidv4();
    this.userId = id;
    this.username = username;
    this.index = index;
    this.hand = [];
  }
}

export default Player;
