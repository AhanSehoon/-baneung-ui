/**
 * 라디우스 토큰.
 *
 * **각진 디자인 강제**: `none` / `sm` (2px) / `md` (4px) — 3개만 존재.
 * 그 이상의 둥근 디자인은 의도적으로 토큰에 포함하지 않습니다.
 * (CLAUDE.md 5.4, PROJECT_PLAN.md 7.4)
 *
 * 사용 가이드:
 * - `none` — 버튼·카드·인풋·다이얼로그 등 99% 케이스
 * - `sm` (2px) — 인풋 안쪽 칩, 마이크로 컨트롤 (드물게)
 * - `md` (4px) — 특수 강조 영역 (지양)
 */

export const radius = {
  none: '0',
  sm: '2px',
  md: '4px',
} as const;

export type Radius = typeof radius;
export type RadiusToken = keyof typeof radius;
