import db from "../connection";
import { GameDB, GameStateDB } from "./GameDbType";

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
// const login = async (email: string, password: string) => {
//   const user = await db.one("SELECT * from users WHERE email = $1", [email]);

//   const validPassword = await bcrypt.compare(password, user.password);

//   if (validPassword) {
//     return user;
//   } else {
//     return null;
//   }
// };

export default { addGameRecord, serializeInitialGame };
