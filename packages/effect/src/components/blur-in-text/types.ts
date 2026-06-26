import type { CSSProperties } from 'react';

/**
 * BlurInText — 흐릿한 상태에서 선명해지며 등장하는 텍스트.
 */
export interface BlurInTextProps {
  /** 표시할 텍스트. */
  text: string;
  /**
   * 분할 단위.
   * - 'char': 글자 단위로 stagger
   * - 'word': 단어 단위로 stagger (기본)
   * - 'all': 전체를 한 덩어리로 한 번에
   */
  by?: 'char' | 'word' | 'all';
  /** 항목 간 시작 시차 (ms). by='all'면 무시. 기본 50. */
  stagger?: number;
  /** 항목 하나의 애니메이션 시간 (ms). 기본 600. */
  duration?: number;
  /** 시작 blur 강도 (px). 기본 8. */
  blurAmount?: number;
  /**
   * 발사 시점.
   * - 'mount': 마운트 즉시 시작 (기본)
   * - 'inView': 화면에 들어올 때 시작 (1회 발사)
   */
  trigger?: 'mount' | 'inView';
  /** inView 임계값 (0~1). 기본 0.15. */
  threshold?: number;

  // ── 시각 커스터마이즈 ─────────────────────────────────────────────────────
  fontSize?: string | number;
  fontWeight?: CSSProperties['fontWeight'];
  color?: string;

  // ── HTML 표준 ────────────────────────────────────────────────────────────
  className?: string;
  style?: CSSProperties;
}
