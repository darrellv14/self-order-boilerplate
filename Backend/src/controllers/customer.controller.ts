import { Request, Response } from "express";
import { z } from "zod";

import {
  callWaiter,
  createOrder,
  markOrderPaid,
} from "../services/customer.service";

export async function createOrderController(req: Request, res: Response) {
  try {
    const payload = z
      .object({
        customerName: z.string().optional(),
        specialNotes: z.string().optional(),
        items: z.array(
          z.object({
            menuItemId: z.string(),
            quantity: z.number().min(1),
            notes: z.string().optional(),
            modifiers: z.unknown().optional(),
          })
        ),
      })
      .parse(req.body);

    const order = await createOrder({
      restaurantId: req.auth!.restaurantId,
      tableId: req.auth!.tableId!,
      customerSessionId: req.auth!.sessionId!,
      customerName: payload.customerName,
      specialNotes: payload.specialNotes,
      items: payload.items,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({
      message:
        error instanceof Error ? error.message : "Failed to create order",
    });
  }
}

export async function simulatePaymentController(req: Request, res: Response) {
  try {
    const payload = z.object({ orderId: z.string() }).parse(req.body);
    const order = await markOrderPaid(payload.orderId);
    res.json(order);
  } catch (error) {
    res.status(400).json({
      message:
        error instanceof Error ? error.message : "Failed to simulate payment",
    });
  }
}

export async function callWaiterController(req: Request, res: Response) {
  try {
    const payload = z
      .object({ message: z.string().optional() })
      .parse(req.body);
    const call = await callWaiter({
      restaurantId: req.auth!.restaurantId,
      tableId: req.auth!.tableId!,
      customerSessionId: req.auth!.sessionId!,
      message: payload.message,
    });

    res.status(201).json(call);
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "Failed to call waiter",
    });
  }
}
