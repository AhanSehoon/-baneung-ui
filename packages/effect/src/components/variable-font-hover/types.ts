import type { CSSProperties } from 'react';

/**
 * VariableFontHover — 마우스 커서가 지나가는 글자만 굵어지는 효과.
 * 가변 폰트(Pretendard Variable, Inter Variable 등) 사용 시 부드럽게 보간됨.
 *
 * @example
 *   <VariableFontHover text="HOVER ME" minWeight={300} maxWeight={900} radius={80} />
 */
export interface VariableFontHoverProps {
  /** 표시할 텍스트. */
  text: string;
  /** 기본 굵기 — 커서에서 멀어졌을 때. 기본 300. */
  minWeight?: number;
  /** 최대 굵기 — 커서 바로 위. 기본 900. */
  maxWeight?: number;
  /** 영향 반경 (px). 이 거리 안의 글자만 굵어짐. 기본 80. */
  radius?: number;
  /**
   * 시간 보간 (ms). 0이면 즉시, 값이 클수록 부드럽게.
   * transition으로 font-weight 변화 — 가변 폰트에서만 부드럽게 보간됨.
   * 기본 220.
   */
  transitionMs?: number;

  // ── 시각 커스터마이즈 ─────────────────────────────────────────────────────
  fontSize?: string | number;
  color?: string;
  /** 폰트 family 강제 지정. 가변 폰트(예: 'Pretendard Variable')를 권장. */
  fontFamily?: string;

  // ── HTML 표준 ────────────────────────────────────────────────────────────
  className?: string;
  style?: CSSProperties;
}
