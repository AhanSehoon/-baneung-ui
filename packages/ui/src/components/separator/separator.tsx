import * as SeparatorPrimitive from '@radix-ui/react-separator';
import * as React from 'react';

import { cn } from '../../lib/cn';

export interface SeparatorProps extends React.ComponentPropsWithoutRef<
  typeof SeparatorPrimitive.Root
> {
  /**
   * 시맨틱 구분선이 아니고 순수 장식이면 true. 기본 false (스크린리더가 인지).
   * Radix는 decorative=true 시 role을 'none'으로 설정합니다.
   */
  decorative?: boolean;
}

/**
 * Separator — 가로/세로 구분선.
 * 기본 `orientation="horizontal"`, 1px 두께, 토큰 `border-default` 컬러.
 */
export const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(function Separator({ className, orientation = 'horizontal', decorative = false, ...props }, ref) {
  return (
    <SeparatorPrimitive.Root
      ref={ref}
      orientation={orientation}
      decorative={decorative}
      className={cn(
        'shrink-0 bg-border-default',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
      {...props}
    />
  );
});
Separator.displayName = 'Separator';
