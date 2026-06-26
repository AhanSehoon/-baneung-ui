import type { CSSProperties, ReactNode } from 'react';

export type StepperSize = 'sm' | 'md' | 'lg';
export type StepperOrientation = 'horizontal' | 'vertical';

export interface StepperStep {
  /** 표시 라벨. */
  label: ReactNode;
  /** 선택 — 라벨 아래/옆 보조 설명. */
  description?: ReactNode;
  /** 아이콘 (체크/숫자 대신). */
  icon?: ReactNode;
}

export interface StepperProps {
  /** 단계 배열. */
  steps: StepperStep[];
  /**
   * 현재 활성 단계 인덱스 (0-based).
   * 이 인덱스보다 작은 단계는 completed, 같으면 active, 크면 upcoming.
   */
  current: number;
  /** 방향. 기본 'horizontal'. */
  orientation?: StepperOrientation;
  /** 크기. 기본 'md'. */
  size?: StepperSize;
  /** 활성/완료 색. 기본 navy. */
  activeColor?: string;
  /** 미완료 색. 기본 gray. */
  inactiveColor?: string;
  /** 단계 전환 애니메이션 시간 (ms). 기본 400. */
  duration?: number;
  /** 클릭으로 단계 이동 허용. 콜백 받음. */
  onStepClick?: (index: number) => void;
  className?: string;
  style?: CSSProperties;
}
