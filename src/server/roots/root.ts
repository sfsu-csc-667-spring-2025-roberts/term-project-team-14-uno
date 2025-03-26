import express from "express";
import gameManager from "../game/GameStore";

const router = express.Router();

router.get("/", (req, res) => {
  const title = "Jacobs Site";
  const name = "Miles";

  res.render("index");
});
router.get("/game", (req, res) => {
  // console.log(gameManager.games);
  res.render("game-room");
});

export default router;
