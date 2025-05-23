import express from "express";

import { Request, Response } from "express";
import { getIO } from "../socket/socket";

const router = express.Router();

router.post("/post", async (req: Request, res: Response) => {
  // @ts-ignore
  let userId = req.session.userId;
  // @ts-ignore
  let username = req.session.username;

  console.log("chat post hit with uid: ", userId, "and username: ", username);

  userId = req.body.userId;
  const { message, gid } = req.body;
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
