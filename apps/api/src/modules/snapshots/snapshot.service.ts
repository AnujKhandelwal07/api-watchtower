import {prisma} from "../../lib/prisma.js";

export async function runSnapshot(providerId: string) {
  const provider = await prisma.provider.findUnique({
    where: { id: providerId },
  });

  if (!provider) {
    throw new Error("PROVIDER_NOT_FOUND");
  }

  if (!provider.specUrl) {
    throw new Error("PROVIDER_SPEC_URL_MISSING");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(provider.specUrl, {
      method: "GET",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    const contentType = response.headers.get("content-type");

    let rawPayload: unknown = null;
    let errorMessage: string | null = null;

    try {
      rawPayload = await response.json();
    } catch {
      errorMessage = "Failed to parse JSON response";
    }

    const snapshot = await prisma.snapshot.create({
      data: {
        providerId: provider.id,
        sourceUrl: provider.specUrl,
        status: response.ok && rawPayload ? "success" : "failed",
        httpStatus: response.status,
        contentType,
        rawPayload: rawPayload ?? undefined,
        errorMessage,
      },
    });

    return snapshot;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown snapshot error";

    const snapshot = await prisma.snapshot.create({
      data: {
        providerId: provider.id,
        sourceUrl: provider.specUrl,
        status: "failed",
        errorMessage: message,
      },
    });

    return snapshot;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function listSnapshotsByProvider(providerId: string) {
  return prisma.snapshot.findMany({
    where: { providerId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}