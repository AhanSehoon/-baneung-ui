import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';

import { cn } from '../../lib/cn';

/**
 * Tooltip — 짧은 안내 툴팁.
 *
 * - 호버/포커스 시 표시, Esc로 닫힘
 * - **모바일 폴백**: Radix Tooltip은 기본적으로 터치에서 동작하지 않습니다.
 *   터치 디바이스에서 정보를 전달해야 한다면 Popover로 대체하세요.
 * - `delayDuration`: 호버 후 표시까지 지연 (기본 700ms — Radix 기본)
 *
 * @example
 *   <TooltipProvider>
 *     <Tooltip>
 *       <TooltipTrigger asChild>
 *         <Button>Help</Button>
 *       </TooltipTrigger>
 *       <TooltipContent>도움말</TooltipContent>
 *     </Tooltip>
 *   </TooltipProvider>
 */
export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(function TooltipContent({ className, sideOffset = 4, ...props }, ref) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          'z-50 px-2 py-1 text-xs',
          'bg-inverse text-foreground-inverse rounded-none shadow-sm',
          'transition-opacity duration-fast ease-standard',
          'data-[state=delayed-open]:opacity-100 data-[state=closed]:opacity-0',
          className,
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
});
TooltipContent.displayName = 'TooltipContent';
