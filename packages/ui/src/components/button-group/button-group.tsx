import * as React from 'react';

import { cn } from '../../lib/cn';

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 그룹 방향. 기본 'horizontal'. */
  orientation?: 'horizontal' | 'vertical';
  /** 사용자 라벨링이 없을 때 스크린리더가 그룹 의미를 인지하도록 라벨 권장. */
  'aria-label'?: string;
}

/**
 * ButtonGroup — 여러 Button을 묶어 인접 보더를 합치고 그룹 시맨틱을 부여.
 *
 * - role="group"
 * - 자식 Button은 이미 `rounded-none` (각진 디자인). 인접 보더만 `-ml-px`/`-mt-px`로 중복 제거.
 * - 호버/포커스 시 z-index를 올려 인접 보더에 가려지지 않도록 함.
 */
export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
  { className, orientation = 'horizontal', children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role="group"
      className={cn(
        'inline-flex',
        orientation === 'horizontal' ? 'flex-row' : 'flex-col',
        // 인접 자식 보더 중복 제거 (1px overlap)
        orientation === 'horizontal' ? '[&>*+*]:-ml-px' : '[&>*+*]:-mt-px',
        // 호버/포커스 시 보더가 위로 올라오게
        '[&>*]:relative',
        '[&>*:hover]:z-10 [&>*:focus-visible]:z-10',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});
ButtonGroup.displayName = 'ButtonGroup';
