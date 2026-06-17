import { Request, Response } from "express";
import {
  createProvider,
  deactivateProvider,
  getProviderById,
  listProviders,
  updateProvider,
} from "./provider.service.js";
import { createProviderSchema, updateProviderSchema } from "./provider.schema.js";

export async function handleListProviders(_req: Request, res: Response) {
  const providers = await listProviders();
  res.json({ data: providers });
}

export async function handleGetProvider(req: Request<{ id: string }>, res: Response) {
  const provider = await getProviderById(req.params.id);

  if (!provider) {
    return res.status(404).json({ message: "Provider not found" });
  }

  return res.json({ data: provider });
}

export async function handleCreateProvider(req: Request, res: Response) {

  const parsed = createProviderSchema.safeParse(req.body);

  if (!parsed.success) {

    return res.status(400).json({
      message: "Validation failed",
      errors: parsed.error.flatten(),
    });
  }

  try {
    const provider = await createProvider(parsed.data);
    return res.status(201).json({ data: provider });
  } catch (error) {

    return res.status(409).json({
      message: "Provider creation failed",
    });
  }
}
export async function handleUpdateProvider(req: Request<{ id: string }>, res: Response) {
  const parsed = updateProviderSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: parsed.error.flatten(),
    });
  }

  try {
    const provider = await updateProvider(req.params.id, parsed.data);
    return res.json({ data: provider });
  } catch {
    return res.status(404).json({ message: "Provider not found" });
  }
}

export async function handleDeactivateProvider(req: Request<{ id: string }>, res: Response) {
  try {
    const provider = await deactivateProvider(req.params.id);
    return res.json({ data: provider });
  } catch {
    return res.status(404).json({ message: "Provider not found" });
  }
}