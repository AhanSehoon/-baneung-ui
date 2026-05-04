import * as TogglePrimitive from '@radix-ui/react-toggle';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../lib/cn';

const toggleVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 select-none whitespace-nowrap',
    'rounded-none font-medium leading-none',
    'transition-colors duration-base ease-standard',
    'disabled:pointer-events-none disabled:opacity-50',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
    'data-[state=on]:bg-surface-strong data-[state=on]:text-foreground',
  ],
  {
    variants: {
      variant: {
        default: 'bg-transparent text-foreground-muted hover:bg-surface',
        outline: 'border border-border-default bg-canvas text-foreground-muted hover:bg-surface',
      },
      size: {
        sm: 'h-8 px-2 text-xs',
        md: 'h-10 px-3 text-sm',
        lg: 'h-12 px-4 text-base',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  },
);

export interface ToggleProps
  extends
    React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>,
    VariantProps<typeof toggleVariants> {}

/**
 * Toggle — 단일 on/off 버튼.
 *
 * - Radix Toggle 기반 — `aria-pressed`를 자동으로 관리
 * - controlled(`pressed`) / uncontrolled(`defaultPressed`) 모두 지원
 * - 키보드: Space/Enter로 토글
 */
export const Toggle = React.forwardRef<React.ElementRef<typeof TogglePrimitive.Root>, ToggleProps>(
  function Toggle({ className, variant, size, ...props }, ref) {
    return (
      <TogglePrimitive.Root
        ref={ref}
        className={cn(toggleVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Toggle.displayName = 'Toggle';
