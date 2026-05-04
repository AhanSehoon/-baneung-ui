import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../lib/cn';

/**
 * ToggleGroup — Toggle을 묶어 단일/다중 선택을 표현.
 *
 * - Radix ToggleGroup 기반 — `type="single" | "multiple"`로 모드 결정
 * - 키보드: 화살표 ← → / ↑ ↓ 로 항목 간 이동(Radix가 처리)
 * - controlled / uncontrolled 모두 지원
 */
export const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>
>(function ToggleGroup({ className, ...props }, ref) {
  return (
    <ToggleGroupPrimitive.Root
      ref={ref}
      className={cn(
        'inline-flex items-center',
        // 인접 보더 중복 제거 (Toggle outline variant가 border를 가질 때)
        '[&>*+*]:-ml-px',
        '[&>*]:relative',
        '[&>*:hover]:z-10 [&>*:focus-visible]:z-10',
        className,
      )}
      {...props}
    />
  );
});
ToggleGroup.displayName = 'ToggleGroup';

/**
 * ToggleGroupItem — ToggleGroup의 자식 항목.
 * Toggle과 같은 시각 variant를 받아들입니다.
 */
const itemVariants = {
  variant: {
    default: 'bg-transparent text-foreground-muted hover:bg-surface',
    outline: 'border border-border-default bg-canvas text-foreground-muted hover:bg-surface',
  },
  size: {
    sm: 'h-8 px-2 text-xs',
    md: 'h-10 px-3 text-sm',
    lg: 'h-12 px-4 text-base',
  },
} as const;

type ItemVariant = keyof typeof itemVariants.variant;
type ItemSize = keyof typeof itemVariants.size;

export interface ToggleGroupItemProps extends React.ComponentPropsWithoutRef<
  typeof ToggleGroupPrimitive.Item
> {
  variant?: ItemVariant;
  size?: ItemSize;
}

export const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  ToggleGroupItemProps
>(function ToggleGroupItem({ className, variant = 'default', size = 'md', ...props }, ref) {
  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 select-none whitespace-nowrap',
        'rounded-none font-medium leading-none',
        'transition-colors duration-base ease-standard',
        'disabled:pointer-events-none disabled:opacity-50',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        'data-[state=on]:bg-surface-strong data-[state=on]:text-foreground',
        itemVariants.variant[variant],
        itemVariants.size[size],
        className,
      )}
      {...props}
    />
  );
});
ToggleGroupItem.displayName = 'ToggleGroupItem';

export type ToggleGroupProps = React.ComponentPropsWithoutRef<typeof ToggleGroup>;
// Re-export VariantProps utility type to keep API surface consistent if consumers need it.
export type { VariantProps };
