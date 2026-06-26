import type { CSSProperties } from 'react';

/**
 * RotatingWords — 고정 문구 뒤의 단어만 슬라이드+페이드로 교체되는 효과.
 *
 * @example "We build [apps]" 처럼 뒤의 단어만 회전.
 *   <span>We build <RotatingWords words={['apps', 'agents', 'sites']} /></span>
 */
export interface RotatingWordsProps {
  /** 순환할 단어 배열. 최소 1개. */
  words: string[];
  /** 단어 하나가 보이는 시간 (ms). 기본 2000. */
  intervalMs?: number;
  /** 전환 애니메이션 시간 (ms) — slide+fade. 기본 400. */
  transitionMs?: number;
  /** true면 무한 반복. false면 마지막 단어에서 정지. 기본 true. */
  loop?: boolean;

  // ── 시각 커스터마이즈 ─────────────────────────────────────────────────────
  fontSize?: string | number;
  fontWeight?: CSSProperties['fontWeight'];
  color?: string;

  // ── HTML 표준 ────────────────────────────────────────────────────────────
  className?: string;
  style?: CSSProperties;
}
