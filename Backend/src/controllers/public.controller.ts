import { Request, Response } from "express";

import {
  getOrderStatus,
  getPublicRestaurant,
} from "../services/public.service";

export async function publicRestaurantController(_req: Request, res: Response) {
  const restaurant = await getPublicRestaurant();
  res.json({ restaurant });
}

export async function orderStatusController(req: Request, res: Response) {
  const orderId = Array.isArray(req.params.orderId)
    ? req.params.orderId[0]
    : req.params.orderId;
  const order = await getOrderStatus(orderId);
  res.json({ order });
}
