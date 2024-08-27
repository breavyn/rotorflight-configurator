import globals from "globals";
import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";

export default [
  {
    ignores: ["gulpfile.mjs"],
  },
  pluginJs.configs.recommended,
  ...pluginVue.configs["flat/vue2-recommended"],
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      semi: "error",
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    rules: {
      "no-undef": "off",
    },
  },
  {
    files: [
      "src/js/workers/hex_parser.js",
      "src/js/tabs/map.js",
      "src/js/msp/MSPHelper.js",
      "src/js/CliAutoComplete.js",
    ],
    rules: {
      "no-case-declarations": "off",
    },
  },
  {
    ignores: [
      "*.mjs",
      "src/js/filesystem.js",
      "src/main.js",
      "src/js/tabs/index.js",
    ],
    rules: {
      "no-unused-vars": "off",
      "no-prototype-builtins": "off",
      "no-useless-escape": "off",
      "no-redeclare": "off",
      "no-dupe-keys": "off",
    },
  },
];
