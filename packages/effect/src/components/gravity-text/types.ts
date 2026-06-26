import type { CSSProperties } from 'react';

/**
 * GravityText — 글자가 중력에 떨어지거나 흩어지는 물리 효과.
 *
 * @example mount 시 한 번 떨어짐
 *   <GravityText text="FALLING" trigger="mount" />
 *
 * @example hover 시에만 흩어졌다 복귀
 *   <GravityText text="Hover Me" trigger="hover" />
 */
export interface GravityTextProps {
  /** 표시할 텍스트. */
  text: string;
  /**
   * 발사 시점.
   * - 'mount': 마운트 즉시 한 번 떨어짐 (1회).
   * - 'hover': hover 시 흩어지고, hover-out 시 복귀 (반복 가능).
   * - 'inView': 화면에 들어올 때 한 번 떨어짐.
   *
   * 기본 'mount'.
   */
  trigger?: 'mount' | 'hover' | 'inView';
  /** 낙하/흩어짐 시간 (ms). 기본 1400. */
  duration?: number;
  /** 글자 간 시차 (ms). 기본 30. */
  stagger?: number;
  /** 가로 흩어짐 강도 (0~1). 0이면 수직 낙하만, 1이면 강하게 흩어짐. 기본 0.5. */
  spread?: number;
  /** 낙하 거리 (px). 기본 320. */
  gravity?: number;
  /** 회전 강도 — 글자가 떨어지며 회전하는 최대 각도 (deg). 기본 90. */
  rotation?: number;
  /** inView 임계값 (0~1). 기본 0.2. */
  threshold?: number;

  // ── 시각 커스터마이즈 ─────────────────────────────────────────────────────
  fontSize?: string | number;
  fontWeight?: CSSProperties['fontWeight'];
  color?: string;

  // ── HTML 표준 ────────────────────────────────────────────────────────────
  className?: string;
  style?: CSSProperties;
}
