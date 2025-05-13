export interface GameDB {
  game: GameStateDB;
  players: PlayerDB[];
  cards: CardDB[];
}

export interface GameStateDB {
  game_id: string;
  state: string;
  turn: number;
  turn_increment: number;
  num_players: number;
  top_card_id: null | string;
}

export interface CardDB {
  id: string;
  game_id: string;
  value: number;
  color: string;
  type: string;
  img: string;
  location: string;
  owner_id: number | null;
  position: number | null;
}

export interface PlayerDB {
  game_id: string;
  player_index: number;
  user_id: number;
  id: string;
  username: string | null;
}
