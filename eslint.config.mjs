import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import solid from "eslint-plugin-solid/configs/typescript";
import * as tsParser from "@typescript-eslint/parser";
import oxlint from 'eslint-plugin-oxlint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: [
      "dist/**",
      ".netlify/**",
      "coverage/**",
      "html/**",
      "playwright-report/**",
      "**/node_modules/",
      ".git/",
    ],
  },
  {
    files: ["src/**/*.{js,mjs,cjs,ts}"],
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  {
    files: ["src/**/*.{ts,tsx}"],
    ...solid,
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "tsconfig.json",
      },
    },
  },
  ...tseslint.configs.recommended,
  ...oxlint.configs['flat/recommended'],
];
