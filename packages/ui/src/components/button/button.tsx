import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../lib/cn';
import { Spinner } from '../spinner';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 select-none whitespace-nowrap',
    'cursor-pointer',
    'rounded-none font-medium leading-none',
    'transition-colors duration-base ease-standard',
    'disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-foreground text-foreground-inverse hover:bg-foreground/90',
        secondary: 'bg-surface-strong text-foreground hover:bg-surface-strong/80',
        outline: 'border border-border-default bg-canvas text-foreground hover:bg-surface',
        ghost: 'text-foreground hover:bg-surface',
        destructive: 'bg-danger text-foreground-inverse hover:bg-danger/90',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  /**
   * Slot으로 합성 — 하위 element가 host로 렌더됩니다(예: `<a>` / `next/link`).
   * 사용 시 leftIcon/rightIcon/loading은 무시되니 직접 children에 포함하세요.
   */
  asChild?: boolean;
  /** true면 disabled + leftIcon 자리에 Spinner 표시 + aria-busy 설정. */
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Button — 기본 인터랙션 컴포넌트.
 *
 * 키보드: 네이티브 `<button>` 시맨틱이라 Space/Enter로 클릭이 트리거됩니다.
 * 포커스: `:focus-visible`만 포커스 링을 표시(마우스 클릭 포커스는 시각적으로 드러내지 않음).
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant,
    size,
    asChild = false,
    loading = false,
    leftIcon,
    rightIcon,
    disabled,
    children,
    ...props
  },
  ref,
) {
  if (asChild) {
    return (
      <Slot
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        aria-busy={loading || undefined}
        {...props}
      >
        {children}
      </Slot>
    );
  }

  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled ?? loading}
      aria-busy={loading || undefined}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {loading ? <Spinner size={size === 'lg' ? 'md' : 'sm'} label="" /> : leftIcon}
      {children}
      {rightIcon}
    </button>
  );
});
Button.displayName = 'Button';
