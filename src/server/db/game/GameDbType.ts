export interface GameDB {
  game: {
    game_id: string;
    state: string;
    turn: number;
    turn_increment: number;
    num_players: number;
  };
  players: {
    game_id: string;
    player_index: number;
    user_id: number;
  }[];
  cards: {
    game_id: string;
    value: number;
    color: string;
    type: string;
    img: string;
    location: string;
    owner_id: number | null;
    position: number | null;
  }[];
}

export interface GameStateDB {
  game_id: string;
  state: string;
  turn: number;
  turn_increment: number;
  num_players: number;
}
