import { prisma } from "../../lib/prisma.js";
import { publishAlertToSNS } from "../../lib/sns.js";

export async function createAlertForDiff(
  providerId: string,
  diffId: string,
  message: string,
) {
  const provider = await prisma.provider.findUnique({
    where: { id: providerId },
    select: { name: true },
  });

  const alert = await prisma.alert.create({
    data: {
      providerId,
      diffId,
      type: "CHANGE_DETECTED",
      message,
    },
  });

  publishAlertToSNS({
    providerId,
    providerName: provider?.name ?? providerId,
    diffId,
    message,
  })
    .then(async (snsMessageId) => {
      if (snsMessageId) {
        await prisma.alert.update({
          where: { id: alert.id },
          data: { snsMessageId },
        });
      }
    })
    .catch((err: unknown) => {
      console.error("[sns] Failed to publish SNS alert", alert.id, err);
    });

  return alert;
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

  if (!alert) throw new Error("ALERT_NOT_FOUND");

  return prisma.alert.update({
    where: { id: alertId },
    data: {
      isRead: true,
      acknowledgedAt: new Date(),
    },
  });
}