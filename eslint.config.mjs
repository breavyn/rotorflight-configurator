import globals from "globals";
import pluginJs from "@eslint/js";
import pluginSvelte from "eslint-plugin-svelte";
import { globalIgnores } from "eslint/config";

/** @type {import('eslint').Linter.Config[]} */
export default [
  globalIgnores(["./public/"]),
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node, ...globals.jquery },
    },
  },
  pluginJs.configs.recommended,
  ...pluginSvelte.configs["flat/recommended"],
  {
    rules: {
      semi: "error",
      "no-prototype-builtins": "off",
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      // TODO: The codebase makes extensive use of globals. This rule should be
      // enabled and remaining globals explicitly defined.
      "no-undef": "off",
    },
  },
];
