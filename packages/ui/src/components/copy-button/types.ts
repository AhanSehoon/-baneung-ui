import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type CopyButtonSize = 'sm' | 'md' | 'lg';

export interface CopyButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  /** 복사할 텍스트 (필수). */
  value: string;
  /** 복사 완료 콜백. */
  onCopied?: (value: string) => void;
  /** 실패 콜백 (clipboard API 미지원/거부 등). */
  onError?: (error: unknown) => void;
  /** 복사 완료 상태 유지 시간 (ms). 기본 1800. */
  duration?: number;
  /** 크기. 기본 'md'. */
  size?: CopyButtonSize;
  /** "Copied!" 툴팁 표시. 기본 true. */
  showTooltip?: boolean;
  /** 툴팁 라벨 커스터마이즈. 기본 'Copied!'. */
  tooltipLabel?: string;
  /** 아이콘만 표시할지 (true면 children 무시, 아이콘+텍스트는 false). 기본 false. */
  iconOnly?: boolean;
  /** idle 상태에서 표시할 children (텍스트). iconOnly=true면 무시. */
  children?: ReactNode;
}
