import express from "express";
import bcrypt from "bcrypt";
import User from "../db/user/index";

import { Request, Response } from "express";

const router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const id = await User.register(email, password);
  console.log("user created: ", id);

  //   @ts-ignore
  req.session.userId = id;
  //   @ts-ignore
  req.session.username = email;

  res.redirect("/");
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.login(email, password);
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
  let userId = req.session?.userId;
  // @ts-ignore
  let username = req.session?.username;

  //this is for testing
  // userId = 111;
  // username = "miles@gmail.com";

  if (userId) {
    res.json({ userId, username });
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

export default router;
