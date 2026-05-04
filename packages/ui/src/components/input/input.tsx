import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../lib/cn';
import { useFieldContext } from '../field/field-context';

const inputBase = cva(
  [
    'flex w-full min-w-0 bg-canvas text-foreground',
    'border border-border-default rounded-none',
    'placeholder:text-foreground-subtle',
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

export interface InputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputBase> {
  /** 입력란 좌측 슬롯(아이콘, 단위 라벨 등). */
  leftAdornment?: React.ReactNode;
  /** 입력란 우측 슬롯. */
  rightAdornment?: React.ReactNode;
  /** Adornment 컨테이너에 추가 클래스. */
  wrapperClassName?: string;
}

/**
 * Input — 단일 라인 텍스트 입력.
 *
 * - 부모 `<Field>`가 있으면 id, aria-invalid, aria-describedby, aria-required, disabled를 자동 주입
 * - left/right adornment는 absolute 포지셔닝으로 입력 영역을 침범하지 않게 padding 자동 조정
 * - 한글 IME: composition 이벤트는 native 그대로 통과 (조합 중 Enter 처리는 useComposition 훅 권장)
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    className,
    wrapperClassName,
    size,
    type = 'text',
    leftAdornment,
    rightAdornment,
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

  // adornment 사이즈별 padding/wrapper 너비. 좌측 아이콘이 placeholder를 가리지 않도록
  // 고정 폭 박스(40px=md, 32px=sm, 48px=lg)에 아이콘을 가운데 정렬하고 input은 같은 폭만큼 padding.
  const adornmentBoxClass = size === 'sm' ? 'w-8' : size === 'lg' ? 'w-12' : 'w-10';
  const inputLeftPad = leftAdornment
    ? size === 'sm'
      ? 'pl-8'
      : size === 'lg'
        ? 'pl-12'
        : 'pl-10'
    : undefined;
  const inputRightPad = rightAdornment
    ? size === 'sm'
      ? 'pr-8'
      : size === 'lg'
        ? 'pr-12'
        : 'pr-10'
    : undefined;

  const inputElement = (
    <input
      ref={ref}
      id={id}
      type={type}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      aria-required={required || undefined}
      disabled={disabled}
      className={cn(inputBase({ size }), inputLeftPad, inputRightPad, className)}
      {...props}
    />
  );

  if (!leftAdornment && !rightAdornment) {
    return inputElement;
  }

  return (
    <div className={cn('relative inline-flex w-full', wrapperClassName)}>
      {leftAdornment ? (
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center text-foreground-muted',
            adornmentBoxClass,
          )}
        >
          {leftAdornment}
        </span>
      ) : null}
      {inputElement}
      {rightAdornment ? (
        <span
          className={cn(
            'absolute inset-y-0 right-0 flex items-center justify-center text-foreground-muted',
            adornmentBoxClass,
          )}
        >
          {rightAdornment}
        </span>
      ) : null}
    </div>
  );
});
Input.displayName = 'Input';
