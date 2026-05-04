import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as React from 'react';

import { cn } from '../../lib/cn';

/**
 * Popover — Radix Popover 기반 부유 패널.
 *
 * - 트리거 클릭/포커스로 열림, Esc/외부 클릭으로 닫힘
 * - 포커스 트랩 + 복귀 (Radix가 자동 처리)
 * - Portal 렌더, z-index는 토큰 `--z-index-popover` (Tailwind utility로는 z-50)
 */
export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverAnchor = PopoverPrimitive.Anchor;

export const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(function PopoverContent({ className, align = 'center', sideOffset = 4, ...props }, ref) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'z-50 w-72 p-4 outline-none',
          'bg-canvas text-foreground border border-border-default rounded-none shadow-md',
          // 모션 (data-state)
          'transition-opacity duration-base ease-standard',
          'data-[state=open]:opacity-100 data-[state=closed]:opacity-0',
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
});
PopoverContent.displayName = 'PopoverContent';
