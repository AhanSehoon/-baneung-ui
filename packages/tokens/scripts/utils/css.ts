import type { FlatRecord } from './flatten';

/**
 * Flat 토큰 키를 CSS 변수 이름으로 변환.
 *
 * 변환 규칙:
 *   1. `.` → `-` (네스팅 구분자 → 케밥 구분자)
 *   2. camelCase → kebab-case (`surfaceStrong` → `surface-strong`)
 *   3. 결과 앞에 `--` 접두사
 *
 * 예: `color.bg.surfaceStrong` → `--color-bg-surface-strong`
 */
export function keyToCssVar(key: string): string {
  const normalized = key
    .replace(/\./g, '-')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();
  return `--${normalized}`;
}

/**
 * Flat 토큰 객체를 CSS 변수 선언 라인으로 변환.
 * 들여쓰기는 호출부에서 지정합니다.
 */
export function flatToCssDeclarations(flat: FlatRecord, indent = '  '): string {
  return Object.entries(flat)
    .map(([key, value]) => `${indent}${keyToCssVar(key)}: ${String(value)};`)
    .join('\n');
}
