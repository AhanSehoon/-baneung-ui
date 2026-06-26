import type { CSSProperties } from 'react';

/**
 * GradientText — 그라데이션이 글자 위를 흐르거나 반짝이며 지나가는 효과.
 *
 * @example flow (색이 계속 순환)
 *   <GradientText text="BANEUNG" colors={['#3B716C', '#5BA8A0', '#85C9BD', '#3B716C']} />
 *
 * @example shimmer (밝은 하이라이트가 주기적으로 지나감)
 *   <GradientText text="Premium" mode="shimmer" color="#1F2937" />
 */
export interface GradientTextProps {
  /** 표시할 텍스트. */
  text: string;
  /**
   * 효과 모드.
   * - 'flow' (기본): 여러 색이 텍스트 위를 부드럽게 흐름.
   * - 'shimmer': 텍스트는 단색(color), 그 위로 밝은 빛 하이라이트만 주기적으로 지나감.
   */
  mode?: 'flow' | 'shimmer';
  /**
   * flow 모드용 색상 배열. 첫/마지막 색이 자연 연결되도록 마지막을 첫 색으로 반복하면 seamless.
   * 미지정 시 기본 브랜드 navy → teal → mint 팔레트.
   */
  colors?: string[];
  /** 흐름 방향 (그라데이션 진행 방향). 기본 'horizontal'. */
  direction?: 'horizontal' | 'vertical' | 'diagonal';
  /** 한 cycle 완료 시간 (ms). 기본 3000. */
  durationMs?: number;
  /** shimmer 모드의 빛 색상. 기본 '#ffffff'. */
  shimmerColor?: string;
  /** shimmer 모드의 베이스 텍스트 색. 기본 'currentColor'. */
  baseColor?: string;

  // ── 시각 커스터마이즈 ─────────────────────────────────────────────────────
  fontSize?: string | number;
  fontWeight?: CSSProperties['fontWeight'];
  /** flow 모드에선 무시 (colors가 사용됨). shimmer/일반 색상 fallback. */
  color?: string;

  // ── HTML 표준 ────────────────────────────────────────────────────────────
  className?: string;
  style?: CSSProperties;
}
