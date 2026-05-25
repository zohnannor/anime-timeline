import importPlugin from 'eslint-plugin-import';
import perfectionist from 'eslint-plugin-perfectionist';
import react from 'eslint-plugin-react';
import reactDom from 'eslint-plugin-react-dom';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import reactX from 'eslint-plugin-react-x';
import unicorn from 'eslint-plugin-unicorn';
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
    unicorn.configs['all'],
    perfectionist.configs['recommended-natural'],

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
            'sort-imports': 'off', // perfectionist handles this
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
                { ignoreArrowShorthand: true },
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

            'unicorn/filename-case': [
                'error',
                {
                    cases: { kebabCase: true, pascalCase: true },
                    ignore: ['.ts', '.tsx'],
                },
            ],
            'unicorn/prevent-abbreviations': [
                'error',
                {
                    allowList: {
                        acc: true,
                        Acc: true,
                        args: true,
                        arr: true,
                        Arr: true,
                        el: true,
                        err: true,
                        Err: true,
                        ev: true,
                        fn: true,
                        idx: true,
                        Idx: true,
                        props: true,
                        Props: true,
                        ref: true,
                        Ref: true,
                        util: true,
                    },
                },
            ],
            'unicorn/catch-error-name': ['error', { name: 'err' }],
            'unicorn/no-array-callback-reference': 'off', // reads better
            // `getElementById` is faster and doesn't require you to contsuct a
            // selector string
            'unicorn/prefer-query-selector': 'off',
            'unicorn/no-nested-ternary': 'off', // we LOOVEE ternaries
            'unicorn/no-negated-condition': 'off', // same reason as eslint's
            // prettier disagrees
            'unicorn/number-literal-case': [
                'error',
                { hexadecimalValue: 'lowercase' },
            ],
            'unicorn/no-keyword-prefix': 'off', // quite useless

            'perfectionist/sort-objects': ['off', { type: 'unsorted' }],
            'perfectionist/sort-imports': ['off', { type: 'unsorted' }],
            'perfectionist/sort-named-imports': ['off', { type: 'unsorted' }],
            'perfectionist/sort-array-includes': ['off', { type: 'unsorted' }],
            'perfectionist/sort-intersection-types': [
                'off',
                { type: 'unsorted' },
            ],
            'perfectionist/sort-jsx-props': ['off', { type: 'unsorted' }],
            'perfectionist/sort-modules': ['off', { type: 'unsorted' }],
            'perfectionist/sort-object-types': ['off', { type: 'unsorted' }],
            'perfectionist/sort-union-types': ['off', { type: 'unsorted' }],
            'perfectionist/sort-sets': ['off', { type: 'unsorted' }],

            // enabling additional rules (feel free to configure or remove)

            'import/named': 'error',
            'import/default': 'error',
            'import/namespace': 'error',
            'import/no-namespace': 'error',
            'import/export': 'error',
            'import/no-mutable-exports': 'error',
            'import/extensions': 'error',
            'import/no-restricted-paths': 'error',
            'import/no-relative-packages': 'error',
            'import/consistent-type-specifier-style': 'off',
            'import/no-self-import': 'error',
            'import/no-cycle': 'error',
            'import/no-named-default': 'error',
            'import/no-named-as-default-member': 'error',
            'import/no-anonymous-default-export': 'error',
            'import/no-unused-modules': 'error',
            'import/no-commonjs': 'error',
            'import/no-amd': 'error',
            'import/no-duplicates': 'error',
            'import/first': 'error',
            'import/max-dependencies': ['error', { max: 20 }],
            'import/no-extraneous-dependencies': 'error',
            'import/no-absolute-path': 'error',
            'import/no-nodejs-modules': 'error',
            'import/no-webpack-loader-syntax': 'error',
            'import/order': [
                'error',
                {
                    groups: [
                        ['builtin', 'external', 'internal'],
                        ['parent', 'sibling', 'index'],
                    ],
                    'newlines-between': 'ignore',
                    alphabetize: { order: 'ignore' },
                },
            ],
            'import/newline-after-import': 'off',
            'import/no-dynamic-require': 'error',
            'import/unambiguous': 'error',
            'import/no-unassigned-import': ['error', { allow: ['**/*.css'] }],
            'import/no-useless-path-segments': 'error',
            'import/no-import-module-exports': 'error',
            'import/no-empty-named-blocks': 'error',
            'import/no-deprecated': 'error',

            'react/boolean-prop-naming': 'error',
            'react/button-has-type': 'error',
            'react/checked-requires-onchange-or-readonly': 'error',
            'react/default-props-match-prop-types': 'error',
            'react/destructuring-assignment': 'error',
            'react/forbid-dom-props': 'error',
            'react/forbid-elements': 'error',
            'react/forbid-foreign-prop-types': 'error',
            'react/forbid-prop-types': 'error',
            'react/forward-ref-uses-ref': 'error',
            'react/function-component-definition': [
                'error',
                {
                    namedComponents: 'arrow-function',
                    unnamedComponents: 'arrow-function',
                },
            ],
            'react/hook-use-state': 'error',
            'react/iframe-missing-sandbox': 'error',
            'react/jsx-handler-names': 'error',
            'react/jsx-max-depth': ['error', { max: 5 }],
            'react/jsx-no-bind': [
                'error',
                { ignoreDOMComponents: true, allowArrowFunctions: true },
            ],
            'react/jsx-no-constructed-context-values': 'error',
            'react/jsx-no-script-url': 'error',
            'react/jsx-pascal-case': 'error',
            'react/jsx-props-no-spread-multi': 'error',
            'react/jsx-props-no-spreading': [
                'error',
                { custom: 'ignore', html: 'enforce' },
            ],
            'react/no-adjacent-inline-elements': 'error',
            'react/no-arrow-function-lifecycle': 'error',
            'react/no-danger': 'error',
            'react/no-did-mount-set-state': 'error',
            'react/no-did-update-set-state': 'error',
            'react/no-invalid-html-attribute': 'error',
            'react/no-multi-comp': ['error', { ignoreStateless: true }],
            'react/no-namespace': 'error',
            'react/no-object-type-as-default-prop': 'error',
            'react/no-set-state': 'error',
            'react/no-this-in-sfc': 'error',
            'react/no-typos': 'error',
            'react/no-unstable-nested-components': 'error',
            'react/no-unused-class-component-methods': 'error',
            'react/no-unused-prop-types': 'error',
            'react/no-unused-state': 'error',
            'react/no-will-update-set-state': 'error',
            'react/prefer-es6-class': 'error',
            'react/prefer-exact-props': 'error',
            'react/prefer-read-only-props': 'error',
            'react/prefer-stateless-function': 'error',
            'react/require-default-props': 'error',
            'react/require-optimization': 'error',
            'react/sort-comp': 'error',
            'react/sort-prop-types': 'error',
            'react/state-in-constructor': 'error',
            'react/static-property-placement': 'error',
            'react/style-prop-object': 'error',
            'react/void-dom-elements-no-children': 'error',

            '@typescript-eslint/consistent-type-exports': 'off',
            '@typescript-eslint/consistent-type-imports': 'off',
            '@typescript-eslint/member-ordering': 'error',
            '@typescript-eslint/method-signature-style': 'error',
            '@typescript-eslint/no-import-type-side-effects': 'off',
            '@typescript-eslint/no-unnecessary-parameter-property-assignment':
                'error',
            '@typescript-eslint/no-unnecessary-qualifier': 'error',
            '@typescript-eslint/no-useless-empty-export': 'error',
            '@typescript-eslint/prefer-enum-initializers': 'error',
            '@typescript-eslint/prefer-readonly': 'error',
            '@typescript-eslint/prefer-ts-expect-error': 'error',
            '@typescript-eslint/strict-boolean-expressions': 'error',
            '@typescript-eslint/switch-exhaustiveness-check': 'error',
        },
    },
]);
