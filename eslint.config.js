// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([globalIgnores(["dist"]), {
  files: ["**/*.{ts,tsx}"],
  extends: [
    js.configs.recommended,
    tseslint.configs.recommended,
    reactHooks.configs.flat.recommended,
    reactRefresh.configs.vite,
  ],
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser,
  },
  rules: {
    // React hooks rules
    ...reactHooks.configs.recommended.rules,

    // Vite react-refresh
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],

    // TS rules
    "@typescript-eslint/no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_" },
    ],
    "@typescript-eslint/no-require-imports": "off",
    "@typescript-eslint/no-explicit-any": "warn",

    semi: ["error", "always"],
    quotes: [
      "error",
      "double",
      { avoidEscape: true, allowTemplateLiterals: true },
    ],
    "jsx-quotes": ["error", "prefer-double"],
  },
}, ...storybook.configs["flat/recommended"]]);
