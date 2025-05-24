import express from "express";

import authRouter from "./auth";
import gameRouter from "./game";
import chatRouter from "./chat";

import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/game", authMiddleware, gameRouter);
router.use("/chat", authMiddleware, chatRouter);

export default router;
