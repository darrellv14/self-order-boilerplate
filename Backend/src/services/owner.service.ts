import bcrypt from "bcryptjs";
import { Prisma, UserRole } from "@prisma/client";

import { buildOptimizedImageUrl, cloudinary } from "../lib/cloudinary";
import { prisma } from "../lib/prisma";

export async function getOwnerDashboard(restaurantId: string) {
  const [restaurant, menuCount, promoCount, waiterCount, ordersToday] =
    await Promise.all([
      prisma.restaurant.findUnique({
        where: { id: restaurantId },
        include: {
          promos: { orderBy: { startsAt: "desc" } },
          tables: true,
          categories: true,
          menuItems: true,
          users: {
            where: { role: UserRole.WAITER },
          },
        },
      }),
      prisma.menuItem.count({ where: { restaurantId } }),
      prisma.promo.count({ where: { restaurantId, isActive: true } }),
      prisma.user.count({
        where: { restaurantId, role: UserRole.WAITER, isActive: true },
      }),
      prisma.order.count({
        where: {
          restaurantId,
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      }),
    ]);

  return {
    restaurant,
    metrics: {
      menuCount,
      promoCount,
      waiterCount,
      ordersToday,
    },
  };
}

export async function updateRestaurantSettings(
  restaurantId: string,
  data: Prisma.RestaurantUpdateInput
) {
  return prisma.restaurant.update({
    where: { id: restaurantId },
    data,
  });
}

export async function uploadRestaurantAsset(
  restaurantId: string,
  file: Express.Multer.File,
  folder: string
) {
  const uploaded = await new Promise<{ public_id: string }>(
    (resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `self-order/${restaurantId}/${folder}`,
          resource_type: "image",
          transformation: [
            { width: 1600, height: 1600, crop: "limit" },
            { fetch_format: "auto", quality: "auto" },
          ],
        },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error("Upload failed"));
            return;
          }

          resolve({ public_id: result.public_id });
        }
      );

      stream.end(file.buffer);
    }
  );

  return {
    publicId: uploaded.public_id,
    optimizedUrl: buildOptimizedImageUrl(uploaded.public_id),
  };
}

export async function createWaiter(
  restaurantId: string,
  fullName: string,
  email: string,
  password: string
) {
  const passwordHash = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      restaurantId,
      fullName,
      email,
      passwordHash,
      role: UserRole.WAITER,
    },
  });
}

export async function upsertCategory(
  restaurantId: string,
  id: string | undefined,
  name: string,
  position: number
) {
  if (id) {
    return prisma.category.update({
      where: { id },
      data: { name, position },
    });
  }

  return prisma.category.create({
    data: {
      restaurantId,
      name,
      position,
    },
  });
}

export async function upsertMenuItem(
  restaurantId: string,
  payload: {
    id?: string;
    categoryId?: string;
    slug: string;
    name: string;
    description?: string;
    imageUrl?: string;
    basePrice: number;
    isAvailable?: boolean;
  }
) {
  const data = {
    categoryId: payload.categoryId,
    slug: payload.slug,
    name: payload.name,
    description: payload.description,
    imageUrl: payload.imageUrl,
    basePrice: payload.basePrice,
    isAvailable: payload.isAvailable,
  };

  if (payload.id) {
    return prisma.menuItem.update({
      where: { id: payload.id },
      data,
    });
  }

  return prisma.menuItem.create({
    data: {
      restaurantId,
      ...data,
    },
  });
}

export async function upsertPromo(
  restaurantId: string,
  payload: {
    id?: string;
    title: string;
    description?: string;
    imageUrl?: string;
    startsAt: string;
    endsAt: string;
    isActive?: boolean;
  }
) {
  const data = {
    title: payload.title,
    description: payload.description,
    imageUrl: payload.imageUrl,
    startsAt: new Date(payload.startsAt),
    endsAt: new Date(payload.endsAt),
    isActive: payload.isActive ?? true,
  };

  if (payload.id) {
    return prisma.promo.update({
      where: { id: payload.id },
      data,
    });
  }

  return prisma.promo.create({
    data: {
      restaurantId,
      ...data,
    },
  });
}
