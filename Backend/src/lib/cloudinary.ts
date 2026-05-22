import { v2 as cloudinary } from "cloudinary";

import { env } from "../config/env";

cloudinary.config({
  cloud_name: env.cloudinaryCloudName,
  api_key: env.cloudinaryApiKey,
  api_secret: env.cloudinaryApiSecret,
});

export { cloudinary };

export function buildOptimizedImageUrl(publicId: string) {
  return cloudinary.url(publicId, {
    secure: true,
    fetch_format: "auto",
    quality: "auto",
    crop: "fill",
    gravity: "auto",
  });
}
