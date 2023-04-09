module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parser: "@babel/eslint-parser",
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      presets: ["@babel/preset-react"],
    },
  },
  extends: ["react-app", "airbnb", "plugin:prettier/recommended"],
  plugins: ["prettier", "unused-imports"],
  settings: {
    "import/resolver": {
      node: {
        paths: ["src"],
      },
    },
  },
  rules: {
    // Prettier configs based on airbnb guide
    "prettier/prettier": [
      "warn",
      {
        arrowParens: "always",
        bracketSpacing: true,
        jsxBracketSameLine: false,
        jsxSingleQuote: false,
        printWidth: 80,
        proseWrap: "preserve",
        quoteProps: "as-needed",
        semi: true,
        singleQuote: false,
        tabWidth: 2,
        trailingComma: "es5",
        useTabs: false,
        endOfLine: "auto",
      },
      {
        usePrettierrc: false,
      },
    ],
    "react/jsx-filename-extension": [
      "warn",
      {
        extensions: [".js", ".jsx", ".tsx", ".ts"],
      },
    ],
    "import/no-extraneous-dependencies": [
      "warn",
      {
        devDependencies: true,
      },
    ],
    "no-unused-vars": "off",
    "no-console": "off",
    "no-use-before-define": "off",
    "no-underscore-dangle": "off",
    "no-param-reassign": "off", // mutating redux state in redux-toolkit.
    "import/no-unresolved": "off", // raw-loader
    "global-require": "off", // raw-loader
    "react/no-array-index-key": "off",
    "react/no-unescaped-entities": "off",
    "react/destructuring-assignment": "off",
    "react/jsx-props-no-spreading": "off",
    "react/state-in-constructor": "off",
    "react/no-danger": "off",
    "react/prop-types": "off",
    "react/forbid-prop-types": "off",
    "react/require-default-props": "off",
    "react/default-props-match-prop-types": "off",
    "react/no-unused-prop-types": "off",
    "react/react-in-jsx-scope": "off", // after react v17
    "react/jsx-uses-react": "off", // after react v17
    "react/jsx-no-bind": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "unused-imports/no-unused-imports": "warn",
    "default-param-last": "off",
    "react/function-component-definition": [
      "warn",
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      },
    ],
    "import/no-cycle": "off",
    "no-unsafe-optional-chaining": "off",
  },
};
