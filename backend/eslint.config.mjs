import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([
    globalIgnores(['**/node_modules', '**/dist', '**/build']),
    // Base config for all files
    {
        extends: compat.extends('eslint:recommended', 'plugin:@typescript-eslint/recommended'),

        languageOptions: {
            globals: {
                ...globals.node,
            },

            parser: tsParser,
            ecmaVersion: 2021,
            sourceType: 'module',
        },

        rules: {
            'no-console': 'warn',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'error',
            '@typescript-eslint/no-explicit-any': 'warn',
            eqeqeq: 'error',
            'no-var': 'error',
            'prefer-const': 'error',
            semi: ['error', 'always'],
            quotes: ['error', 'single'],
        },
    },
    // Type-aware linting only for files in the TypeScript project
    {
        files: ['src/**/*.ts', 'generated/**/*.ts'],
        languageOptions: {
            parserOptions: {
                project: './tsconfig.json',
            },
        },
    },
]);