import express from "express";
import gameManager from "../game/GameStore";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.get("/", authMiddleware, (req, res) => {
  res.render("index");
});
router.get("/game", authMiddleware, (req, res) => {
  res.render("game-room");
});
router.get("/register", (req, res) => {
  res.render("register");
});
router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/faq", (req, res) => {
  res.render("faq");
});

export default router;
