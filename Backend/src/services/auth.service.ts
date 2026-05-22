import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

import { signToken } from "../lib/jwt";
import { prisma } from "../lib/prisma";

type RegisterOwnerInput = {
  restaurantName: string;
  restaurantSlug: string;
  ownerName: string;
  ownerEmail: string;
  password: string;
};

export async function registerOwner(input: RegisterOwnerInput) {
  const existing = await prisma.user.findUnique({
    where: { email: input.ownerEmail },
  });

  if (existing) {
    throw new Error("Email owner already registered");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  const restaurant = await prisma.restaurant.create({
    data: {
      name: input.restaurantName,
      slug: input.restaurantSlug,
      users: {
        create: {
          fullName: input.ownerName,
          email: input.ownerEmail,
          passwordHash,
          role: UserRole.OWNER,
        },
      },
      tables: {
        createMany: {
          data: Array.from({ length: 12 }).map((_, index) => ({
            code: String(index + 1),
            qrToken: `${input.restaurantSlug}-table-${index + 1}`,
          })),
        },
      },
    },
    include: {
      users: true,
    },
  });

  const owner = restaurant.users[0];
  const token = signToken({
    sub: owner.id,
    role: owner.role,
    restaurantId: restaurant.id,
  });

  return { restaurant, owner, token };
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { restaurant: true },
  });

  if (!user || !user.isActive) {
    throw new Error("User not found");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new Error("Invalid credentials");
  }

  const token = signToken({
    sub: user.id,
    role: user.role,
    restaurantId: user.restaurantId,
  });

  return { token, user };
}

export async function createCustomerSession(
  tableCode: string,
  guestName?: string
) {
  const restaurant = await prisma.restaurant.findFirst({
    orderBy: { createdAt: "asc" },
    include: {
      tables: {
        where: { code: tableCode, isActive: true },
        take: 1,
      },
    },
  });

  if (!restaurant || restaurant.tables.length === 0) {
    throw new Error("Table not found");
  }

  const table = restaurant.tables[0];
  const session = await prisma.customerSession.create({
    data: {
      restaurantId: restaurant.id,
      tableId: table.id,
      guestName,
      sessionToken: `${restaurant.slug}-${table.code}-${Date.now()}`,
    },
  });

  const token = signToken({
    sub: session.id,
    role: "CUSTOMER",
    restaurantId: restaurant.id,
    tableId: table.id,
    sessionId: session.id,
  });

  return { token, session, restaurant, table };
}
