import * as SwitchPrimitive from '@radix-ui/react-switch';
import * as React from 'react';

import { cn } from '../../lib/cn';
import { useFieldContext } from '../field/field-context';

export type SwitchProps = React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>;

/**
 * Switch — Radix 기반 ON/OFF 토글 (boolean 입력).
 *
 * - `aria-checked`로 상태를 노출 (시맨틱은 button + role=switch)
 * - 부모 `<Field>`의 id/disabled/required를 자동 주입
 * - 키보드: Space/Enter로 토글
 * - controlled(`checked`) / uncontrolled(`defaultChecked`) 양쪽
 */
export const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitive.Root>, SwitchProps>(
  function Switch(
    { className, id: idProp, disabled: disabledProp, required: requiredProp, ...props },
    ref,
  ) {
    const ctx = useFieldContext();
    return (
      <SwitchPrimitive.Root
        ref={ref}
        id={idProp ?? ctx?.id}
        disabled={disabledProp ?? ctx?.disabled}
        required={requiredProp ?? ctx?.required}
        aria-invalid={ctx?.invalid || undefined}
        className={cn(
          'inline-flex h-6 w-10 shrink-0 cursor-pointer items-center',
          'rounded-sm border border-border-strong',
          'bg-canvas data-[state=checked]:bg-foreground',
          'transition-colors duration-base ease-standard',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          'disabled:cursor-not-allowed disabled:opacity-60',
          className,
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            'block size-4 translate-x-0.5',
            'bg-foreground data-[state=checked]:bg-foreground-inverse',
            'transition-transform duration-base ease-standard',
            'data-[state=checked]:translate-x-[18px]',
          )}
        />
      </SwitchPrimitive.Root>
    );
  },
);
Switch.displayName = 'Switch';
