import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../lib/cn';

/**
 * Sheet — 화면 가장자리(상/하/좌/우)에서 슬라이드되는 패널.
 *
 * Radix Dialog 위에 side variant를 얹어 만들었습니다.
 * (Drawer는 vaul 기반의 모바일 친화 변형 — 드래그 닫기·snap point 지원.)
 *
 * @example
 *   <Sheet>
 *     <SheetTrigger asChild><Button>열기</Button></SheetTrigger>
 *     <SheetContent side="right">
 *       <SheetHeader><SheetTitle>설정</SheetTitle></SheetHeader>
 *       ...
 *     </SheetContent>
 *   </Sheet>
 */
export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;
export const SheetPortal = DialogPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(function SheetOverlay({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        'fixed inset-0 z-40 bg-overlay',
        'transition-opacity duration-base ease-standard',
        'data-[state=open]:opacity-100 data-[state=closed]:opacity-0',
        className,
      )}
      {...props}
    />
  );
});
SheetOverlay.displayName = 'SheetOverlay';

const sheetVariants = cva(
  [
    'fixed z-50 outline-none p-6',
    'bg-canvas text-foreground border-border-default shadow-md',
    'transition-transform duration-base ease-standard',
  ],
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 border-b data-[state=open]:translate-y-0 data-[state=closed]:-translate-y-full',
        bottom:
          'inset-x-0 bottom-0 border-t data-[state=open]:translate-y-0 data-[state=closed]:translate-y-full',
        left: 'inset-y-0 left-0 h-full w-3/4 max-w-sm border-r data-[state=open]:translate-x-0 data-[state=closed]:-translate-x-full',
        right:
          'inset-y-0 right-0 h-full w-3/4 max-w-sm border-l data-[state=open]:translate-x-0 data-[state=closed]:translate-x-full',
      },
    },
    defaultVariants: { side: 'right' },
  },
);

export interface SheetContentProps
  extends
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

export const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(function SheetContent({ className, side = 'right', children, ...props }, ref) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(sheetVariants({ side }), className)}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </SheetPortal>
  );
});
SheetContent.displayName = 'SheetContent';

export const SheetHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function SheetHeader({ className, ...props }, ref) {
    return <div ref={ref} className={cn('flex flex-col gap-1.5', className)} {...props} />;
  },
);
SheetHeader.displayName = 'SheetHeader';

export const SheetFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function SheetFooter({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-end gap-2 pt-4', className)}
        {...props}
      />
    );
  },
);
SheetFooter.displayName = 'SheetFooter';

export const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(function SheetTitle({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cn('text-lg font-semibold tracking-tight text-foreground', className)}
      {...props}
    />
  );
});
SheetTitle.displayName = 'SheetTitle';

export const SheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(function SheetDescription({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn('text-sm text-foreground-muted', className)}
      {...props}
    />
  );
});
SheetDescription.displayName = 'SheetDescription';
