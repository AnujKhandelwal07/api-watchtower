import { Router } from "express";
import { handleCreateLatestDiff, handleListDiffs } from "./diff.controller.js"

const router = Router({ mergeParams: true });

router.get("/", handleListDiffs);
router.post("/run", handleCreateLatestDiff);

export default router;