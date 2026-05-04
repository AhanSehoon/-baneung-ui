/**
 * 바능 디자인 시스템 공통 ESLint 베이스.
 *
 * - TypeScript strict
 * - import/order: CLAUDE.md 4.3절의 그룹 순서를 가능한 한 매핑
 *   (1) 외부 라이브러리 → (2) @baneung-pack/* → (3) @/* (사내 별칭)
 *   → (4) 부모/형제/인덱스 → (5) CSS는 마지막
 * - prettier와 충돌 규칙 비활성
 */

/** @type {import('eslint').Linter.Config} */
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/stylistic',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  rules: {
    'import/order': [
      'error',
      {
        groups: [
          ['builtin', 'external'],
          'internal',
          ['parent', 'sibling', 'index'],
          'object',
          'type',
        ],
        pathGroups: [
          { pattern: '@baneung-pack/**', group: 'internal', position: 'before' },
          { pattern: '@/**', group: 'internal' },
          {
            pattern: '*.css',
            group: 'index',
            position: 'after',
            patternOptions: { matchBase: true },
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
    ],
    '@typescript-eslint/no-explicit-any': 'error',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: { alwaysTryTypes: true },
      node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    },
  },
  ignorePatterns: ['dist', '.turbo', '.next', 'node_modules', 'coverage', '*.cjs', '*.config.*'],
};
