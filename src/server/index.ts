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
import { configureSession } from "./sessions/config";

const app = express();
const PORT = process.env.PORT || 3000;

configureSession(app);
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
