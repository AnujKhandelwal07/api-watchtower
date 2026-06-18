import type { Request, Response } from "express";
import { listSnapshotsByProvider, runSnapshot } from "./snapshot.service.js";

export async function handleRunSnapshot(req: Request<{ providerId: string }>, res: Response) {
  try {
    const snapshot = await runSnapshot(req.params.providerId);
    return res.status(201).json({ data: snapshot });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "PROVIDER_NOT_FOUND") {
        return res.status(404).json({ message: "Provider not found" });
      }

      if (error.message === "PROVIDER_SPEC_URL_MISSING") {
        return res.status(400).json({ message: "Provider specUrl is required" });
      }
    }

    return res.status(500).json({ message: "Failed to run snapshot" });
  }
}

export async function handleListSnapshots(req: Request<{ providerId: string }>, res: Response) {
  const snapshots = await listSnapshotsByProvider(req.params.providerId);
  return res.json({ data: snapshots });
}