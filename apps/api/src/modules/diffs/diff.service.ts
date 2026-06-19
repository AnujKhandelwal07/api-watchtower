
import { prisma } from "../../lib/prisma.js";

function getTopLevelKeys(value: unknown): string[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [];
  return Object.keys(value as Record<string, unknown>).sort();
}

function stableStringify(value: unknown): string {
  return JSON.stringify(value, Object.keys((value as Record<string, unknown>) || {}).sort());
}

export async function createLatestSnapshotDiff(providerId: string) {
  const snapshots = await prisma.snapshot.findMany({
    where: {
      providerId,
      status: "success",
      rawPayload: { not: undefined },
    },
    orderBy: { createdAt: "desc" },
    take: 2,
  });

  if (snapshots.length < 2) {
    throw new Error("NOT_ENOUGH_SNAPSHOTS");
  }

  const [current, previous] = snapshots;

  const previousKeys = getTopLevelKeys(previous.rawPayload);
  const currentKeys = getTopLevelKeys(current.rawPayload);

  const addedKeys = currentKeys.filter((key) => !previousKeys.includes(key));
  const removedKeys = previousKeys.filter((key) => !currentKeys.includes(key));

  const previousString = JSON.stringify(previous.rawPayload);
  const currentString = JSON.stringify(current.rawPayload);

  const hasChanges = previousString !== currentString;

  const summary = {
    previousSnapshotId: previous.id,
    currentSnapshotId: current.id,
    previousTopLevelKeys: previousKeys,
    currentTopLevelKeys: currentKeys,
    addedKeys,
    removedKeys,
    previousSize: previousString.length,
    currentSize: currentString.length,
  };

  const diff = await prisma.snapshotDiff.upsert({
    where: {
      previousSnapshotId_currentSnapshotId: {
        previousSnapshotId: previous.id,
        currentSnapshotId: current.id,
      },
    },
    update: {
      hasChanges,
      summary,
    },
    create: {
      providerId,
      previousSnapshotId: previous.id,
      currentSnapshotId: current.id,
      hasChanges,
      summary,
    },
  });

  return diff;
}

export async function listDiffsByProvider(providerId: string) {
  return prisma.snapshotDiff.findMany({
    where: { providerId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}