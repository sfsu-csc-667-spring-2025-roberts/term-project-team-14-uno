import express from "express";

import authRouter from "./auth";
import gameRouter from "./game";
import chatRouter from "./chat";

import gameManager from "../game/GameStore";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/game", gameRouter);
router.use("/chat", chatRouter);

export default router;
