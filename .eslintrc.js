module.exports = {
  env: {
    jest: true,
    node: true,
  },

  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'prettier',
    'plugin:typescript-sort-keys/recommended',
  ],

  parser: '@typescript-eslint/parser',

  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
    ecmaVersion: 2020,
    sourceType: 'module',
  },

  plugins: [
    '@typescript-eslint',
    'jest',
    'prefer-arrow',
    'prettier',
    'eslint-plugin-import-helpers',
    'sort-destructure-keys',
    'sort-export-all',
    'typescript-sort-keys',
    'unused-imports',
  ],

  rules: {
    'arrow-body-style': ['error', 'as-needed'],
    'constructor-super': 'error',
    curly: 'error',
    'dot-notation': 'error',
    eqeqeq: ['error', 'smart'],
    'func-names': ['error', 'never'],
    'func-style': ['error', 'expression'],
    'guard-for-in': 'error',
    'import/extensions': 'off',
    'import-helpers/order-imports': [
      'error',
      {
        alphabetize: { order: 'asc', ignoreCase: false },
        groups: ['module', '/^(api|constant|features|mocks|strings|utils|declarations)/', ['sibling', 'index']],
        newlinesBetween: 'always',
      },
    ],
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'off',
    'jest/expect-expect': ['error', { assertFunctionNames: ['expect'] }],
    'jest/no-alias-methods': 'error',
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'warn',
    'jest/no-identical-title': 'error',
    'jest/no-jasmine-globals': 'error',
    'jest/no-jest-import': 'error',
    'jest/no-mocks-import': 'error',
    'jest/no-test-callback': 'off',
    'jest/no-test-return-statement': 'error',
    'jest/no-truthy-falsy': 'error',
    'jest/prefer-called-with': 'warn',
    'jest/prefer-to-be-null': 'error',
    'jest/prefer-to-be-undefined': 'error',
    'jest/prefer-to-contain': 'error',
    'jest/prefer-to-have-length': 'error',
    'jest/require-to-throw-message': 'error',
    'jest/valid-describe': 'error',
    'jest/valid-expect-in-promise': 'error',
    'jest/valid-expect': 'error',
    'jest/valid-title': 'error',
    'max-classes-per-file': ['warn', 1],
    'newline-after-var': [2, 'always'],
    'no-bitwise': 'error',
    'no-caller': 'error',
    'no-cond-assign': 'error',
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
    'no-empty': 'error',
    'no-eval': 'error',
    'no-new-wrappers': 'error',
    'no-redeclare': 'error',
    'no-undef-init': 'error',
    'no-unsafe-finally': 'error',
    'no-unused-labels': 'error',
    'no-unused-vars': 'off',
    'no-use-before-define': 'off',
    'no-var': 'error',
    'object-shorthand': 'error',
    'one-var': ['error', 'never'],
    'prefer-arrow/prefer-arrow-functions': 'warn',
    'prefer-const': 'error',
    'prefer-destructuring': ['error', { array: false, object: true }],
    radix: 'error',
    'sort-destructure-keys/sort-destructure-keys': 2,
    'sort-export-all/sort-export-all': [
      'error',
      'asc',
      {
        caseSensitive: false,
      },
    ],
    'sort-keys': ['error'],
    'sort-imports': ['error', { ignoreDeclarationSort: true }],
    '@typescript-eslint/adjacent-overload-signatures': 'error',
    '@typescript-eslint/array-type': 'error',
    '@typescript-eslint/consistent-type-assertions': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/member-delimiter-style': 'off',
    '@typescript-eslint/member-ordering': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-extra-semi': 'off',
    '@typescript-eslint/no-misused-new': 'error',
    '@typescript-eslint/no-namespace': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/no-object-literal-type-assertion': 'off',
    '@typescript-eslint/no-throw-literal': 'error',
    '@typescript-eslint/no-unused-expressions': 'error',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-var-requires': 'error',
    '@typescript-eslint/prefer-for-of': 'error',
    '@typescript-eslint/prefer-function-type': 'warn',
    '@typescript-eslint/prefer-namespace-keyword': 'error',
    '@typescript-eslint/quotes': 'off',
    '@typescript-eslint/triple-slash-reference': 'error',
    '@typescript-eslint/unified-signatures': 'error',
    'unused-imports/no-unused-imports': 'error',
    'use-isnan': 'error',
    'valid-typeof': 'off',
  },
}