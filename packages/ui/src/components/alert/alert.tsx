import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../lib/cn';

const alertVariants = cva(
  [
    // Title은 Description 위에 쌓이도록 flex-col 기본.
    // SVG 아이콘이 직접 자식으로 있으면 그리드 레이아웃으로 좌측에 정렬.
    'relative flex flex-col gap-1 px-4 py-3',
    'border rounded-none',
    '[&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:size-5 [&>svg]:shrink-0',
    '[&:has(>svg)]:pl-11',
  ],
  {
    variants: {
      variant: {
        info: 'bg-info/10 border-info/30 text-info',
        success: 'bg-success/10 border-success/30 text-success',
        warning: 'bg-warning/10 border-warning/30 text-warning',
        danger: 'bg-danger/10 border-danger/30 text-danger',
      },
    },
    defaultVariants: { variant: 'info' },
  },
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  /** dismiss 버튼 표시 + 클릭 콜백. 미지정이면 dismissible 아님. */
  onDismiss?: () => void;
  /** dismiss 버튼 라벨 (스크린리더용). 기본 '닫기'. */
  dismissLabel?: string;
}

/**
 * Alert — 페이지 내 비차단 안내.
 *
 * - `variant=danger`는 `role="alert"` (즉시 안내), 그 외는 `role="status"` (적절한 시점에 안내)
 * - 시맨틱: 색만으로 의미 전달 금지 — `<AlertTitle>`이나 텍스트로도 정보를 명시
 * - 차단성 확인이 필요하면 `<AlertDialog>`를 사용
 */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { className, variant = 'info', onDismiss, dismissLabel = '닫기', children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role={variant === 'danger' ? 'alert' : 'status'}
      aria-live={variant === 'danger' ? 'assertive' : 'polite'}
      className={cn(alertVariants({ variant }), onDismiss && 'pr-10', className)}
      {...props}
    >
      {children}
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={dismissLabel}
          className={cn(
            'absolute right-2 top-2 inline-flex size-7 items-center justify-center rounded-none',
            'text-current opacity-70 hover:opacity-100',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
            'transition-opacity duration-fast ease-standard',
          )}
        >
          ×
        </button>
      ) : null}
    </div>
  );
});
Alert.displayName = 'Alert';

export const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(function AlertTitle({ className, children, ...props }, ref) {
  return (
    <h5
      ref={ref}
      className={cn('mb-0.5 font-semibold leading-none tracking-tight', className)}
      {...props}
    >
      {children}
    </h5>
  );
});
AlertTitle.displayName = 'AlertTitle';

export const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(function AlertDescription({ className, ...props }, ref) {
  return <div ref={ref} className={cn('text-sm leading-relaxed', className)} {...props} />;
});
AlertDescription.displayName = 'AlertDescription';
