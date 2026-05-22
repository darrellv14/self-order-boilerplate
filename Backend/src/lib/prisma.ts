import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

import { env } from "../config/env";

const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
  adapter,
});
