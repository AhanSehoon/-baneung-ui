/**
 * 스페이싱 토큰.
 * 4px 베이스 — `space-1` (4px) ~ `space-32` (128px).
 *
 * 사용 가이드:
 * - 컴포넌트 내부 패딩/갭은 1~6 (4~24px) 범위 위주
 * - 섹션 간 간격은 8~16 (32~64px)
 * - 페이지 레벨 여백은 16~32 (64~128px)
 */

export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
} as const;

export type Spacing = typeof spacing;
