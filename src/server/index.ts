import dotenv from "dotenv";
dotenv.config();

import * as path from "path";
import express, { urlencoded } from "express";
import httpErrors from "http-errors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";

//custom class
import gameManager from "./game/GameStore";
import { initSocket } from "./socket/socket";

// custom routes
import rootRoutes from "./roots/root";
import apiRoutes from "./roots/api";
import testRoutes from "./roots/test";
// custom middleware

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(process.cwd(), "public")));
app.set("views", path.join(process.cwd(), "src", "server", "templates"));
app.set("view engine", "ejs");

app.use("/", rootRoutes);
app.use("/api", apiRoutes);
app.use("/test", testRoutes);

app.use((_, __, next) => {
  next(httpErrors(404));
});

const expressServer = app.listen(PORT, () => {
  console.log("server listening at port: ", PORT);
});

initSocket(expressServer);

// const io = new Server(expressServer);
// io.on("connection", (socket) => {
//   const userId = socket.handshake.query.userId;
//   console.log("user id: ", userId, " type is: ", typeof userId);
//   if (!userId || Array.isArray(userId)) {
//     console.log("issue with connection user id");
//   } else {
//     gameManager.updateSocket(userId, socket.id);
//   }
//   console.log(`User ${userId} connected on ${socket.id}`);

//   socket.on("join-game", (gid) => {
//     console.log(`User ${socket.id} joined room: ${gid}`);
//     socket.join(gid)
//     io.to(gid).emit("message", `User ${socket.id} has joined the room`);
//   })

//   socket.on("game-state", (gid, userId) => {
//     console.log("in game state")
//     const playerState = gameManager.games[gid].getPlayerSubset(userId);
//     const playerSocket = gameManager.players[userId].socketId;
//     if (playerSocket) {
//       io.to(playerSocket).emit("state-update", playerState);
//     } else {
//       console.log("error finding player in game-state");
//     }
//   });

//   socket.on("play", (data) => {
//     console.log(data);
//   });
// });
