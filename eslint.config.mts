import functional from 'eslint-plugin-functional';
import importPlugin from 'eslint-plugin-import-x';
import reactDom from 'eslint-plugin-react-dom';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import reactX from 'eslint-plugin-react-x';
import unicorn from 'eslint-plugin-unicorn';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig([
    globalIgnores(['build', 'eslint.config.mts', 'vite.config.ts']),

    js.configs.all,
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    reactDom.configs.strict,
    reactHooks.configs.flat['recommended-latest'],
    reactRefresh.configs.vite,
    reactX.configs['strict-type-checked'],
    unicorn.configs['all'],
    importPlugin.configs['flat/recommended'],

    {
        files: ['**/*.{ts,tsx}'],
        plugins: {
            functional,
            stylistic,
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
            'import-x/internal-regex': '^@',
        },
        rules: {
            'no-undef': 'off', // enforced by typescript
            'sort-imports': 'off', // import-x/internal-regex does this better
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
            '@typescript-eslint/consistent-type-exports': 'off',
            '@typescript-eslint/consistent-type-imports': 'off',
            '@typescript-eslint/method-signature-style': 'error',
            '@typescript-eslint/no-import-type-side-effects': 'off',
            '@typescript-eslint/no-unnecessary-qualifier': 'error',
            '@typescript-eslint/no-useless-empty-export': 'error',
            '@typescript-eslint/prefer-enum-initializers': 'error',
            '@typescript-eslint/prefer-ts-expect-error': 'error',
            '@typescript-eslint/strict-boolean-expressions': 'error',
            '@typescript-eslint/switch-exhaustiveness-check': 'error',

            'unicorn/filename-case': [
                'error',
                {
                    cases: { kebabCase: true, pascalCase: true },
                    ignore: ['.ts', '.tsx'],
                },
            ],
            'unicorn/name-replacements': [
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
            'unicorn/try-complexity': 'off', // quite useless
            'unicorn/prefer-await': 'off', // not always possible to use
            'unicorn/default-export-style': 'off', // requires `function`
            'unicorn/consistent-arrow-return-style': 'off', // ugly
            'unicorn/no-barrel-files': 'off', // what is the point
            'unicorn/single-line-block-comment-style': 'off', // unnecessary

            'functional/type-declaration-immutability': [
                'error',
                {
                    rules: [
                        {
                            identifiers: '.+',
                            immutability: 'ReadonlyShallow',
                            comparator: 'AtLeast',
                        },
                    ],
                },
            ],
            'no-restricted-syntax': [
                'error',
                {
                    selector: 'TSPropertySignature[readonly=true]',
                    message:
                        'Use the `Readonly<T>` utility type instead of the `readonly` keyword.',
                },
            ],

            'import-x/no-namespace': 'error',
            'import-x/no-mutable-exports': 'error',
            'import-x/no-relative-packages': 'error',
            'import-x/consistent-type-specifier-style': 'off',
            'import-x/no-cycle': 'error',
            'import-x/no-named-default': 'error',
            'import-x/no-named-as-default-member': 'error',
            'import-x/no-anonymous-default-export': 'error',
            'import-x/no-commonjs': 'error',
            'import-x/no-amd': 'error',
            'import-x/no-duplicates': 'error',
            'import-x/first': 'error',
            'import-x/no-extraneous-dependencies': 'error',
            'import-x/no-absolute-path': 'error',
            'import-x/no-nodejs-modules': 'error',
            'import-x/no-webpack-loader-syntax': 'error',
            'import-x/order': [
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
            'import-x/newline-after-import': 'off',
            'import-x/no-dynamic-require': 'error',
            'import-x/unambiguous': 'error',
            'import-x/no-unassigned-import': ['error', { allow: ['**/*.css'] }],
            'import-x/no-useless-path-segments': 'error',
            'import-x/no-import-module-exports': 'error',
            'import-x/no-empty-named-blocks': 'error',
            'import-x/no-unresolved': 'off',
            'import-x/no-named-as-default': 'off',

            'react-dom/no-missing-button-type': 'error',
            'react-dom/no-missing-iframe-sandbox': 'error',
            'react-dom/no-script-url': 'error',
            'react-dom/no-dangerously-set-innerhtml': 'error',
            'react-dom/no-void-elements-with-children': 'error',
            'react-dom/no-string-style-prop': 'error',

            // lost style enforcements from `eslint-plugin-react` due to
            // `eslint` version bump:
            // react/function-component-definition
            // react/destructuring-assignment
            // react/jsx-handler-names
            // react/jsx-fragments
            // TODO: add them back once `eslint-plugin-react` is updated

            'react-x/no-array-index-key': 'error',
            'react-x/no-unstable-context-value': 'error',
            'react-x/no-nested-component-definitions': 'error',
            'react-x/no-forward-ref': 'error',
            'react-x/use-state': 'error',
            'react-x/no-class-component': 'error',

            'stylistic/jsx-self-closing-comp': 'error',
            'stylistic/jsx-pascal-case': 'error',
            'stylistic/jsx-curly-brace-presence': 'error',
        },
    },
]);
