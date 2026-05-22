import { Request, Response } from "express";

export function healthController(_req: Request, res: Response) {
  res.json({
    ok: true,
    service: "self-order-backend",
    timestamp: new Date().toISOString(),
  });
}
