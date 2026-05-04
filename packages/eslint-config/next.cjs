/**
 * Next.js 앱(apps/docs)용 ESLint.
 *
 * eslint-config-next가 자체적으로 react/react-hooks/jsx-a11y/import 플러그인을
 * 등록하기 때문에, base/react를 다시 extend하면 import 플러그인이 두 경로에서
 * 로드되어 충돌합니다(pnpm strict isolation 환경 특성).
 *
 * 따라서 이 설정은 base/react 체인을 거치지 않고, next/core-web-vitals 위에
 * 우리의 import/order·TypeScript 규칙만 직접 추가하는 형태로 만듭니다.
 */

/** @type {import('eslint').Linter.Config} */
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/stylistic',
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
    'react/prop-types': 'off',
    'react/display-name': 'error',
  },
  settings: {
    react: { version: 'detect' },
  },
  ignorePatterns: ['dist', '.turbo', '.next', 'node_modules', 'coverage', '*.cjs', '*.config.*'],
};
