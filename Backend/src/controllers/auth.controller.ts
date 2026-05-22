import { Request, Response } from "express";
import { z } from "zod";

import {
  createCustomerSession,
  loginUser,
  registerOwner,
} from "../services/auth.service";

const ownerRegisterSchema = z.object({
  restaurantName: z.string().min(2),
  restaurantSlug: z.string().min(2),
  ownerName: z.string().min(2),
  ownerEmail: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const customerSessionSchema = z.object({
  tableCode: z.string().min(1),
  guestName: z.string().optional(),
});

export async function ownerRegisterController(req: Request, res: Response) {
  try {
    const payload = ownerRegisterSchema.parse(req.body);
    const result = await registerOwner(payload);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      message:
        error instanceof Error ? error.message : "Failed to register owner",
    });
  }
}

export async function loginController(req: Request, res: Response) {
  try {
    const payload = loginSchema.parse(req.body);
    const result = await loginUser(payload.email, payload.password);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "Failed to login",
    });
  }
}

export async function customerSessionController(req: Request, res: Response) {
  try {
    const payload = customerSessionSchema.parse(req.body);
    const result = await createCustomerSession(
      payload.tableCode,
      payload.guestName
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to create customer session",
    });
  }
}
