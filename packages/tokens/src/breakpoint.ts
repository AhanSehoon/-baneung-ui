/**
 * 반응형 브레이크포인트 토큰.
 * 모바일 퍼스트 — 각 값은 `min-width` 기준입니다.
 * Tailwind v4 기본값과 동일한 척도를 사용합니다.
 */

export const breakpoint = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export type Breakpoint = typeof breakpoint;
