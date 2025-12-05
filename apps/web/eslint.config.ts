import tanstackRouterPlugin from "@tanstack/eslint-plugin-router";
import { defineConfig } from "eslint/config";

import { baseConfig, restrictEnvAccess } from "@omnifex/eslint-config/base";
import { reactConfig } from "@omnifex/eslint-config/react";

export default defineConfig(
  ...tanstackRouterPlugin.configs["flat/recommended"],
  baseConfig,
  reactConfig,
  restrictEnvAccess,
  {
    rules: {
      "@typescript-eslint/only-throw-error": [
        "error",
        { allow: [{ from: "package", package: "@tanstack/router-core", name: "Redirect" }] },
      ],
    },
  },
);
