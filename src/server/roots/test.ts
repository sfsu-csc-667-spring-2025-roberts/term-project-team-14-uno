import express from "express";
import { Request, Response } from "express";

import db from "../db/connection";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    await db.none("INSERT INTO test_tab (test_string) VALUES ($1)", [
      `Test string ${new Date().toISOString()}`,
    ]);
    res.json(await db.any("SELECT * FROM test_tab"));
  } catch (error) {
    console.error(error);
  }
});

export default router;
