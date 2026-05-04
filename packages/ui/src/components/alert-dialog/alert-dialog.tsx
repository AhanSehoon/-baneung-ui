import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import * as React from 'react';

import { cn } from '../../lib/cn';

/**
 * AlertDialog — 파괴적 액션 확인용 모달.
 *
 * - `role="alertdialog"`로 즉시 안내가 필요함을 시맨틱 표현
 * - 백드롭 클릭으로 닫히지 않고 명시적인 Cancel/Action 버튼만 닫음
 *
 * @example
 *   <AlertDialog>
 *     <AlertDialogTrigger asChild><Button variant="destructive">삭제</Button></AlertDialogTrigger>
 *     <AlertDialogContent>
 *       <AlertDialogHeader>
 *         <AlertDialogTitle>정말 삭제할까요?</AlertDialogTitle>
 *         <AlertDialogDescription>되돌릴 수 없습니다.</AlertDialogDescription>
 *       </AlertDialogHeader>
 *       <AlertDialogFooter>
 *         <AlertDialogCancel asChild><Button variant="ghost">취소</Button></AlertDialogCancel>
 *         <AlertDialogAction asChild><Button variant="destructive">삭제</Button></AlertDialogAction>
 *       </AlertDialogFooter>
 *     </AlertDialogContent>
 *   </AlertDialog>
 */
export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
export const AlertDialogPortal = AlertDialogPrimitive.Portal;
export const AlertDialogAction = AlertDialogPrimitive.Action;
export const AlertDialogCancel = AlertDialogPrimitive.Cancel;

export const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(function AlertDialogOverlay({ className, ...props }, ref) {
  return (
    <AlertDialogPrimitive.Overlay
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
AlertDialogOverlay.displayName = 'AlertDialogOverlay';

export const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(function AlertDialogContent({ className, children, ...props }, ref) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
          'w-full max-w-lg p-6 outline-none',
          'bg-canvas text-foreground border border-border-default rounded-none shadow-md',
          'transition-opacity duration-base ease-standard',
          'data-[state=open]:opacity-100 data-[state=closed]:opacity-0',
          className,
        )}
        {...props}
      >
        {children}
      </AlertDialogPrimitive.Content>
    </AlertDialogPortal>
  );
});
AlertDialogContent.displayName = 'AlertDialogContent';

export const AlertDialogHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function AlertDialogHeader({ className, ...props }, ref) {
  return <div ref={ref} className={cn('flex flex-col gap-1.5', className)} {...props} />;
});
AlertDialogHeader.displayName = 'AlertDialogHeader';

export const AlertDialogFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function AlertDialogFooter({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn('flex items-center justify-end gap-2 pt-4', className)}
      {...props}
    />
  );
});
AlertDialogFooter.displayName = 'AlertDialogFooter';

export const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(function AlertDialogTitle({ className, ...props }, ref) {
  return (
    <AlertDialogPrimitive.Title
      ref={ref}
      className={cn('text-lg font-semibold tracking-tight text-foreground', className)}
      {...props}
    />
  );
});
AlertDialogTitle.displayName = 'AlertDialogTitle';

export const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(function AlertDialogDescription({ className, ...props }, ref) {
  return (
    <AlertDialogPrimitive.Description
      ref={ref}
      className={cn('text-sm text-foreground-muted', className)}
      {...props}
    />
  );
});
AlertDialogDescription.displayName = 'AlertDialogDescription';
