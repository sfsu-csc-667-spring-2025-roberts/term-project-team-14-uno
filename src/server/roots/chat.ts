import express from "express";

import { Request, Response } from "express";
import { getIO } from "../socket/socket";

const router = express.Router();

router.post("/post", async (req: Request, res: Response) => {
  // @ts-ignore
  let userId = req.session.userId;
  // @ts-ignore
  let username = req.session.username;
  const { message, gid } = req.body;

  // this is for testing
  // userId = req.body.userId;
  // username = "miles@gmail.com";

  if (!message || !userId || !gid) {
    res.status(500).json({ success: false });
    return;
  }

  getIO()
    .to(gid)
    .emit("chat-message", {
      body: message,
      user: {
        id: username,
        username: "someUsername",
      },
    });
  res.status(200).json({ success: true });
});

export default router;
