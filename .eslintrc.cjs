module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      parser: '@typescript-eslint/parser',
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:import/typescript',
      ],
    },
  ],
  plugins: ['simple-import-sort', 'prettier', '@typescript-eslint'],
  parserOptions: {
    tsconfigRootDir: '.',
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {},
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
    react: {
      version: 'detect',
    },
  },
  rules: {
    'linebreak-style': ['error', process.platform === 'win32' ? 'windows' : 'unix'],
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    "react/no-unknown-property": ["error", { "ignore": ["css"] }],
    "@typescript-eslint/no-unused-vars": [
      "error", // or "error"
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }
    ],
    'arrow-parens': 0,
    'no-debugger': 1,
    'no-warning-comments': [
      1,
      {
        terms: ['hardcoded'],
        location: 'anywhere',
      },
    ],
    'no-return-await': 0,
    'object-curly-spacing': ['error', 'always'],
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'no-var': 'error',
    'comma-dangle': [1, 'always-multiline'],
    'no-console': [
      1,
      {
        allow: ['warn', 'error'],
      },
    ],
    'react/display-name': 'off',
    'import/namespace': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'react/prop-types': ['error'],
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'next/image',
            importNames: ['Image'],
            message:
              'Please do not import from next/image. Use Image from library instead.',
          },
          {
            name: '@mantine/core',
            importNames: ['Image'],
            message:
              'Please do not use Image from @mantine/core. Use Image from library instead.',
          },
          {
            name: '@mantine/core',
            importNames: ['Text', 'Checkbox', 'Link'],
            message:
              'Please do not use those components from @mantine/core. Use components from library instead.',
          },
          {
            name: 'next/link',
            importNames: ['default'],
            message:
              'Please do not use Text from @mantine/core. Use Text from library instead.',
          },
        ],
      },
    ],
    'react/forbid-elements': [1, { 'forbid': [{ 'element': 'video', message: 'use <Video> component from `@/design/library` instead' }] }]
  },
}


