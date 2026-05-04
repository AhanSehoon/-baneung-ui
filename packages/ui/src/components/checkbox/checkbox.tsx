import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as React from 'react';

import { cn } from '../../lib/cn';
import { useFieldContext } from '../field/field-context';

/**
 * 단순 체크/언체크 마커 SVG.
 */
function CheckMark(): React.ReactElement {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      className="size-3"
    >
      <path d="M3 8.5l3 3 7-7" />
    </svg>
  );
}

/**
 * indeterminate 상태 마커.
 */
function IndeterminateMark(): React.ReactElement {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="square"
      aria-hidden="true"
      className="size-3"
    >
      <path d="M3 8h10" />
    </svg>
  );
}

export type CheckboxProps = React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>;

/**
 * Checkbox — Radix 기반.
 *
 * - `checked={true | false | 'indeterminate'}` 모두 지원
 * - controlled / uncontrolled 양쪽
 * - 부모 `<Field>`의 id/required/disabled를 자동 주입
 * - 키보드: Space로 토글 (네이티브 button 시맨틱)
 */
export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(function Checkbox(
  { className, checked, id: idProp, disabled: disabledProp, required: requiredProp, ...props },
  ref,
) {
  const ctx = useFieldContext();
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      id={idProp ?? ctx?.id}
      checked={checked}
      disabled={disabledProp ?? ctx?.disabled}
      required={requiredProp ?? ctx?.required}
      aria-invalid={ctx?.invalid || undefined}
      className={cn(
        'inline-flex size-5 shrink-0 items-center justify-center rounded-none',
        'border border-border-strong bg-canvas text-foreground-inverse',
        'data-[state=checked]:bg-foreground data-[state=checked]:border-foreground',
        'data-[state=indeterminate]:bg-foreground data-[state=indeterminate]:border-foreground',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        'disabled:cursor-not-allowed disabled:opacity-60',
        'transition-colors duration-base ease-standard',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center">
        {checked === 'indeterminate' ? <IndeterminateMark /> : <CheckMark />}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
Checkbox.displayName = 'Checkbox';
