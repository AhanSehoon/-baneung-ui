import type { CSSProperties } from 'react';

/**
 * ScrambleText — 랜덤 글자가 빠르게 깜빡이다가 한 글자씩 자리를 찾아가는 해킹/디코딩 효과.
 *
 * @example
 *   <ScrambleText text="ACCESS GRANTED" />
 */
export interface ScrambleTextProps {
  /** 최종 표시할 텍스트. 변경 시 처음부터 다시 스크램블. */
  text: string;
  /**
   * 스크램블에 사용할 글자 풀.
   * 기본 영문 대문자 + 숫자 + 일부 기호.
   */
  characters?: string;
  /** 글자 하나가 자리잡히기까지 걸리는 시간 (ms/char). 기본 60. */
  revealSpeed?: number;
  /** 스크램블 중 화면 갱신 주기 (ms). 작을수록 더 빠르게 깜빡임. 기본 35. */
  scrambleSpeed?: number;
  /** true면 다 푼 뒤 잠시 멈췄다 다시 처음부터. 기본 false. */
  loop?: boolean;
  /** loop=true일 때 모두 풀린 뒤 대기 시간 (ms). 기본 2500. */
  pauseAfterRevealMs?: number;
  /** 외부에서 강제 reset 트리거. */
  resetKey?: number | string;

  // ── 시각 커스터마이즈 ─────────────────────────────────────────────────────
  fontSize?: string | number;
  fontWeight?: CSSProperties['fontWeight'];
  color?: string;

  // ── HTML 표준 ────────────────────────────────────────────────────────────
  className?: string;
  style?: CSSProperties;
}
