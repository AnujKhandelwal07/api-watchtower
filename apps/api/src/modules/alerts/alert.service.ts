import { prisma } from "../../lib/prisma.js";

export async function createAlertForDiff(
  providerId: string,
  diffId: string,
  message: string
) {
  return prisma.alert.create({
    data: {
      providerId,
      diffId,
      type: "CHANGE_DETECTED",
      message,
    },
  });
}

export async function listAlertsByProvider(providerId: string) {
  return prisma.alert.findMany({
    where: { providerId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function acknowledgeAlert(alertId: string) {
  const alert = await prisma.alert.findUnique({ where: { id: alertId } });

  if (!alert) {
    throw new Error("ALERT_NOT_FOUND");
  }

  return prisma.alert.update({
    where: { id: alertId },
    data: {
      isRead: true,
      acknowledgedAt: new Date(),
    },
  });
}