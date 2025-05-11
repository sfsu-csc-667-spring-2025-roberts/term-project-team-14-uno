import Card from "../../../client/Card";
import db from "../connection";
import { Socket } from "../socket/SocketType";
import { CardDB, GameDB, GameStateDB, PlayerDB } from "./GameDbType";

const addGameRecord = async (gs: GameStateDB) => {
  const query = `
    INSERT INTO games (game_id, state, turn, turn_increment, num_players)
    VALUES ($[game_id], $[state], $[turn], $[turn_increment], $[num_players])
  `;

  try {
    await db.none(query, gs);
  } catch (error) {
    console.error("Error inserting game:", error);
    throw error;
  }
};

const serializeInitialGame = async (state: GameDB) => {
  console.log("int serialize game");
  // add record to games table
};

const getGames = async (): Promise<GameStateDB[]> => {
  console.log("hello");
  const query = `
  SELECT * FROM games
`;
  try {
    const res = await db.any(query);
    console.log("games db: ", res);
    return res;
  } catch (error) {
    console.log("error fetching games from db: ", error);
    return [];
  }
};

const getCards = async (gid: string): Promise<CardDB[]> => {
  const query = `
  SELECT * FROM game_cards where game_id='${gid}'
`;
  try {
    const res = await db.any(query);
    console.log("cards db: ", res);
    const cards = res.map((card) => ({
      game_id: card.game_id,
      value: card.value,
      color: card.color,
      type: card.type,
      img: card.img,
      location: card.location,
      owner_id: Number(card.owner_id),
      position: Number(card.position),
    }));

    return cards;
  } catch (error) {
    console.log("error fetching cards from db: ", error);
    return [];
  }
};

const getPlayers = async (gid: string): Promise<PlayerDB[]> => {
  const query = `
    SELECT players.*, users.email
    FROM players
    JOIN users ON players.user_id = users.id
    WHERE players.game_id = $1
  `;
  try {
    const res = await db.any(query, [gid]);
    console.log("players db: ", res);
    const players = res.map((player) => ({
      game_id: gid,
      player_index: Number(player.player_index),
      user_id: Number(player.user_id),
      username: player.username,
    }));
    return players;
  } catch (error) {
    console.log("error fetching players from db: ", error);
    return [];
  }
};

const getSockets = async (gid: string): Promise<Socket[]> => {
  const query = `
  SELECT * FROM sockets where game_id='${gid}'
`;
  try {
    const res = await db.any(query);
    console.log("sockets db: ", res);
    const sockets = res.map((socket) => ({
      socket_id: socket.socket_id,
      player_id: socket.player_id,
      game_id: socket.game_id,
      user_id: Number(socket.user_id),
    }));
    return res;
  } catch (error) {
    console.log("error fetching sockets from db: ", error);
    return [];
  }
};

export default {
  addGameRecord,
  serializeInitialGame,
  getGames,
  getPlayers,
  getCards,
  getSockets,
};
