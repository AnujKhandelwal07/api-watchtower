import type { Request, Response } from "express";
import {
  createLatestSnapshotDiff,
  listDiffsByProvider,
} from "./diff.service.js";

type ProviderParams = {
  providerId: string;
};

export async function handleCreateLatestDiff(
  req: Request<ProviderParams>,
  res: Response,
) {
  try {
    const diff = await createLatestSnapshotDiff(req.params.providerId);
    return res.status(201).json({ data: diff });
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_ENOUGH_SNAPSHOTS") {
      return res.status(400).json({
        message: "At least two successful snapshots are required",
      });
    }

    return res.status(500).json({ message: "Failed to create diff" });
  }
}

export async function handleListDiffs(
  req: Request<ProviderParams>,
  res: Response,
) {
  const diffs = await listDiffsByProvider(req.params.providerId);
  return res.json({ data: diffs });
}
