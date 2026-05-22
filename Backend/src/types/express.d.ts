import { UserRole } from "@prisma/client";

export type AuthContext = {
  sub: string;
  role: UserRole | "CUSTOMER";
  restaurantId: string;
  tableId?: string;
  sessionId?: string;
};

declare module "express-serve-static-core" {
  interface Request {
    auth?: AuthContext;
  }
}
