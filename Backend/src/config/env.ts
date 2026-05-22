import "dotenv/config";

export const env = {
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: process.env.DATABASE_URL ?? "",
  directUrl: process.env.DIRECT_URL ?? "",
  jwtSecret: process.env.JWT_SECRET ?? "dev-secret",
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY ?? "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
};
