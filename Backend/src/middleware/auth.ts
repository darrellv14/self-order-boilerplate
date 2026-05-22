import { NextFunction, Request, Response } from "express";

import { verifyToken } from "../lib/jwt";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    req.auth = verifyToken(header.replace("Bearer ", ""));
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export function requireRole(roles: Array<"OWNER" | "WAITER" | "CUSTOMER">) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
}
