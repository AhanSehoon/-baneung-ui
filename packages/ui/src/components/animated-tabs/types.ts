import type { CSSProperties, ReactNode } from 'react';

export type AnimatedTabsSize = 'sm' | 'md' | 'lg';
export type AnimatedTabsOrientation = 'horizontal' | 'vertical';

export interface AnimatedTabItem {
  /** 고유 키. */
  value: string;
  /** 탭 버튼 라벨. */
  label: ReactNode;
  /** 패널 내용. */
  content: ReactNode;
  /** 비활성화. */
  disabled?: boolean;
}

export interface AnimatedTabsProps {
  /** 탭 항목 배열. */
  items: AnimatedTabItem[];
  /** Controlled — 활성 tab value. */
  value?: string;
  /** Uncontrolled — 초기 활성 value. 미지정 시 첫 항목. */
  defaultValue?: string;
  /** 변경 콜백. */
  onValueChange?: (value: string) => void;
  /** 방향. 기본 'horizontal'. */
  orientation?: AnimatedTabsOrientation;
  /** 크기. 기본 'md'. */
  size?: AnimatedTabsSize;
  /** 활성 인디케이터 색. 기본 navy. */
  indicatorColor?: string;
  /** 활성 텍스트 색. 기본 navy. */
  activeColor?: string;
  /** 인디케이터 슬라이드 시간 (ms). 기본 250. */
  duration?: number;
  className?: string;
  style?: CSSProperties;
}
