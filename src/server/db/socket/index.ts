import db from "../connection";

const updateSocket = async (
  socketId: string,
  userId: number,
  gameId: string,
) => {
  try {
    await db.none(
      `
            INSERT INTO sockets (socket_id, user_id, game_id)
            VALUES ($1, $2, $3)
            ON CONFLICT (socket_id) DO UPDATE SET
              user_id = EXCLUDED.user_id,
              game_id = EXCLUDED.game_id
            `,
      [socketId, userId, gameId],
    );
  } catch (error) {
    console.error("Error updating socket:", error);
    throw error;
  }
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

export default { updateSocket };
