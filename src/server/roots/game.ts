import express from "express";

import gameManager from "../game/GameStore";
import { getIO } from "../socket/socket";
import { Action } from "../game/GameState";

import User from "../db/user/index";
import Game from "../db/game/index";
import { GameStateDB, GameDB } from "../db/game/GameDbType";

const router = express.Router();

router.post("/new-game", async (req, res) => {
  // @ts-ignore
  let userId = req.session.userId;
  // @ts-ignore
  let username = req.session.username;
  const options = req.body;
  const game_name = req.body.gid;
  // this is for testing!!
  // username = "hellomiles";
  // userId = await User.register(username, "12345");

  if (!userId || !username || !options || !options.gameName) {
    res.status(500).json({ success: false, msg: "you are not logged in" });
    return;
  }

  if (!userId || typeof userId !== "number") {
    res.status(500).json({ success: false, msg: "you are not logged in" });
    return;
  }
  if (!userId || !username) {
    res.status(401).json({ success: false, msg: "you are not logged in" });
    return;
  }

  const gameId = gameManager.newGame(
    Number(userId),
    username,
    options.gameName,
  );
  if (!gameId) {
    res.status(500).json({ success: false, msg: "error joining a game" });
    return;
  }

  res.json({ success: true, gid: gameId, userId: userId });
});

router.post("/join-game", async (req, res) => {
  // @ts-ignore
  let userId = req.session.userId;
  // @ts-ignore
  let username = req.session.username;
  const gid = req.body.gid;

  // this is for testing: temporarily create user
  // username = req.body.username;
  // userId = await User.register(username, "12345");

  if (!userId || typeof userId !== "number") {
    res.status(500).json({ success: false, msg: "you are not logged in" });
    return;
  }
  if (!userId || !username || !gid) {
    res.status(401).json({ success: false, msg: "you are not logged in" });
    return;
  }
  // player already in game
  if (
    gameManager.games[gid].players.filter((player) => player.userId === userId)
      .length === 1
  ) {
    res.json({ success: true, gid, userId: userId });
    return;
  }
  const gameId = gameManager.joinSpecificGame(Number(userId), username, gid);
  if (!gameId) {
    res.status(500).json({ success: false, msg: "error joining a game" });
    return;
  }

  res.json({ success: true, gid, userId: userId });
});

router.get("/my-active", async (req, res) => {
  // @ts-ignore
  let userId = req.session.userId;
  // @ts-ignore
  let username = req.session.username;

  // this is for testing
  // username = "hellomiles";
  // userId = 121;

  if (!userId || typeof userId !== "number") {
    res.status(500).json({ success: false, msg: "you are not logged in" });
    return;
  }

  try {
    const games = await Game.getUserGames(userId);
    res.json({ success: true, games: games });
  } catch (error) {
    res.json({ success: false });
  }
});

router.post("/play-card", (req, res) => {
  // @ts-ignore
  let userId = req.session.userId;
  // @ts-ignore
  let username = req.session.username;

  const { gid, action } = req.body;
  const typedAction = action as Action;

  // this is for testing
  // userId = req.body.userId;

  if (!userId || !gid || !typedAction) {
    res.status(401).json({ success: false, msg: "you are not logged in" });
    return;
  }

  const isPlay = gameManager.games[gid].update(typedAction);

  res.status(200).json({ success: true });
});

router.post("/draw-card", (req, res) => {
  // @ts-ignore
  let userId = req.session.userId;
  // @ts-ignore
  let username = req.session.username;
  const { gid, action } = req.body;
  const typedAction = action as Action;

  // this is for testing
  // userId = Number(req.body.userId);

  if (!userId || !gid || !typedAction) {
    res.status(401).json({ success: false, msg: "you are not logged in" });
    return;
  }

  gameManager.games[gid].update(typedAction);

  res.status(200).json({
    success: true,
    card: gameManager.games[gid].getLastCardInHand(userId),
  });
});

router.post("/state-update", async (req, res) => {
  // @ts-ignore
  let userId = req.session.userId;
  // @ts-ignore
  let username = req.session.username;
  const { gid } = req.body;

  // this is for testing
  // userId = Number(req.body.userId);

  if (!gid || !userId) {
    res.status(401).json({ success: false, msg: "error fetching state" });
  }
  const socket = gameManager.players[userId][gid].socketId;
  if (!socket) {
    res.status(401).json({ success: false, msg: "error fetching state" });
  }

  const playerState = gameManager.games[gid].getPlayerSubset(userId);
  getIO().to(socket!).emit("state-update", playerState);
  res.status(200).json({ success: true });
});

router.post("/state-only", async (req, res) => {
  // @ts-ignore
  let userId = req.session.userId;
  // @ts-ignore
  let username = req.session.username;
  const { gid } = req.body;

  // this is for testing
  // userId = Number(req.body.userId);

  if (!gid || !userId) {
    res.status(401).json({ success: false, msg: "error fetching state" });
  }

  const gs = gameManager.games[gid];

  res.status(200).json({ success: true, state: gs.state });
});

router.get("/open-games", async (req, res) => {
  // @ts-ignore
  let userId = req.session.userId;

  // this is for testing
  // userId = 1234;

  try {
    const games = await gameManager.getOpenGames(userId);
    res.status(200).json(games);
  } catch (error) {
    console.log("error in api route get open games: ", error);
  }
});

export default router;
