import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../lib/cn';
import { useFieldContext } from '../field/field-context';

const nativeSelectVariants = cva(
  [
    'flex w-full bg-canvas text-foreground',
    'border border-border-default rounded-none',
    'transition-colors duration-base ease-standard',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
    'disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-surface',
    'aria-[invalid=true]:border-danger',
  ],
  {
    variants: {
      size: {
        sm: 'h-8 px-2 text-xs',
        md: 'h-10 px-3 text-sm',
        lg: 'h-12 px-4 text-base',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

export interface NativeSelectProps
  extends
    Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    VariantProps<typeof nativeSelectVariants> {}

/**
 * NativeSelect — 브라우저 기본 `<select>` 래퍼.
 *
 * - 가장 호환성 높은 단일 선택 컨트롤 (모바일 우선, 저사양 폴백)
 * - Field context 자동 픽업 (id / aria-* / disabled / required)
 * - 옵션은 `<option>` 자식으로 자유 구성
 *
 * 검색·다중 선택이 필요하면 [`Select`]를 사용하세요.
 */
export const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
  function NativeSelect(
    {
      className,
      size,
      id: idProp,
      'aria-invalid': ariaInvalidProp,
      'aria-describedby': describedByProp,
      'aria-required': requiredProp,
      disabled: disabledProp,
      ...props
    },
    ref,
  ) {
    const ctx = useFieldContext();
    const id = idProp ?? ctx?.id;
    const invalid = ariaInvalidProp ?? ctx?.invalid;
    const describedBy =
      describedByProp ??
      (ctx
        ? [ctx.descriptionId, invalid ? ctx.errorId : undefined].filter(Boolean).join(' ') ||
          undefined
        : undefined);
    const required = requiredProp ?? ctx?.required;
    const disabled = disabledProp ?? ctx?.disabled;

    return (
      <select
        ref={ref}
        id={id}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        aria-required={required || undefined}
        disabled={disabled}
        className={cn(nativeSelectVariants({ size }), className)}
        {...props}
      />
    );
  },
);
NativeSelect.displayName = 'NativeSelect';
