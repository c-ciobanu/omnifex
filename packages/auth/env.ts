import { createEnv } from "@t3-oss/env-core";
import { z } from "zod/v4";

import { dbEnv } from "@omnifex/db/env";

export function authEnv() {
  return createEnv({
    extends: [dbEnv()],
    server: {
      BETTER_AUTH_SECRET: z.string().min(1),
      BETTER_AUTH_URL: z.url(),
      CORS_ORIGIN: z.url(),
    },
    runtimeEnv: process.env,
    skipValidation: !!process.env.CI || process.env.npm_lifecycle_event === "lint",
  });
}
