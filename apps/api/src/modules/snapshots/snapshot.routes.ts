import { Router } from "express";
import {
  handleListSnapshots,
  handleRunSnapshot,
} from "./snapshot.controller.js";

const router = Router({ mergeParams: true });

router.get("/", handleListSnapshots);
router.post("/run", handleRunSnapshot);

export default router;