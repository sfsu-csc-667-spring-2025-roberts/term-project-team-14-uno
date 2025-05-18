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
      ON CONFLICT (user_id, game_id) DO UPDATE SET
        socket_id = EXCLUDED.socket_id
      `,
      [socketId, userId, gameId],
    );
  } catch (error) {
    console.error("Error updating socket:", error);
    throw error;
  }
};

export default { updateSocket };
