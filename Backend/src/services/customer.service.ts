import { OrderStatus, Prisma } from "@prisma/client";

import { prisma } from "../lib/prisma";

type CreateOrderItemInput = {
  menuItemId: string;
  quantity: number;
  notes?: string;
  modifiers?: unknown;
};

export async function createOrder(input: {
  restaurantId: string;
  tableId: string;
  customerSessionId: string;
  customerName?: string;
  specialNotes?: string;
  items: CreateOrderItemInput[];
}) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: input.restaurantId },
  });

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  const menuItems = await prisma.menuItem.findMany({
    where: {
      restaurantId: input.restaurantId,
      id: { in: input.items.map((item) => item.menuItemId) },
    },
  });

  const subtotal = input.items.reduce((acc, item) => {
    const found = menuItems.find((menu) => menu.id === item.menuItemId);
    return acc + (found?.basePrice ?? 0) * item.quantity;
  }, 0);

  const taxAmount = Math.round(subtotal * (restaurant.taxPercent / 100));
  const serviceAmount = Math.round(
    subtotal * (restaurant.servicePercent / 100)
  );
  const totalAmount = subtotal + taxAmount + serviceAmount;

  return prisma.order.create({
    data: {
      restaurantId: input.restaurantId,
      tableId: input.tableId,
      customerSessionId: input.customerSessionId,
      customerName: input.customerName,
      specialNotes: input.specialNotes,
      subtotalAmount: subtotal,
      taxAmount,
      serviceAmount,
      totalAmount,
      items: {
        create: input.items.map((item) => {
          const found = menuItems.find((menu) => menu.id === item.menuItemId);

          if (!found) {
            throw new Error("Menu item not found");
          }

          return {
            name: found.name,
            price: found.basePrice,
            quantity: item.quantity,
            notes: item.notes,
            modifiers: item.modifiers ?? Prisma.JsonNull,
            menuItem: {
              connect: {
                id: found.id,
              },
            },
          };
        }),
      },
    },
    include: { items: true },
  });
}

export async function markOrderPaid(orderId: string) {
  return prisma.order.update({
    where: { id: orderId },
    data: {
      paymentStatus: "PAID",
      status: OrderStatus.CONFIRMED,
    },
  });
}

export async function callWaiter(input: {
  restaurantId: string;
  tableId: string;
  customerSessionId: string;
  message?: string;
}) {
  return prisma.serviceCall.create({
    data: input,
  });
}
