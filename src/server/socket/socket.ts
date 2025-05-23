import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import gameManager from "../game/GameStore";
import { Action } from "../game/GameState";
import { middleware } from "../sessions/config";

let io: Server | null = null;

export function initSocket(server: HttpServer) {
  io = new Server(server);
  if (io === null) {
    console.log("error initializing socket");
  }
  io.engine.use(middleware);
  io.on("connection", (socket) => {
    // @ts-ignore
    let { id, userId, username } = socket.request.session;
    const gid = socket.handshake.query.gid;
    //this is for testing
    // userId = Number(socket.handshake.query.userId);

    if (!gid || gid === "lobby") {
      // LOBBY CONNECTION
      socket.join("lobby");
      io!.to("lobby").emit("lobby-message", `User ${userId} joined the lobby`);

      return;
    }

    if (!gid || typeof gid !== "string") {
      console.log("error with gid undefined in socket connection");
      return;
    }
    console.log("user id: ", userId, " type is: ", typeof userId);
    // if (!userId || Array.isArray(userId)) {
    //   console.log("issue with connection user id");
    // } else {
    //   gameManager.updateSocket(userId, socket.id, gid);
    // }
    gameManager.updateSocket(userId, socket.id, gid);
    // join "game room socket"
    socket.join(gid);
    io!.to(gid).emit("message", `User ${socket.id} has joined the room`);
    if (
      gameManager.games[gid]?.state === "ready" ||
      gameManager.games[gid]?.state === "wait"
    ) {
      io!.to(gid).emit("start-game", "start");
    } else if (!gameManager.games[gid]) {
      console.log(
        "what not defined? gm at gid: ",
        gid,
        " equal to ",
        gameManager.games[gid],
      );
    }

    socket.on("disconnect", (reason) => {
      console.log(`Socket ${socket.id} disconnected: ${reason}`);

      // Step 1: Find the userId and gid (gameId) from your gameManager
      const gid = socket.handshake.query.gid as string;
      const userId = Number(socket.handshake.query.userId);

      // Step 2: Remove or mark the player as disconnected
      gameManager.removeSocket(userId, gid); // You'll define this

      // Step 3: Optionally, notify other players
      io!.to(gid).emit("player-disconnected", { userId });
    });
  });
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
}
