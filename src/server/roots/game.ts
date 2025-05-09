import express from "express";

import gameManager from "../game/GameStore";
import { getIO } from "../socket/socket";
import { Action } from "../game/GameState";

import User from "../db/user/index";

const router = express.Router();

//maybe get is better
// router.get("/join", async (req, res) => {

// })
router.post("/join", async (req, res) => {
  const { username } = req.body;
  // temporarily create user
  const userId = await User.register(username, "12345");
  if (!userId || typeof userId !== "number") {
    res.status(500).json({ success: false, msg: "you are not logged in" });
    return;
  }
  // // @ts-ignore
  // const userId = req.session.userId
  // // @ts-ignore
  // const username = req.session.username
  if (!userId || !username) {
    res.status(401).json({ success: false, msg: "you are not logged in" });
    return;
  }
  console.log("gm before: ", gameManager);
  const gameId = gameManager.joinGame(Number(userId), username);
  if (!gameId) {
    res.status(500).json({ success: false, msg: "error joining a game" });
    return;
  }
  console.log("gm after: ", gameManager);
  console.log("now game state is: ", gameManager.games[gameId]);

  res.json({ success: true, gid: gameId, userId: userId });
});

router.post("/play-card", (req, res) => {
  const { userId, gid, action } = req.body;
  const typedAction = action as Action;
  if (!userId || !gid || !typedAction) {
    res.status(401).json({ success: false, msg: "you are not logged in" });
    return;
  }

  const isPlay = gameManager.games[gid].update(typedAction);
  console.log("play card: ", gameManager.games[gid].state);

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
