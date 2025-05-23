import express from "express";
import bcrypt from "bcrypt";
import User from "../db/user/index";

import { Request, Response } from "express";

const router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
  console.log("reg hit");
  const { email, password } = req.body;

  const id = await User.register(email, password);

  //   @ts-ignore
  req.session.userId = id;
  //   @ts-ignore
  req.session.username = email;

  res.redirect("/");
});

router.post("/login", async (req: Request, res: Response) => {
  console.log("login hit");
  const { email, password } = req.body;
  const user = await User.login(email, password);
  console.log(user);
  if (!user) {
    res.status(401).json({ success: false, id: null });
    return;
  }

  // @ts-ignore
  req.session.userId = user.id;
  //   @ts-ignore
  req.session.username = email;
  res.redirect("/");
});

router.get("/logout", async (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

router.get("/session", async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.session?.userId;
  // @ts-ignore
  const username = req.session?.username;

  if (userId) {
    res.json({ userId, username });
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

export default router;
