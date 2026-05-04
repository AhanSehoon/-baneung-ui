import * as React from 'react';

import { cn } from '../../lib/cn';

/**
 * Empty — 빈 상태 컨테이너.
 *
 * 합성 패턴(EmptyIcon, EmptyTitle, EmptyDescription, EmptyActions)으로 사용.
 *
 * @example
 *   <Empty>
 *     <EmptyIcon><InboxIcon /></EmptyIcon>
 *     <EmptyTitle>아직 항목이 없습니다</EmptyTitle>
 *     <EmptyDescription>새 항목을 추가해보세요.</EmptyDescription>
 *     <EmptyActions><Button>추가</Button></EmptyActions>
 *   </Empty>
 */
export const Empty = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function Empty({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center gap-3 p-12 text-center',
          className,
        )}
        {...props}
      />
    );
  },
);
Empty.displayName = 'Empty';

export const EmptyIcon = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function EmptyIcon({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn('flex size-12 items-center justify-center text-foreground-subtle', className)}
        {...props}
      />
    );
  },
);
EmptyIcon.displayName = 'EmptyIcon';

export const EmptyTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(function EmptyTitle({ className, children, ...props }, ref) {
  return (
    <h3
      ref={ref}
      className={cn('text-lg font-semibold tracking-tight text-foreground', className)}
      {...props}
    >
      {children}
    </h3>
  );
});
EmptyTitle.displayName = 'EmptyTitle';

export const EmptyDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(function EmptyDescription({ className, ...props }, ref) {
  return (
    <p ref={ref} className={cn('max-w-sm text-sm text-foreground-muted', className)} {...props} />
  );
});
EmptyDescription.displayName = 'EmptyDescription';

export const EmptyActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function EmptyActions({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn('mt-2 flex items-center justify-center gap-2', className)}
        {...props}
      />
    );
  },
);
EmptyActions.displayName = 'EmptyActions';
