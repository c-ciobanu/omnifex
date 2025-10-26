import { defineConfig } from "eslint/config";

import { baseConfig } from "@omnifex/eslint-config/base";
import { reactConfig } from "@omnifex/eslint-config/react";

export default defineConfig(
  {
    ignores: ["dist/**"],
  },
  baseConfig,
  reactConfig,
);
