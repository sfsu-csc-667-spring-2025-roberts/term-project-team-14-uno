import express from "express";

import authRouter from "./auth";
import gameRouter from "./game";

import gameManager from "../game/GameStore";

const router = express.Router();

//maybe get is better
// router.get("/join", async (req, res) => {

// })
// router.post("/join", (req, res) => {
//   const { userId } = req.body;
//   if (!userId) {
//     res.status(401).json({ success: false, msg: "you are not logged in" });
//     return;
//   }
//   const gameId = gameManager.joinGame(userId);
//   if (!gameId) {
//     res.status(500).json({ success: false, msg: "error joining a game" });
//     return;
//   }

//   res.json({ success: true, gid: gameId });
// });

router.use("/auth", authRouter);
router.use("/game", gameRouter);

export default router;
