import { Router, type Request, type Response } from "express";
import { calculateCombinations } from "../services/combinationService.js";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  const combinations = calculateCombinations();
  res.json({ combinations });
});

router.post("/recalculate", (_req: Request, res: Response) => {
  const combinations = calculateCombinations();
  res.json({ combinations });
});

export default router;
