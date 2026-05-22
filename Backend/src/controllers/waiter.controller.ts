import { OrderStatus, ServiceCallStatus } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";

import {
  getWaiterBoard,
  updateCallStatus,
  updateOrderStatus,
} from "../services/waiter.service";

export async function waiterBoardController(req: Request, res: Response) {
  const result = await getWaiterBoard(req.auth!.restaurantId);
  res.json(result);
}

export async function waiterOrderStatusController(req: Request, res: Response) {
  try {
    const payload = z
      .object({ orderId: z.string(), status: z.nativeEnum(OrderStatus) })
      .parse(req.body);
    const order = await updateOrderStatus(payload.orderId, payload.status);
    res.json(order);
  } catch (error) {
    res.status(400).json({
      message:
        error instanceof Error ? error.message : "Failed to update order",
    });
  }
}

export async function waiterCallStatusController(req: Request, res: Response) {
  try {
    const payload = z
      .object({ callId: z.string(), status: z.nativeEnum(ServiceCallStatus) })
      .parse(req.body);
    const call = await updateCallStatus(payload.callId, payload.status);
    res.json(call);
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "Failed to update call",
    });
  }
}
