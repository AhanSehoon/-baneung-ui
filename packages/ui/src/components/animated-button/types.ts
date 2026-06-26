import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type AnimatedButtonStatus = 'idle' | 'loading' | 'success' | 'error';
export type AnimatedButtonSize = 'sm' | 'md' | 'lg';
export type AnimatedButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export interface AnimatedButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onClick'
> {
  /** 버튼 텍스트/아이콘. */
  children?: ReactNode;
  /**
   * onClick — Promise 반환 시 자동으로 loading → success/error 전환.
   * void 반환 시 status를 외부에서 직접 제어해야 함.
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<unknown>;
  /**
   * 외부 제어 status. 지정하면 onClick Promise 자동 처리를 우회.
   * - 'idle' (기본): 평상 상태
   * - 'loading': 스피너 표시 + disabled
   * - 'success': 체크 아이콘으로 모핑
   * - 'error': X 아이콘 + shake
   */
  status?: AnimatedButtonStatus;
  /** success/error 상태 자동 idle 복귀까지 시간 (ms). 0이면 자동 복귀 X. 기본 1800. */
  resetMs?: number;
  /** 변형 색상. 기본 'primary'. */
  variant?: AnimatedButtonVariant;
  /** 크기. 기본 'md'. */
  size?: AnimatedButtonSize;
  /** loading 상태에서 표시할 텍스트. 미지정 시 children 유지 + 스피너만. */
  loadingText?: ReactNode;
  /** success 상태에서 표시할 텍스트. 미지정 시 체크 아이콘만. */
  successText?: ReactNode;
  /** error 상태에서 표시할 텍스트. 미지정 시 X 아이콘만. */
  errorText?: ReactNode;
}
