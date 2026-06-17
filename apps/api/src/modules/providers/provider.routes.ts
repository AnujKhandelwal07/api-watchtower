import { Router } from "express";
import {
  handleCreateProvider,
  handleDeactivateProvider,
  handleGetProvider,
  handleListProviders,
  handleUpdateProvider,
} from "./provider.controller.js";

const router = Router();

router.get("/", handleListProviders);
router.get("/:id", handleGetProvider);
router.post("/", handleCreateProvider);
router.patch("/:id", handleUpdateProvider);
router.delete("/:id", handleDeactivateProvider);

export default router;