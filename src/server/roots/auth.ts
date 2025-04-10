import express from "express";

import { Request, Response } from "express";

const router = express.Router();

router.get("/test", (req: Request, res: Response) => {
  res.json({ Hello: "World" });
});

export default router;
