import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import globals from "globals";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import prettierConfig from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/.turbo/**",
      "**/coverage/**",
      "**/generated/**",
      "**/package-lock.json",
      "**/next-env.d.ts",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["Backend/**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-console": "off",
    },
  },
  {
    files: ["*.js", "frontend/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ["frontend/**/*.{ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooks,
      "@next/next": nextPlugin,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "react/react-in-jsx-scope": "off",
    },
  },
  prettierConfig,
];
