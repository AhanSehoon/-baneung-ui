/**
 * z-index 토큰.
 * 100 단위 간격으로 레이어 순서를 명시합니다 — 임의 z-index 사용 금지.
 *
 * 충돌 시 우선순위: tooltip > toast > popover > modal > overlay > banner > sticky > dropdown.
 */

export const zIndex = {
  hide: -1,
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

export type ZIndex = typeof zIndex;
