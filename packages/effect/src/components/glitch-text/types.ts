import type { CSSProperties } from 'react';

/**
 * GlitchText — RGB 채널이 어긋나는 글리치 효과.
 *
 * @example 항상 글리치
 *   <GlitchText text="SYSTEM FAILURE" intensity={0.7} />
 *
 * @example hover 시에만
 *   <GlitchText text="hover me" triggerOn="hover" />
 */
export interface GlitchTextProps {
  /** 표시할 텍스트. */
  text: string;
  /**
   * 글리치 강도 (0~1). 채널이 어긋나는 거리와 빈도에 영향.
   * 0 = 효과 없음, 1 = 최대 강도. 기본 0.5.
   */
  intensity?: number;
  /**
   * 발사 시점.
   * - 'always' (기본): 항상 글리치 중.
   * - 'hover': hover 시에만 글리치, 평소엔 정적 텍스트.
   */
  triggerOn?: 'always' | 'hover';
  /** 베이스 애니메이션 시간 (ms). 작을수록 빠른 글리치. 기본 2200. */
  speedMs?: number;
  /** 적색 채널 색상. 기본 '#ff003c'. */
  redChannelColor?: string;
  /** 청록 채널 색상. 기본 '#00fbff'. */
  cyanChannelColor?: string;

  // ── 시각 커스터마이즈 ─────────────────────────────────────────────────────
  fontSize?: string | number;
  fontWeight?: CSSProperties['fontWeight'];
  /** 베이스 텍스트 색. 기본 currentColor. */
  color?: string;

  // ── HTML 표준 ────────────────────────────────────────────────────────────
  className?: string;
  style?: CSSProperties;
}
