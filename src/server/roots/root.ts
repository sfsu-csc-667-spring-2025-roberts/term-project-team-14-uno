import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  const title = "Jacobs Site";
  const name = "Miles";

  res.render("index");
});
router.get("/gr", (req, res) => {
  const title = "Jacobs Site";
  const name = "Miles";

  res.render("root");
});

export default router;
