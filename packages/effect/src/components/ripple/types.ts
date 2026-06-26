import type { CSSProperties, ReactNode } from 'react';

export interface RippleProps {
  /** 감쌀 요소 (보통 단일 button/div). */
  children: ReactNode;
  /** ripple 색상. 기본 'currentColor'. */
  color?: string;
  /** ripple 시간 (ms). 기본 600. */
  duration?: number;
  /** ripple 시작 opacity (퍼지면서 0으로 감소). 기본 0.35. */
  opacity?: number;
  /** ripple 비활성화. */
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}
