import { defineConfig } from "oxlint";

export default defineConfig({
  categories: {
    correctness: "warn",
  },
  rules: {
    "eslint/no-unused-vars": [
      "error",
      {
        vars: "all",
        args: "after-used",
        ignoreRestSiblings: true,
        caughtErrors: "all",
        argsIgnorePattern: "^_$",
        varsIgnorePattern: "^_$",
      },
    ],
  },
});
