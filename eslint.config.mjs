import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  eslintPluginPrettierRecommended,
  {
    plugins: {
      "@stylistic": stylistic,
    },
    rules: {
      quotes: ["error", "double"],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "no-console": "error",
      "@typescript-eslint/explicit-function-return-type": "error",
      "padding-line-between-statements": [
        "error",
        {
          blankLine: "always",
          prev: "block-like",
          next: "*",
        },
      ],
    },
    files: ["**/*.{ts,tsx}"],
  },
);
