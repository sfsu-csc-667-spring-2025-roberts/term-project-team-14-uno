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
  console.log(
    "in new game with uid: ",
    userId,
    " username: ",
    username,
    " and options: ",
    options,
  );
  // this is for testing!!
  const game_name = req.body.gid;
  username = "hellomiles";
  userId = await User.register(username, "12345");

  if (!userId || !username || !options || !options.gameName) {
    console.log("something wasnt defined in new game");
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
  username = req.body.username;
  const gid = req.body.gid;

  // this is for testing: temporarily create user
  userId = await User.register(username, "12345");

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
  // console.log("gm after: ", gameManager);
  // console.log("now game state is: ", gameManager.games[gameId]);

  res.json({ success: true, gid, userId: userId });
});

router.get("/my-active", async (req, res) => {
  // @ts-ignore
  let userId = req.session.userId;
  // @ts-ignore
  let username = req.session.username;

  // this is for testing
  username = "hellomiles";
  userId = 121;

  if (!userId || typeof userId !== "number") {
    res.status(500).json({ success: false, msg: "you are not logged in" });
    return;
  }

  try {
    const games = await Game.getUserGames(userId);
    console.log("in my active route: ", games);
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
  userId = req.body.userId;

  console.log("in play card route handle with action: ", typedAction);
  if (!userId || !gid || !typedAction) {
    res.status(401).json({ success: false, msg: "you are not logged in" });
    return;
  }

  const isPlay = gameManager.games[gid].update(typedAction);
  console.log("play card: ", gameManager.games[gid].state);

  res.status(200).json({ success: true });
});

router.post("/draw-card", (req, res) => {
  // console.log("in draw card")
  // @ts-ignore
  let userId = req.session.userId;
  // @ts-ignore
  let username = req.session.username;
  const { gid, action } = req.body;
  const typedAction = action as Action;

  // this is for testing
  userId = Number(req.body.userId);

  if (!userId || !gid || !typedAction) {
    res.status(401).json({ success: false, msg: "you are not logged in" });
    return;
  }
  // console.log("gotten here in draw card")

  gameManager.games[gid].update(typedAction);
  // console.log("logging players from rh: ", gameManager.games[gid].players)
  console.log("drew card: ", gameManager.games[gid].getLastCardInHand(userId));

  res
    .status(200)
    .json({
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
  userId = Number(req.body.userId);

  if (!gid || !userId) {
    res.status(401).json({ success: false, msg: "error fetching state" });
  }
  const socket = gameManager.players[userId][gid].socketId;
  if (!socket) {
    res.status(401).json({ success: false, msg: "error fetching state" });
  }
  console.log("fetching game state for: ", userId, " and gid: ", gid);
  const playerState = gameManager.games[gid].getPlayerSubset(userId);
  // console.log("player state from state update route: ", playerState);
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
  userId = Number(req.body.userId);

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
  userId = 1234;

  console.log("searching open games with: ", userId);

  try {
    const games = await gameManager.getOpenGames(userId);
    res.status(200).json(games);
  } catch (error) {
    console.log("error in api route get open games: ", error);
  }
});

export default router;
