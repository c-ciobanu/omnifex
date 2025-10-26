import { defineConfig } from "eslint/config";

import { baseConfig } from "@omnifex/eslint-config/base";

export default defineConfig(
  {
    ignores: ["dist/**"],
  },
  baseConfig,
);
