import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import gameManager from "../game/GameStore";

let io: Server | null = null;

export function initSocket(server: HttpServer) {
  io = new Server(server);
  if (io === null) {
    console.log("error initializing socket");
  }
  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("user id: ", userId, " type is: ", typeof userId);
    if (!userId || Array.isArray(userId)) {
      console.log("issue with connection user id");
    } else {
      gameManager.updateSocket(userId, socket.id);
    }
    console.log(`User ${userId} connected on ${socket.id}`);

    socket.on("join-game", (gid) => {
      console.log(`User ${socket.id} joined room: ${gid}`);
      socket.join(gid);
      io!.to(gid).emit("message", `User ${socket.id} has joined the room`);
    });

    socket.on("game-state", (gid, userId) => {
      console.log("in game state");
      const playerState = gameManager.games[gid].getPlayerSubset(userId);
      const playerSocket = gameManager.players[userId].socketId;
      if (playerSocket) {
        io!.to(playerSocket).emit("state-update", playerState);
      } else {
        console.log("error finding player in game-state");
      }
    });

    socket.on("play", (data) => {
      console.log(data);
    });
  });
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
}
