import jwt from "jsonwebtoken";

import { env } from "../config/env";
import { AuthContext } from "../types/express";

export function signToken(payload: AuthContext) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.jwtSecret) as AuthContext;
}
