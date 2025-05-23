import Card from "../../../client/Card";
import GameState from "../../game/GameState";
import db from "../connection";
import { pgp } from "../connection";
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

const serializeGame = async (state: GameDB) => {
  console.log("in serialize game");
  // quickCheckHelperInit(state)
  // add record to games table
  const gameStateUpdate = await serializeGameStateHelper(state.game);
  if (!gameStateUpdate) return;
  // players must go before cards to ref user_id from players table
  const playersStateUpdate = await playersStateUpdateHelper(state.players);
  const cardStateUpdate = await cardsStateUpdateHelper(state.cards);
  if (gameStateUpdate && cardStateUpdate && playersStateUpdate) {
    console.log("YAY!! successfully serialized game no errors");
  }
  return true;
};
const serializeGameStateHelper = async (game: GameStateDB) => {
  const query = `
    INSERT INTO games (
      game_id, state, turn, turn_increment, num_players, top_card_id
    )
    VALUES (
      $[game_id], $[state], $[turn], $[turn_increment], $[num_players], $[top_card_id]::uuid
    )
    ON CONFLICT (game_id)
    DO UPDATE SET
      state = EXCLUDED.state,
      turn = EXCLUDED.turn,
      turn_increment = EXCLUDED.turn_increment,
      num_players = EXCLUDED.num_players,
      top_card_id = EXCLUDED.top_card_id
  `;
  try {
    await db.none(query, game);
    console.log(`Game ${game.game_id} upserted successfully.`);
    return true;
  } catch (error) {
    console.error(`Failed to upsert game ${game.game_id}:`, error);
    return false;
  }
};

const cardColumnSet = new pgp.helpers.ColumnSet(
  [
    "id",
    "game_id",
    "value",
    "img",
    "color",
    "type",
    "location",
    "position",
    "owner_id",
  ],
  { table: "game_cards" },
);
const cardsStateUpdateHelper = async (cards: CardDB[]) => {
  const insert =
    pgp.helpers.insert(cards, cardColumnSet) +
    `
    ON CONFLICT (id)
    DO UPDATE SET
      game_id = EXCLUDED.game_id,
      value = EXCLUDED.value,
      img = EXCLUDED.img,
      color = EXCLUDED.color,
      type = EXCLUDED.type,
      location = EXCLUDED.location,
      position = EXCLUDED.position,
      owner_id = EXCLUDED.owner_id
  `;

  try {
    await db.none(insert);
    console.log(`Upserted ${cards.length} cards.`);
    return true;
  } catch (error) {
    console.error("Error during bulk card upsert:", error);
    return false;
  }
};
const playerColumnSet = new pgp.helpers.ColumnSet(
  ["id", "game_id", "player_index", "user_id"],
  { table: "players" },
);
const playersStateUpdateHelper = async (players: PlayerDB[]) => {
  // Omit the `username` field before insert
  const dbReadyPlayers = players.map(({ username, ...p }) => p);

  const insert =
    pgp.helpers.insert(dbReadyPlayers, playerColumnSet) +
    `
    ON CONFLICT (id)
    DO UPDATE SET
      game_id = EXCLUDED.game_id,
      player_index = EXCLUDED.player_index,
      user_id = EXCLUDED.user_id
  `;

  try {
    await db.none(insert);
    console.log(`Upserted ${players.length} players.`);
    return true;
  } catch (error) {
    console.error("Error during bulk player upsert:", error);
    return false;
  }
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
const updateGame = async (state: GameStateDB): Promise<boolean> => {
  const query = `
    UPDATE games SET
      state = $2,   
      turn = $3,   
      turn_increment = $4,
      top_card_id = $5
      WHERE game_id = $1
  `;
  const values = [
    state.game_id,
    state.state,
    state.turn,
    state.turn_increment,
    state.top_card_id,
  ];
  try {
    const res = await db.none(query, values);
    // console.log("games db: ", res);
    return true;
  } catch (error) {
    console.log("error updating games table in game state: ", error);
    return false;
  }
};

const deleteGame = async (game_id: string): Promise<boolean> => {
  const query = `DELETE FROM games WHERE game_id = $1`;
  try {
    await db.none(query, [game_id]);
    return true;
  } catch (error) {
    console.log("error deleting game: ", error);
    return false;
  }
};

const getCards = async (gid: string): Promise<CardDB[]> => {
  const query = `
  SELECT * FROM game_cards where game_id='${gid}'
`;
  try {
    const res = await db.any(query);
    // console.log("cards db: ", res);
    const cards = res.map((card) => ({
      id: card.id,
      game_id: card.game_id,
      value: card.value,
      color: card.color,
      type: card.type,
      img: card.img,
      location: card.location,
      owner_id: card.owner_id,
      position: Number(card.position),
    }));

    return cards;
  } catch (error) {
    console.log("error fetching cards from db: ", error);
    return [];
  }
};

const updateCard = async (card: CardDB): Promise<boolean> => {
  const query = `
    UPDATE game_cards SET
      game_id = $2,
      value = $3,
      color = $4,
      type = $5,
      img = $6,
      location = $7,
      owner_id = $8,
      position = $9
    WHERE id = $1
  `;

  const values = [
    card.id,
    card.game_id,
    card.value,
    card.color,
    card.type,
    card.img,
    card.location,
    card.owner_id,
    card.position,
  ];

  try {
    await db.none(query, values);
    console.log(`Updated card with id ${card.id}`);
    return true;
  } catch (err) {
    console.error("Error during card update:", err);
    return false;
  }
};
const updateCards = async (cards: CardDB[]): Promise<boolean> => {
  if (cards.length === 0) return true;

  const valuesClause = cards
    .map(
      (_, i) =>
        `($${i * 9 + 1}::uuid, $${i * 9 + 2}, $${i * 9 + 3}, $${i * 9 + 4}, $${i * 9 + 5}, $${i * 9 + 6}, $${i * 9 + 7}, $${i * 9 + 8}, $${i * 9 + 9})`,
    )
    .join(",\n");

  const query = `
    WITH updated (id, game_id, value, color, type, img, location, owner_id, position) AS (
      VALUES
      ${valuesClause}
    )
    UPDATE game_cards gc
    SET
      game_id = updated.game_id,
      value = updated.value,
      color = updated.color,
      type = updated.type,
      img = updated.img,
      location = updated.location,
      owner_id = updated.owner_id,
      position = updated.position
    FROM updated
    WHERE gc.id = updated.id;
  `;

  const allValues = cards.flatMap((card) => [
    card.id,
    card.game_id,
    card.value,
    card.color,
    card.type,
    card.img,
    card.location,
    card.owner_id,
    card.position,
  ]);

  try {
    await db.none(query, allValues);
    console.log(`Updated ${cards.length} cards`);
    return true;
  } catch (err) {
    console.error("Error during batch card update:", err);
    return false;
  }
};
const getNextDrawCard = async (gameId: string): Promise<CardDB | null> => {
  const query = `SELECT *
FROM game_cards
WHERE game_id = $1
  AND location = 'deck'
  AND position = (
    SELECT MIN(position)
    FROM game_cards
    WHERE game_id = $1
      AND location = 'deck'
  );`;
  try {
    const card = await db.oneOrNone(query, [gameId]);
    if (!card) {
      console.log("no more deck cards");
      return null;
    }
    return {
      id: card.id,
      game_id: card.game_id,
      value: card.value,
      color: card.color,
      type: card.type,
      img: card.img,
      location: card.location,
      owner_id: card.owner_id,
      position: Number(card.position),
    };
  } catch (error) {
    console.log("error fetching next card to draw db: ", error);
    return null;
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
      id: player.id,
      username: player.email,
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

const getOpenGames = async (): Promise<GameStateDB[]> => {
  let query = "SELECT * FROM games WHERE state='uninitialized'";
  try {
    const res = await db.any(query);
    // console.log("games db: ", res);
    return res;
  } catch (error) {
    console.log("error fetching open games: ", error);
    return [];
  }
};

const getUserGames = async (userId: number): Promise<GameStateDB[]> => {
  const query = `
  SELECT g.*
  FROM games g
  JOIN players p ON g.game_id = p.game_id
  WHERE p.user_id = $1
`;
  try {
    const res = await db.any(query, [userId]);
    return res;
  } catch (error) {
    console.log(`error fetching open games for user ${userId}: `, error);
    return [];
  }
};

const quickCheckHelperInit = (gameState: GameDB) => {
  console.log("***HELPER CHECK***");
  const game = gameState.game;
  console.log("game state: ", game);
  const cards = gameState.cards;
  console.log(
    "deck cards: ",
    cards.filter((card) => card.location === "deck").length,
  );
  console.log(
    "player cards: ",
    cards.filter((card) => card.location === "hand").length,
  );
  const players = gameState.players;
  console.log("players num: ", players.length);
  console.log(
    "players id: ",
    players.map((player) => player.user_id),
  );
};

export default {
  addGameRecord,
  serializeGame,
  getGames,
  getUserGames,
  updateGame,
  deleteGame,
  getPlayers,
  getCards,
  updateCard,
  updateCards,
  getNextDrawCard,
  getSockets,
  getOpenGames,
};
