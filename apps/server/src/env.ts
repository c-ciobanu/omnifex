import { createEnv } from "@t3-oss/env-core";
import * as z from "zod";

import { authEnv } from "@omnifex/auth/env";
import { dbEnv } from "@omnifex/db/env";

export const env = createEnv({
  extends: [dbEnv(), authEnv()],
  server: {
    QUEUES_DASHBOARD_PASSWORD: z.string().min(1),
    REDIS_URL: z.string().min(1),
    TMDB_API_ACCESS_TOKEN: z.string().min(1),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
  skipValidation: !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
