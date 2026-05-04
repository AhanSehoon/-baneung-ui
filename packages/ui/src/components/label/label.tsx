import * as LabelPrimitive from '@radix-ui/react-label';
import * as React from 'react';

import { cn } from '../../lib/cn';

/**
 * Label — 폼 컨트롤용 라벨.
 *
 * - Radix Label 기반 — `htmlFor`로 컨트롤 id를 가리키면 클릭 시 포커스 이전
 * - disabled 컨트롤 옆에 있을 때 자동으로 시각 약화
 */
export const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(function Label({ className, ...props }, ref) {
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        'text-sm font-medium leading-none text-foreground',
        'peer-disabled:cursor-not-allowed peer-disabled:opacity-60',
        className,
      )}
      {...props}
    />
  );
});
Label.displayName = 'Label';
