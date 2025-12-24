import { createEnv } from "@t3-oss/env-core";
import * as z from "zod";

import { authEnv } from "@omnifex/auth/env";
import { dbEnv } from "@omnifex/db/env";

export const env = createEnv({
  extends: [dbEnv(), authEnv()],
  server: {
    GOOGLE_BOOKS_API_KEY: z.string().min(1),
    QUEUES_DASHBOARD_PASSWORD: z.string().min(1),
    REDIS_URL: z.string().min(1),
    S3_ACCESS_KEY_ID: z.string().min(1),
    S3_BUCKET: z.string().min(1),
    S3_ENDPOINT: z.string().min(1),
    S3_MAX_BYTES_UPLOAD_SIZE: z.coerce.number(),
    S3_REGION: z.string().min(1),
    S3_SECRET_ACCESS_KEY: z.string().min(1),
    TMDB_API_ACCESS_TOKEN: z.string().min(1),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
  skipValidation: !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
