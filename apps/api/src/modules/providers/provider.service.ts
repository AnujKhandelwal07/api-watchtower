import {prisma} from "../../lib/prisma.js";
import { CreateProviderInput, UpdateProviderInput } from "./provider.schema.js";

export async function listProviders() {
  return prisma.provider.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getProviderById(id: string) {
  return prisma.provider.findUnique({
    where: { id },
  });
}

export async function createProvider(data: CreateProviderInput) {
  return prisma.provider.create({
    data: {
      ...data,
      baseUrl: data.baseUrl || null,
      specUrl: data.specUrl || null,
    },
  });
}

export async function updateProvider(id: string, data: UpdateProviderInput) {
  return prisma.provider.update({
    where: { id },
    data: {
      ...data,
      baseUrl: data.baseUrl === "" ? null : data.baseUrl,
      specUrl: data.specUrl === "" ? null : data.specUrl,
    },
  });
}

export async function deactivateProvider(id: string) {
  return prisma.provider.update({
    where: { id },
    data: { isActive: false },
  });
}