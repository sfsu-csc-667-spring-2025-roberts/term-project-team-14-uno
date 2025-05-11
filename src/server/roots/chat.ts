import express from "express";

import { Request, Response } from "express";
import { getIO } from "../socket/socket";

const router = express.Router();

router.post("/post", async (req: Request, res: Response) => {
  console.log("chat post hit");
  const { message, userId, gid } = req.body;
  if (!message || !userId || !gid) {
    console.log("no chat message or gid or userid");
    return;
  }
  console.log(
    "chat message: ",
    message,
    " userid: ",
    userId,
    " game id: ",
    gid,
  );
  //   @ts-ignore
  //   req.session.userId = id;
  //   //   @ts-ignore
  //   req.session.username = email;
  getIO()
    .to(gid)
    .emit("chat-message", {
      body: message,
      user: {
        id: userId,
        username: "someUsername",
      },
    });
});

export default router;
