import storybook from 'eslint-plugin-storybook';
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores([
    '**/node_modules',
    '**/dist',
    '**/build',
    'playwright-report',
    '**/prism.js',
  ]),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    name: 'react',
    ...react.configs.flat.recommended,
    settings: {
      react: { version: 'detect' },
    },
  },
  {
    name: 'react-hooks',
    plugins: { 'react-hooks': reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },
  {
    name: 'app-rules',
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'react-refresh': reactRefresh,
      '@typescript-eslint': tseslint.plugin,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      'no-use-before-define': 'off',
      '@typescript-eslint/no-redeclare': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          caughtErrors: 'none',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/prefer-as-const': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
          enforceForJSX: false,
        },
      ],
      '@typescript-eslint/no-wrapper-object-types': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-key': 'off',
      eqeqeq: ['warn', 'smart'],
      'prefer-const': 'warn',
      'no-case-declarations': 'off',
      'react-refresh/only-export-components': 'off',
      'react/no-unescaped-entities': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },
  ...storybook.configs['flat/recommended'],
]);
