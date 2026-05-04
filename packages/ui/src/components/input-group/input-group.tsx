import * as React from 'react';

import { cn } from '../../lib/cn';

export interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 그룹 시맨틱 라벨링. */
  'aria-label'?: string;
}

/**
 * InputGroup — Input + Button + Icon 등을 한 줄로 묶고 인접 보더를 머지.
 *
 * 자식 요소는 각각 `rounded-none` (각진 디자인 강제)을 가져야 합니다 —
 * Input/Button은 이미 그렇게 작성되어 있습니다.
 *
 * @example
 *   <InputGroup>
 *     <Input placeholder="검색어" />
 *     <Button variant="outline">검색</Button>
 *   </InputGroup>
 */
export const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(function InputGroup(
  { className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role="group"
      className={cn(
        'inline-flex w-full items-stretch',
        // 인접 보더 머지
        '[&>*+*]:-ml-px',
        // 호버/포커스 시 보더 우선
        '[&>*]:relative',
        '[&>*:hover]:z-10 [&>*:focus-within]:z-10',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});
InputGroup.displayName = 'InputGroup';
