import { createEnv } from "@t3-oss/env-core";
import * as z from "zod";

import { authEnv } from "@omnifex/auth/env";
import { dbEnv } from "@omnifex/db/env";

export const env = createEnv({
  extends: [dbEnv(), authEnv()],
  server: {},
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
  skipValidation: !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
