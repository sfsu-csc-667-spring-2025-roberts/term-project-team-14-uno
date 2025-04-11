import express from "express";
import bcrypt from "bcrypt";
import User from "../db/user/index";

import { Request, Response } from "express";

const router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
  console.log("reg hit");
  const { email, password } = req.body;

  const id = await User.register(email, password);

  res.json({ success: true, id });
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
  res.json({ success: true, id: user.id });
});

export default router;
