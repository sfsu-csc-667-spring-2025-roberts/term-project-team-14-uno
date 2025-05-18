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
    // const { id, userId, username } = socket.request.session;
    // console.log(`here is the id: ${id} and user: ${userId} from the session middleware`)
    const userId = Number(socket.handshake.query.userId);
    const gid = socket.handshake.query.gid;
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

    socket.on("game-state", (gid, userId) => {
      console.log("in game state");
      const playerState = gameManager.games[gid].getPlayerSubset(userId);
      const playerSocket = gameManager.players[userId][gid].socketId;
      if (playerSocket) {
        io!.to(playerSocket).emit("state-update", playerState);
      } else {
        console.log("error finding player in game-state");
      }
    });

    socket.on("play", (data: Action, callback) => {
      console.log(data);
      // const isValid = validateAction(action); // Your logic here
      const isValid = true;

      if (isValid) {
        // Process action
        io!.emit("action_broadcast", data); // For example
        callback({ success: true });
      } else {
        callback({
          success: false,
          message: "That move is not allowed right now.",
        });
      }
    });
  });
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
}
