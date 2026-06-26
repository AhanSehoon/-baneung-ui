import type { CSSProperties } from 'react';

/**
 * WavyText — 글자들이 파도치듯 위아래로 움직이는 효과.
 */
export interface WavyTextProps {
  /** 표시할 텍스트. */
  text: string;
  /**
   * 움직임 모드.
   * - 'wave' (기본): 사인 곡선처럼 부드러운 위아래 움직임.
   * - 'bounce': 통통 튀듯 빠르게 올라갔다가 천천히 내려옴.
   */
  mode?: 'wave' | 'bounce';
  /** 진폭 (em 단위). 글자가 위아래로 움직이는 폭. 기본 0.25. */
  amplitude?: number;
  /** 한 사이클 완료 시간 (ms). 기본 2000. */
  duration?: number;
  /**
   * 글자 간 위상 차이 (0~1, 한 사이클의 비율).
   * 0.08이면 각 글자마다 8%씩 위상 어긋남 → 파도 효과.
   * 기본 0.08.
   */
  phaseStep?: number;

  // ── 시각 커스터마이즈 ─────────────────────────────────────────────────────
  fontSize?: string | number;
  fontWeight?: CSSProperties['fontWeight'];
  color?: string;

  // ── HTML 표준 ────────────────────────────────────────────────────────────
  className?: string;
  style?: CSSProperties;
}
