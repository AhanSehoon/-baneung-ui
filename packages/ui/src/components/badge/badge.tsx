import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../lib/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium leading-none',
  {
    variants: {
      variant: {
        default: 'bg-foreground text-foreground-inverse',
        secondary: 'bg-surface-strong text-foreground',
        outline: 'border border-border-default text-foreground',
        success: 'bg-success/15 text-success',
        warning: 'bg-warning/15 text-warning',
        danger: 'bg-danger/15 text-danger',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

/**
 * Badge — 상태/카테고리/카운트를 표현하는 작은 라벨.
 *
 * 시맨틱이 필요한 상태(success/warning/danger)는 텍스트로도 정보를 전달해야 합니다
 * (색만으로 의미 전달 금지 — WCAG 1.4.1).
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant, className, ...props },
  ref,
) {
  return <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />;
});
Badge.displayName = 'Badge';
