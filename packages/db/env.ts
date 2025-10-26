import { createEnv } from "@t3-oss/env-core";
import { z } from "zod/v4";

export function dbEnv() {
  return createEnv({
    server: {
      BETTER_AUTH_SECRET: z.string().min(1),
      BETTER_AUTH_URL: z.url(),
      DATABASE_URL: z.url(),
    },
    runtimeEnv: process.env,
    skipValidation: !!process.env.CI || process.env.npm_lifecycle_event === "lint",
  });
}
