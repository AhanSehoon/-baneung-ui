import type { CSSProperties } from 'react';

/**
 * SpotlightText — 커서 주변만 밝아지고 나머지는 어둡게 처리되는 스포트라이트 효과.
 *
 * @example
 *   <SpotlightText text="MOVE YOUR MOUSE OVER THE TEXT" radius={120} />
 */
export interface SpotlightTextProps {
  /** 표시할 텍스트. */
  text: string;
  /** 스포트라이트 반경 (px). 기본 120. */
  radius?: number;
  /**
   * 어두운 영역의 투명도 (0~1).
   * 0이면 완전히 안 보임, 1이면 항상 보임. 기본 0.15.
   */
  dimOpacity?: number;
  /**
   * 스포트라이트 안 글자의 색.
   * 미지정 시 `color` 또는 currentColor 사용.
   */
  highlightColor?: string;

  // ── 시각 커스터마이즈 ─────────────────────────────────────────────────────
  fontSize?: string | number;
  fontWeight?: CSSProperties['fontWeight'];
  /** 베이스 텍스트 색 (dim 레이어). 기본 currentColor. */
  color?: string;

  // ── HTML 표준 ────────────────────────────────────────────────────────────
  className?: string;
  style?: CSSProperties;
}
