import { Router } from "express";
import {
  handleListAlerts,
  handleAcknowledgeAlert,
} from "./alert.controller.js";

// Provider-scoped alerts: GET /providers/:providerId/alerts
const providerAlertRouter = Router({ mergeParams: true });
providerAlertRouter.get("/", handleListAlerts);

// Alert-scoped operations: PATCH /alerts/:alertId/acknowledge
const alertRouter = Router({ mergeParams: true });
alertRouter.patch("/:alertId/acknowledge", handleAcknowledgeAlert);

export { providerAlertRouter, alertRouter };