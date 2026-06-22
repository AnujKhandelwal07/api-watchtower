import type { Request, Response } from "express";
import {
  acknowledgeAlert,
  listAlertsByProvider,
} from "./alert.service.js";

type AlertRouteParams = {
  providerId: string;
  alertId: string;
};

export async function handleListAlerts(req: Request<AlertRouteParams>, res: Response) {
  const alerts = await listAlertsByProvider(req.params.providerId);
  return res.json({ data: alerts });
}

export async function handleAcknowledgeAlert(req: Request<AlertRouteParams>, res: Response) {
  try {
    const alert = await acknowledgeAlert(req.params.alertId);
    return res.json({ data: alert });
  } catch (err) {
    if (err instanceof Error && err.message === "ALERT_NOT_FOUND") {
      return res.status(404).json({ message: "Alert not found" });
    }
    return res.status(500).json({ message: "Failed to acknowledge alert" });
  }
}