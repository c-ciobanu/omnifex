import { defineConfig } from "eslint/config";

import { baseConfig, restrictEnvAccess } from "@omnifex/eslint-config/base";
import { nextjsConfig } from "@omnifex/eslint-config/nextjs";
import { reactConfig } from "@omnifex/eslint-config/react";

export default defineConfig(
  {
    ignores: [".next/**"],
  },
  baseConfig,
  reactConfig,
  nextjsConfig,
  restrictEnvAccess,
);
