module.exports = {
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
    'jest/globals': true,
  },
  globals: {
    jQuery: true,
    $: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:jest/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', 'better-styled-components', 'jest'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        useTabs: false,
        tabWidth: 2,
        bracketSpacing: false,
        printWidth: 80,
        semi: true,
        parser: 'flow',
        singleQuote: true,
        arrowParens: 'avoid',
      },
    ],
    'linebreak-style': ['error', 'unix'],
    quotes: [2, 'single', {avoidEscape: true}],
    semi: ['error', 'always'],
  },
  overrides: [
    {
      files: [
        'static/**/*.js',
        '.eslintrc.js',
        '__tests__/**',
        '**/**.test.js',
        'src/utils/**.js',
      ],
      rules: {
        'i18next/no-literal-string': 'off',
      },
    },
  ],
};
