import importPlugin from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import reactDom from 'eslint-plugin-react-dom';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import reactX from 'eslint-plugin-react-x';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import js from '@eslint/js';

export default defineConfig([
    globalIgnores(['build', 'eslint.config.mts']),

    js.configs.all,
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    react.configs.flat.recommended,
    react.configs.flat['jsx-runtime'],
    reactDom.configs.strict,
    reactHooks.configs.flat['recommended-latest'],
    reactRefresh.configs.vite,
    reactX.configs['strict-type-checked'],

    {
        files: ['**/*.{ts,tsx}'],
        plugins: {
            import: importPlugin,
        },
        languageOptions: {
            globals: globals.browser,
            parserOptions: {
                project: true,
            },
        },
        settings: {
            'import/internal-regex': '^@',
            react: {
                version: 'detect',
            },
        },
        rules: {
            'no-undef': 'off', // enfored by typescript
            'sort-imports': 'off', // import/internal-regex does this
            'one-var': ['error', 'never'],
            'max-lines-per-function': [
                'error',
                { max: 100, skipBlankLines: true, skipComments: true },
            ],
            'max-statements': ['error', 15, { ignoreTopLevelFunctions: true }],
            'max-lines': ['error', 1000],
            'capitalized-comments': 'off',
            'no-inline-comments': 'off',
            'sort-keys': ['error', 'asc', { natural: true }],
            'no-ternary': 'off',
            'no-shadow': 'off',
            'no-undefined': 'off',
            'no-nested-ternary': 'off',
            'no-plusplus': 'off',
            'no-magic-numbers': 'off', // TODO: we have a bunch of `scale(N)` calls
            'id-length': [
                'error',
                { exceptions: ['x', 'y', 'z', 'i', 'j', 'n', '_', '__'] },
            ],
            'no-console': ['error', { allow: ['warn', 'error', 'debug'] }],

            'react/prop-types': 'off', // enfored by typescript and `React.FC`

            'no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],

            '@typescript-eslint/no-confusing-void-expression': [
                'error',
                {
                    ignoreArrowShorthand: true,
                },
            ],
            '@typescript-eslint/restrict-template-expressions': [
                'error',
                {
                    allowAny: false,
                    allowBoolean: true,
                    allowNever: false,
                    allowNullish: true,
                    allowNumber: true,
                    allowRegExp: false,
                },
            ],
            '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
            '@typescript-eslint/no-unsafe-member-access': [
                'error',
                { allowOptionalChaining: true },
            ],
        },
    },
]);
