import * as React from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';

import { cn } from '../../lib/cn';

/**
 * Drawer — vaul 기반 모바일 친화 시트.
 *
 * - 드래그로 닫기, snap point 지원
 * - 키보드: Esc 닫기, Tab 포커스 트랩 (vaul이 처리)
 * - Sheet와 유사하나 모바일 UX(스와이프, 관성 스크롤)에 최적화
 *
 * @example
 *   <Drawer>
 *     <DrawerTrigger asChild><Button>열기</Button></DrawerTrigger>
 *     <DrawerContent>
 *       <DrawerHeader>
 *         <DrawerTitle>제목</DrawerTitle>
 *       </DrawerHeader>
 *       <p>본문</p>
 *     </DrawerContent>
 *   </Drawer>
 */
export const Drawer = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>): React.ReactElement => (
  <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />
);
Drawer.displayName = 'Drawer';

export const DrawerTrigger = DrawerPrimitive.Trigger;
export const DrawerPortal = DrawerPrimitive.Portal;
export const DrawerClose = DrawerPrimitive.Close;

export const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(function DrawerOverlay({ className, ...props }, ref) {
  return (
    <DrawerPrimitive.Overlay
      ref={ref}
      className={cn('fixed inset-0 z-40 bg-overlay', className)}
      {...props}
    />
  );
});
DrawerOverlay.displayName = 'DrawerOverlay';

export const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(function DrawerContent({ className, children, ...props }, ref) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        ref={ref}
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col',
          'bg-canvas text-foreground border-t border-border-default',
          'rounded-none outline-none',
          className,
        )}
        {...props}
      >
        {/* 드래그 그립 인디케이터 */}
        <div aria-hidden="true" className="mx-auto mt-2 h-1 w-12 bg-border-strong/40" />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
});
DrawerContent.displayName = 'DrawerContent';

export const DrawerHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function DrawerHeader({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn('grid gap-1.5 p-4 text-center sm:text-left', className)}
        {...props}
      />
    );
  },
);
DrawerHeader.displayName = 'DrawerHeader';

export const DrawerFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function DrawerFooter({ className, ...props }, ref) {
    return (
      <div ref={ref} className={cn('mt-auto flex flex-col gap-2 p-4', className)} {...props} />
    );
  },
);
DrawerFooter.displayName = 'DrawerFooter';

export const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(function DrawerTitle({ className, ...props }, ref) {
  return (
    <DrawerPrimitive.Title
      ref={ref}
      className={cn('text-lg font-semibold tracking-tight text-foreground', className)}
      {...props}
    />
  );
});
DrawerTitle.displayName = 'DrawerTitle';

export const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(function DrawerDescription({ className, ...props }, ref) {
  return (
    <DrawerPrimitive.Description
      ref={ref}
      className={cn('text-sm text-foreground-muted', className)}
      {...props}
    />
  );
});
DrawerDescription.displayName = 'DrawerDescription';
