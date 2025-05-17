import express from "express";

import gameManager from "../game/GameStore";
import { getIO } from "../socket/socket";
import { Action } from "../game/GameState";

import User from "../db/user/index";

const router = express.Router();

router.post("/new-game", async (req, res) => {
  // // @ts-ignore
  // const userId = req.session.userId
  // // @ts-ignore
  // const username = req.session.username
  const username = "hellomiles";
  const userId = await User.register(username, "12345");
  if (!userId || typeof userId !== "number") {
    res.status(500).json({ success: false, msg: "you are not logged in" });
    return;
  }
  if (!userId || !username) {
    res.status(401).json({ success: false, msg: "you are not logged in" });
    return;
  }

  const gameId = gameManager.newGame(Number(userId), username);
  if (!gameId) {
    res.status(500).json({ success: false, msg: "error joining a game" });
    return;
  }

  res.json({ success: true, gid: gameId, userId: userId });
});

router.post("/join-game", async (req, res) => {
  const { username, gid } = req.body;
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
  if (!userId || !username || !gid) {
    res.status(401).json({ success: false, msg: "you are not logged in" });
    return;
  }
  // console.log("gm before: ", gameManager);
  const gameId = gameManager.joinSpecificGame(Number(userId), username, gid);
  if (!gameId) {
    res.status(500).json({ success: false, msg: "error joining a game" });
    return;
  }
  // console.log("gm after: ", gameManager);
  // console.log("now game state is: ", gameManager.games[gameId]);

  res.json({ success: true, gid, userId: userId });
});

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
  // console.log("gm before: ", gameManager);
  const gameId = gameManager.joinGame(Number(userId), username);
  if (!gameId) {
    res.status(500).json({ success: false, msg: "error joining a game" });
    return;
  }
  // console.log("gm after: ", gameManager);
  // console.log("now game state is: ", gameManager.games[gameId]);

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

router.post("/draw-card", (req, res) => {
  const { userId, gid, action } = req.body;
  // const {userId, gid} = req.session
  const typedAction = action as Action;
  if (!userId || !gid || !typedAction) {
    res.status(401).json({ success: false, msg: "you are not logged in" });
    return;
  }

  gameManager.games[gid].update(typedAction);
  console.log("drew card: ", gameManager.games[gid].topCard);

  res.json({ success: true, card: gameManager.games[gid].topCard });
});

router.post("/state-update", async (req, res) => {
  const { gid } = req.body;
  const userId = Number(req.body.userId);

  if (!gid || !userId) {
    res.status(401).json({ success: false, msg: "error fetching state" });
  }
  const socket = gameManager.players[userId].socketId;
  if (!socket) {
    res.status(401).json({ success: false, msg: "error fetching state" });
  }
  console.log("fetching game state for: ", userId, " and gid: ", gid);
  const playerState = gameManager.games[gid].getPlayerSubset(userId);
  // console.log("player state from state update route: ", playerState);
  getIO().to(socket!).emit("state-update", playerState);
});

router.get("/open-games", async (req, res) => {
  try {
    const games = await gameManager.getOpenGames();
    res.status(200).json(games);
  } catch (error) {
    console.log("error in api route get open games: ", error);
  }
});

export default router;
