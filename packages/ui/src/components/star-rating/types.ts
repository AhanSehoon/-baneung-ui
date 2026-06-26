import type { CSSProperties } from 'react';

export type StarRatingSize = 'sm' | 'md' | 'lg';

export interface StarRatingProps {
  /** Controlled — 현재 별점 (0~max). half=true면 0.5 단위. */
  value?: number;
  /** Uncontrolled 초기값. 기본 0. */
  defaultValue?: number;
  /** 값 변경 콜백. */
  onValueChange?: (value: number) => void;
  /** 별 개수. 기본 5. */
  max?: number;
  /** 0.5 단위(half star) 지원. 기본 false. */
  half?: boolean;
  /** 읽기 전용 — 표시만, 입력 X. 기본 false. */
  readOnly?: boolean;
  /** 비활성화. */
  disabled?: boolean;
  /** 크기. 기본 'md'. */
  size?: StarRatingSize;
  /** 채워진 별 색. 기본 '#F59E0B' (amber). */
  color?: string;
  /** 빈 별 색. 기본 '#E9ECEF'. */
  emptyColor?: string;
  /** 별 사이 간격 (px). 기본 4. */
  gap?: number;
  /** ARIA label. 기본 '별점'. */
  'aria-label'?: string;
  className?: string;
  style?: CSSProperties;
}
