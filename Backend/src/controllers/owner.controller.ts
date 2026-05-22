import { Request, Response } from "express";
import { z } from "zod";

import {
  createWaiter,
  getOwnerDashboard,
  updateRestaurantSettings,
  uploadRestaurantAsset,
  upsertCategory,
  upsertMenuItem,
  upsertPromo,
} from "../services/owner.service";

const settingsSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  logoUrl: z.string().url().optional(),
  heroImageUrl: z.string().url().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  bgColor: z.string().optional(),
  textColor: z.string().optional(),
  taxPercent: z.number().optional(),
  servicePercent: z.number().optional(),
});

export async function ownerDashboardController(req: Request, res: Response) {
  const result = await getOwnerDashboard(req.auth!.restaurantId);
  res.json(result);
}

export async function ownerSettingsController(req: Request, res: Response) {
  try {
    const payload = settingsSchema.parse(req.body);
    const result = await updateRestaurantSettings(
      req.auth!.restaurantId,
      payload
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({
      message:
        error instanceof Error ? error.message : "Invalid settings payload",
    });
  }
}

export async function ownerUploadController(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const folder = req.body.folder || "general";
    const uploaded = await uploadRestaurantAsset(
      req.auth!.restaurantId,
      req.file,
      folder
    );
    res.status(201).json(uploaded);
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "Upload failed",
    });
  }
}

export async function ownerCreateWaiterController(req: Request, res: Response) {
  try {
    const payload = z
      .object({
        fullName: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(6),
      })
      .parse(req.body);

    const waiter = await createWaiter(
      req.auth!.restaurantId,
      payload.fullName,
      payload.email,
      payload.password
    );
    res.status(201).json(waiter);
  } catch (error) {
    res.status(400).json({
      message:
        error instanceof Error ? error.message : "Failed to create waiter",
    });
  }
}

export async function ownerCategoryController(req: Request, res: Response) {
  try {
    const payload = z
      .object({
        id: z.string().optional(),
        name: z.string(),
        position: z.number().default(0),
      })
      .parse(req.body);
    const result = await upsertCategory(
      req.auth!.restaurantId,
      payload.id,
      payload.name,
      payload.position
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({
      message:
        error instanceof Error ? error.message : "Failed to save category",
    });
  }
}

export async function ownerMenuController(req: Request, res: Response) {
  try {
    const payload = z
      .object({
        id: z.string().optional(),
        categoryId: z.string().optional(),
        slug: z.string(),
        name: z.string(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        basePrice: z.number(),
        isAvailable: z.boolean().optional(),
      })
      .parse(req.body);

    const result = await upsertMenuItem(req.auth!.restaurantId, payload);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "Failed to save menu",
    });
  }
}

export async function ownerPromoController(req: Request, res: Response) {
  try {
    const payload = z
      .object({
        id: z.string().optional(),
        title: z.string(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        startsAt: z.string(),
        endsAt: z.string(),
        isActive: z.boolean().optional(),
      })
      .parse(req.body);

    const result = await upsertPromo(req.auth!.restaurantId, payload);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "Failed to save promo",
    });
  }
}
