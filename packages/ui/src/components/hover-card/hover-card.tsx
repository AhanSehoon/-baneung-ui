import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import * as React from 'react';

import { cn } from '../../lib/cn';

/**
 * HoverCard — 호버로 열리는 정보 카드 (프로필 미리보기 등).
 *
 * - `openDelay`/`closeDelay`로 호버 진입/이탈 지연 제어
 * - 모바일(touch only)에선 기본적으로 동작 안 함 — 터치 환경 사용자에게 같은 정보를 노출하려면
 *   Popover 폴백을 별도로 마련해야 합니다.
 */
export const HoverCard = HoverCardPrimitive.Root;
export const HoverCardTrigger = HoverCardPrimitive.Trigger;

export const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(function HoverCardContent({ className, align = 'center', sideOffset = 4, ...props }, ref) {
  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'z-50 w-64 p-4 outline-none',
          'bg-canvas text-foreground border border-border-default rounded-none shadow-md',
          'transition-opacity duration-base ease-standard',
          'data-[state=open]:opacity-100 data-[state=closed]:opacity-0',
          className,
        )}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  );
});
HoverCardContent.displayName = 'HoverCardContent';
