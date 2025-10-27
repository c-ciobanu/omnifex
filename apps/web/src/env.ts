import { createEnv } from "@t3-oss/env-core";
import * as z from "zod";

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_SERVER_URL: z.url(),
  },
  runtimeEnv: import.meta.env,
  skipValidation: !!import.meta.env.CI || import.meta.env.npm_lifecycle_event === "lint",
});
