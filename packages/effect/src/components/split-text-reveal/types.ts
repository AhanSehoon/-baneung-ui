import type { CSSProperties } from 'react';

/**
 * SplitTextReveal — 텍스트를 글자 또는 단어로 쪼개 순차적으로 페이드+슬라이드 인.
 */
export interface SplitTextRevealProps {
  /** 표시할 텍스트. */
  text: string;
  /** 분할 단위 — 글자(char) 또는 단어(word). 기본 'char'. */
  by?: 'char' | 'word';
  /** 항목 간 시작 시차 (ms). 기본 30. */
  stagger?: number;
  /** 항목 하나의 애니메이션 시간 (ms). 기본 400. */
  duration?: number;
  /**
   * 발사 시점.
   * - 'mount': 마운트 즉시 시작 (기본)
   * - 'inView': 화면에 들어올 때 시작 (IntersectionObserver, 1회 발사)
   */
  trigger?: 'mount' | 'inView';
  /** inView 트리거의 임계값 (0~1). 기본 0.15. */
  threshold?: number;

  // ── 시각 커스터마이즈 ─────────────────────────────────────────────────────
  fontSize?: string | number;
  fontWeight?: CSSProperties['fontWeight'];
  color?: string;

  // ── HTML 표준 ────────────────────────────────────────────────────────────
  className?: string;
  style?: CSSProperties;
}
