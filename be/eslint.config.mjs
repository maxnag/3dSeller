import _import from 'eslint-plugin-import';
import globals from 'globals';
import jest from 'eslint-plugin-jest';
import js from '@eslint/js';
import jsdoc from 'eslint-plugin-jsdoc';
import path from 'node:path';
import preferArrow from 'eslint-plugin-prefer-arrow';
import prettier from 'eslint-plugin-prettier';
import tsParser from '@typescript-eslint/parser';
import typescriptEslintEslintPlugin from '@typescript-eslint/eslint-plugin';
import { FlatCompat } from '@eslint/eslintrc';
import { fileURLToPath } from 'node:url';
import { fixupPluginRules } from '@eslint/compat';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ['**/.eslintrc.js', '**/i18n.generated.ts'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },
  {
    files: ['**/*.ts'],
    plugins: {
      '@typescript-eslint': typescriptEslintEslintPlugin,
      import: fixupPluginRules(_import),
      jest,
      jsdoc,
      'prefer-arrow': preferArrow,
      prettier,
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 6,
      sourceType: 'module',
      parserOptions: {
        project: ['tsconfig.json']
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-definitions': 'error',
      '@typescript-eslint/dot-notation': 'off',
      '@typescript-eslint/explicit-member-accessibility': ['off', {
        accessibility: 'explícit',
      }],
      '@typescript-eslint/comma-dangle': ['error', 'never'],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/unbound-method': ['error', {
        ignoreStatic: true,
      }],
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/lines-between-class-members': 'off',
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'arrow-parens': ['off', 'always'],
      'brace-style': ['error', '1tbs'],
      'id-blacklist': 'off',
      'id-match': 'off',
      'import/order': 'off',
      'no-underscore-dangle': 'off',
      'object-shorthand': 'off',
      'import/no-unresolved': 'off',
      'import/prefer-default-export': 'off',
      'class-methods-use-this': 'off',
      'lines-between-class-members': 'off',
      'import/no-extraneous-dependencies': ['error', {
        devDependencies: true,
        optionalDependencies: false,
        peerDependencies: false,
      }],
      'max-len': ['error', {
        code: 140,
      }],
      'object-curly-newline': 'off',
      'object-curly-spacing': ['error', 'always'],
      'padded-blocks': ['error', {
        blocks: 'never',
        switches: 'never',
        classes: 'never',
      }],
      'padding-line-between-statements': ['error', {
        blankLine: 'always',
        prev: '*',

        next: [
          'return',
          'if',
          'iife',
          'switch',
          'try',
          'do',
          'while',
          'for',
          'class',
          'function',
        ],
      }, {
        blankLine: 'always',
        prev: ['const', 'let', 'var'],
        next: '*',
      }, {
        blankLine: 'any',
        prev: ['const', 'let', 'var'],
        next: ['const', 'let', 'var'],
      }],
      'import/no-cycle': ['warn', {
        maxDepth: '∞',
        ignoreExternal: true,
      }],
      'prettier/prettier': 'error',
    },
  },
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ).map(config => ({
    ...config,
    files: ['**/*.ts'],
  })),
];
