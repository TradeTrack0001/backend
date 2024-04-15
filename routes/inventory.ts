import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("Inventory page");
});

export default router;
