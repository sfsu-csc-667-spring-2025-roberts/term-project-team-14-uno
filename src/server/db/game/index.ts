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
  const cardStateUpdate = await cardsStateUpdateHelper(state.cards);
  const playersStateUpdate = await playersStateUpdateHelper(state.players);
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

const getCards = async (gid: string): Promise<CardDB[]> => {
  const query = `
  SELECT * FROM game_cards where game_id='${gid}'
`;
  try {
    const res = await db.any(query);
    console.log("cards db: ", res);
    const cards = res.map((card) => ({
      id: card.id,
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
      id: player.uuid,
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
  const query = "SELECT * FROM games WHERE state='uninitialized'";
  try {
    const res = await db.any(query);
    console.log("games db: ", res);
    return res;
  } catch (error) {
    console.log("error fetching open games: ", error);
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
  getPlayers,
  getCards,
  getSockets,
  getOpenGames,
};
