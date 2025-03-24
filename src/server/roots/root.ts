import express from "express";
import gameManager from "../game/GameStore";

const router = express.Router();

router.get("/", (req, res) => {
  const title = "Jacobs Site";
  const name = "Miles";

  res.render("index");
});
router.get("/game", (req, res) => {
  const title = "Jacobs Site";
  const name = "Miles";
  console.log(gameManager.games);
  res.render("root");
});

export default router;
