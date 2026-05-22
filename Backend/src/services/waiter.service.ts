import { OrderStatus, ServiceCallStatus } from "@prisma/client";

import { prisma } from "../lib/prisma";

export async function getWaiterBoard(restaurantId: string) {
  const [orders, calls] = await Promise.all([
    prisma.order.findMany({
      where: {
        restaurantId,
        status: {
          in: [
            OrderStatus.PENDING,
            OrderStatus.CONFIRMED,
            OrderStatus.PREPARING,
            OrderStatus.SERVING,
          ],
        },
      },
      include: {
        items: true,
        table: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.serviceCall.findMany({
      where: {
        restaurantId,
        status: {
          in: [ServiceCallStatus.OPEN, ServiceCallStatus.ACKNOWLEDGED],
        },
      },
      include: {
        table: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return { orders, calls };
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  return prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
}

export async function updateCallStatus(
  callId: string,
  status: ServiceCallStatus
) {
  return prisma.serviceCall.update({
    where: { id: callId },
    data: { status },
  });
}
