-- CreateTable
CREATE TABLE "SnapshotDiff" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "previousSnapshotId" TEXT NOT NULL,
    "currentSnapshotId" TEXT NOT NULL,
    "hasChanges" BOOLEAN NOT NULL,
    "summary" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SnapshotDiff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SnapshotDiff_providerId_createdAt_idx" ON "SnapshotDiff"("providerId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SnapshotDiff_previousSnapshotId_currentSnapshotId_key" ON "SnapshotDiff"("previousSnapshotId", "currentSnapshotId");

-- AddForeignKey
ALTER TABLE "SnapshotDiff" ADD CONSTRAINT "SnapshotDiff_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SnapshotDiff" ADD CONSTRAINT "SnapshotDiff_previousSnapshotId_fkey" FOREIGN KEY ("previousSnapshotId") REFERENCES "Snapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SnapshotDiff" ADD CONSTRAINT "SnapshotDiff_currentSnapshotId_fkey" FOREIGN KEY ("currentSnapshotId") REFERENCES "Snapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
