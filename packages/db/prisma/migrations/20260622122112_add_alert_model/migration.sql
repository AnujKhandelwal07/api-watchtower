-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "diffId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'CHANGE_DETECTED',
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "acknowledgedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Alert_providerId_createdAt_idx" ON "Alert"("providerId", "createdAt");

-- CreateIndex
CREATE INDEX "Alert_isRead_idx" ON "Alert"("isRead");

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_diffId_fkey" FOREIGN KEY ("diffId") REFERENCES "SnapshotDiff"("id") ON DELETE CASCADE ON UPDATE CASCADE;
