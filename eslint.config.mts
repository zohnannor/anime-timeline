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
    globalIgnores(['build', 'eslint.config.mts', 'vite.config.ts']),

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
        linterOptions: {
            reportUnusedDisableDirectives: true,
        },
        settings: {
            'import/internal-regex': '^@',
            react: {
                version: 'detect',
            },
        },
        rules: {
            'no-undef': 'off', // enfored by typescript
            'sort-imports': 'off', // import/internal-regex does this better
            'one-var': ['error', 'never'], // invert it: disallow one-var style
            'max-lines-per-function': [
                'error',
                { max: 150, skipBlankLines: true, skipComments: true },
            ],
            'max-statements': ['error', 30, { ignoreTopLevelFunctions: true }],
            complexity: ['error', 35],
            'max-lines': ['error', 1000],
            'max-params': ['error', 5], // gets in a way with callbacks
            'capitalized-comments': 'off', // not important, style preference
            'no-inline-comments': 'off', // useful
            // unfortunately, it can't enforce sorting the keys like in the
            // type's definition, and alphabetical sorting is useless
            'sort-keys': 'off',
            'no-ternary': 'off', // we love ternaries
            'no-shadow': 'off', // shadowing is useful
            'no-undefined': 'off', // no-shadow-restricted-names covers reassign
            'no-negated-condition': 'off', // reads better im many cases
            'no-nested-ternary': 'off', // we LOVE ternaries
            // allow only in for loops
            'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
            // `Boolean(x)` looks ugly
            'no-implicit-coercion': ['error', { allow: ['!!'] }],
            // a lot of these are scale() numbers that are values tied to
            // timeline maxHeight, so cannot be easily refactored. and anyway,
            // this lint is too strict, flagging things like `0` and `1` in
            // simple, obvious scenarios
            'no-magic-numbers': 'off',
            // common abbreviations
            'id-length': [
                'error',
                {
                    exceptions: [
                        'x',
                        'y',
                        'z',
                        'i',
                        'j',
                        'n',
                        'r',
                        'g',
                        'b',
                        '_',
                    ],
                },
            ],
            // `console.log` should be used only in development
            'no-console': ['error', { allow: ['warn', 'error', 'debug'] }],
            // to leave `TODO` comments in the code
            'no-warning-comments': 'off',
            'no-continue': 'off', // if-guards are useful

            'react/prop-types': 'off', // enfored by typescript and `React.FC`

            // prepending `_` to unused variables is a common pattern
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

            // allow returning `void` in arrow functions: `=> foo.bar()`
            '@typescript-eslint/no-confusing-void-expression': [
                'error',
                {
                    ignoreArrowShorthand: true,
                },
            ],
            // booleans and numbers are ok to not require `.toString()`
            '@typescript-eslint/restrict-template-expressions': [
                'error',
                {
                    allowAny: false,
                    allowBoolean: true,
                    allowNever: false,
                    allowNullish: false,
                    allowNumber: true,
                    allowRegExp: false,
                },
            ],
            // prefer `type` over `interface`
            '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
            // `?` is there for that exact reason
            '@typescript-eslint/no-unsafe-member-access': [
                'error',
                { allowOptionalChaining: true },
            ],
        },
    },
]);
