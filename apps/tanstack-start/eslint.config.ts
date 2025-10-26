import { defineConfig } from "eslint/config";

import { baseConfig, restrictEnvAccess } from "@omnifex/eslint-config/base";
import { reactConfig } from "@omnifex/eslint-config/react";

export default defineConfig(
  {
    ignores: [".nitro/**", ".output/**", ".tanstack/**"],
  },
  baseConfig,
  reactConfig,
  restrictEnvAccess,
);
