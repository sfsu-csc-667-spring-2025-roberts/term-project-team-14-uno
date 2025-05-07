import express from "express";

import gameManager from "../game/GameStore";
import { getIO } from "../socket/socket";
import { Action } from "../game/GameState";

const router = express.Router();

//maybe get is better
// router.get("/join", async (req, res) => {

// })
router.post("/join", (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    res.status(401).json({ success: false, msg: "you are not logged in" });
    return;
  }
  const gameId = gameManager.joinGame(userId);
  if (!gameId) {
    res.status(500).json({ success: false, msg: "error joining a game" });
    return;
  }

  res.json({ success: true, gid: gameId });
});

router.post("/play-card", (req, res) => {
  const { userId, gid, action } = req.body;
  const typedAction = action as Action;
  if (!userId || !gid || !typedAction) {
    res.status(401).json({ success: false, msg: "you are not logged in" });
    return;
  }

  const isPlay = gameManager.games[gid].update(action);

  res.json({ success: true });
});

router.post("state-update", async (req, res) => {
  const { gid, userId } = req.body;
  if (!gid || !userId) {
    res.status(401).json({ success: false, msg: "error fetching state" });
  }
  const socket = gameManager.players[userId].socketId;
  if (!socket) {
    res.status(401).json({ success: false, msg: "error fetching state" });
  }
  const playerState = gameManager.games[gid].getPlayerSubset(userId);
  getIO().to(socket!).emit("state-update", playerState);
});

export default router;
