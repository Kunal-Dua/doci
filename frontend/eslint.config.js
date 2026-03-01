import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
    globalIgnores(["dist"]),
    {
        env: {
            browser: true,
            es2021: true,
        },
        files: ["**/*.{ts,tsx}"],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite,
            "eslint:recommended",
            "plugin:react/recommended",
            "plugin:react-hooks/recommended",
            "plugin:jsx-a11y/recommended",
            "plugin:import/errors",
            "plugin:import/warnings",
            "prettier",
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
            ecmaVersion: 12,
            sourceType: "module",
        },
        plugins: ["react", "react-hooks", "jsx-a11y", "import"],
        rules: {
            "react/prop-types": "off", // Disable prop-types rule if you're using TypeScript
        },
        settings: {
            react: {
                version: "detect",
            },
        },
    },
]);
