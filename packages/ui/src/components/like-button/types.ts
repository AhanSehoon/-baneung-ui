import type { CSSProperties } from 'react';

export type LikeButtonSize = 'sm' | 'md' | 'lg';

export interface LikeButtonProps {
  /** Controlled — 좋아요 상태. */
  liked?: boolean;
  /** Uncontrolled 초기값. 기본 false. */
  defaultLiked?: boolean;
  /** 값 변경 콜백. */
  onLikedChange?: (liked: boolean) => void;
  /** 좋아요 카운트 표시 (선택). */
  count?: number;
  /** 비활성화. */
  disabled?: boolean;
  /** 크기. 기본 'md'. */
  size?: LikeButtonSize;
  /** 채워진 하트 색. 기본 '#FF2D78' (hot pink). */
  color?: string;
  /** 빈 하트 stroke 색. 기본 '#9CA5B3'. */
  emptyColor?: string;
  /** burst 입자 색. 기본 color와 동일. */
  burstColor?: string;
  /** burst 입자 개수. 기본 6. */
  burstCount?: number;
  /** ARIA label. 기본 '좋아요'. */
  'aria-label'?: string;
  className?: string;
  style?: CSSProperties;
}
