import express from "express";
import gameManager from "../game/GameStore";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});
router.get("/game", (req, res) => {
  res.render("game-room");
});

export default router;
