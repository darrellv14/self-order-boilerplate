import bcrypt from "bcryptjs";

import { prisma } from "../lib/prisma";

async function main() {
  const restaurant = await prisma.restaurant.upsert({
    where: { slug: "golden-dragon" },
    update: {},
    create: {
      name: "Golden Dragon",
      slug: "golden-dragon",
      description: "Premium Chinese restaurant boilerplate",
      tables: {
        createMany: {
          data: Array.from({ length: 12 }).map((_, index) => ({
            code: String(index + 1),
            qrToken: `golden-dragon-table-${index + 1}`,
          })),
        },
      },
      categories: {
        create: [
          { name: "Dimsum", position: 1 },
          { name: "Mains", position: 2 },
          { name: "Drinks", position: 3 },
        ],
      },
      promos: {
        create: {
          title: "Chef's Dimsum Set",
          description: "Diskon 20% untuk dimsum pilihan.",
          startsAt: new Date(Date.now() - 86400000),
          endsAt: new Date(Date.now() + 86400000 * 30),
        },
      },
    },
  });

  const ownerPasswordHash = await bcrypt.hash("owner123", 10);
  const waiterPasswordHash = await bcrypt.hash("waiter123", 10);

  await prisma.user.upsert({
    where: { email: "owner@goldendragon.local" },
    update: {},
    create: {
      restaurantId: restaurant.id,
      fullName: "Golden Dragon Owner",
      email: "owner@goldendragon.local",
      passwordHash: ownerPasswordHash,
      role: "OWNER",
    },
  });

  await prisma.user.upsert({
    where: { email: "waiter@goldendragon.local" },
    update: {},
    create: {
      restaurantId: restaurant.id,
      fullName: "Golden Dragon Waiter",
      email: "waiter@goldendragon.local",
      passwordHash: waiterPasswordHash,
      role: "WAITER",
    },
  });

  const categories = await prisma.category.findMany({
    where: { restaurantId: restaurant.id },
  });
  const dimsum = categories.find((item) => item.name === "Dimsum");
  const mains = categories.find((item) => item.name === "Mains");
  const drinks = categories.find((item) => item.name === "Drinks");

  const menu = [
    {
      slug: "hakau-shrimp",
      name: "Hakau Shrimp",
      description: "Crystal dumpling isi udang premium.",
      basePrice: 48000,
      categoryId: dimsum?.id,
    },
    {
      slug: "mapo-tofu",
      name: "Sichuan Mapo Tofu",
      description: "Silken tofu dengan lada Sichuan.",
      basePrice: 72000,
      categoryId: mains?.id,
    },
    {
      slug: "jasmine-tea",
      name: "Jasmine Tea Pot",
      description: "Teh hangat untuk 2-3 orang.",
      basePrice: 28000,
      categoryId: drinks?.id,
    },
  ];

  for (const item of menu) {
    await prisma.menuItem.upsert({
      where: {
        restaurantId_slug: {
          restaurantId: restaurant.id,
          slug: item.slug,
        },
      },
      update: item,
      create: { restaurantId: restaurant.id, ...item },
    });
  }

  console.log("Seed completed");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
