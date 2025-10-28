import { createEnv } from "@t3-oss/env-core";
import * as z from "zod";

import { authEnv } from "@omnifex/auth/env";
import { dbEnv } from "@omnifex/db/env";

export const env = createEnv({
  extends: [dbEnv(), authEnv()],
  server: {
    TMDB_API_ACCESS_TOKEN: z.string().min(1),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
  skipValidation: !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
