import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../lib/cn';

const spinnerVariants = cva('animate-spin text-foreground-subtle', {
  variants: {
    size: {
      sm: 'size-4',
      md: 'size-5',
      lg: 'size-6',
    },
  },
  defaultVariants: { size: 'md' },
});

export interface SpinnerProps
  extends
    Omit<React.SVGAttributes<SVGSVGElement>, 'children'>,
    VariantProps<typeof spinnerVariants> {
  /** 스크린리더 라벨. 기본 '로딩 중'. 시각 노출이 필요 없으면 그대로 사용. */
  label?: string;
}

/**
 * Spinner — 로딩 인디케이터(SVG 회전).
 *
 * - `prefers-reduced-motion`은 globals.css가 처리(animation 즉시화)
 * - role="status" + sr-only 라벨로 스크린리더 접근성 보장
 */
export const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(function Spinner(
  { size, label = '로딩 중', className, ...props },
  ref,
) {
  return (
    <span role="status" className="inline-flex items-center">
      <svg
        ref={ref}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className={cn(spinnerVariants({ size }), className)}
        {...props}
      >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
        <path
          d="M21 12a9 9 0 0 0-9-9"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
});
Spinner.displayName = 'Spinner';
