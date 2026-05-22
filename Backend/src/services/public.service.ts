import { prisma } from "../lib/prisma";

export async function getPublicRestaurant() {
  return prisma.restaurant.findFirst({
    orderBy: { createdAt: "asc" },
    include: {
      promos: {
        where: {
          isActive: true,
          startsAt: { lte: new Date() },
          endsAt: { gte: new Date() },
        },
        orderBy: { startsAt: "desc" },
      },
      categories: { orderBy: { position: "asc" } },
      menuItems: {
        where: { isAvailable: true },
        include: { modifiers: true, category: true },
      },
      tables: { where: { isActive: true } },
    },
  });
}

export async function getOrderStatus(orderId: string) {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      table: true,
    },
  });
}
