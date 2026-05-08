import js from "@eslint/js";
import react from "eslint-plugin-react";
import hooks from "eslint-plugin-react-hooks";
import refresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default [
  { ignores: ["dist"] },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      react,
      "react-hooks": hooks,
      "react-refresh": refresh,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...hooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off", // Vite + React
      "react-refresh/only-export-components": "warn",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },

  prettier,
];
