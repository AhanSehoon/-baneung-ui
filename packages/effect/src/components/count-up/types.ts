import type { CSSProperties } from 'react';

/**
 * CountUp — 숫자가 from에서 to까지 부드럽게 증가/감소하는 카운터.
 * 통계 섹션·KPI·achievement 카드 등에 사용.
 */
export interface CountUpProps {
  /** 시작 숫자. 기본 0. */
  from?: number;
  /** 목표 숫자 (필수). */
  to: number;
  /** 애니메이션 전체 시간 (ms). 기본 1500. */
  duration?: number;
  /**
   * 천 단위 구분자. 빈 문자열이면 구분자 없음.
   * 기본 ',' (예: 1,234,567).
   */
  separator?: string;
  /** 소수점 자리수. 기본 0. */
  decimals?: number;
  /** 소수점 구분자. 기본 '.'. */
  decimalSeparator?: string;
  /** 숫자 앞에 붙일 문자열 (예: '$'). */
  prefix?: string;
  /** 숫자 뒤에 붙일 문자열 (예: '+', '%', '명'). */
  suffix?: string;
  /**
   * 발사 시점.
   * - 'mount': 마운트 즉시 시작 (기본)
   * - 'inView': 화면에 들어올 때 시작 (1회 발사)
   */
  trigger?: 'mount' | 'inView';
  /** inView 임계값 (0~1). 기본 0.3. */
  threshold?: number;

  // ── 시각 커스터마이즈 ─────────────────────────────────────────────────────
  fontSize?: string | number;
  fontWeight?: CSSProperties['fontWeight'];
  color?: string;

  // ── HTML 표준 ────────────────────────────────────────────────────────────
  className?: string;
  style?: CSSProperties;
}
