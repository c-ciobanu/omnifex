import path from "node:path";
import type { PrismaConfig } from "prisma";

export default {
  schema: path.join("src", "schema"),
  migrations: {
    path: path.join("src", "migrations"),
  },
} satisfies PrismaConfig;
