import { defineConfig } from "eslint/config";

import { baseConfig, restrictEnvAccess } from "@omnifex/eslint-config/base";

export default defineConfig(
  {
    ignores: ["src/generated"],
  },
  baseConfig,
  restrictEnvAccess,
);
