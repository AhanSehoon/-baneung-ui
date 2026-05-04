import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import * as React from 'react';

import { cn } from '../../lib/cn';
import { useFieldContext } from '../field/field-context';

export interface RadioGroupProps extends React.ComponentPropsWithoutRef<
  typeof RadioGroupPrimitive.Root
> {
  /**
   * 항목 정렬 방향. 기본 'vertical'.
   * 'horizontal'이면 좌우로 배치 (한 줄에 모이며 wrap 허용).
   *
   * 키보드 ↑↓←→ 이동은 Radix가 양 방향 모두 자동 처리하므로
   * orientation은 시각 정렬에만 영향을 줍니다.
   */
  orientation?: 'horizontal' | 'vertical';
}

/**
 * RadioGroup — Radix 기반 단일 선택 그룹.
 *
 * - 부모 `<Field>`의 id/disabled/required를 Root에 자동 주입
 * - 키보드: 화살표 ↑↓←→ 로 항목 간 이동(Radix가 처리)
 * - controlled(`value`) / uncontrolled(`defaultValue`) 양쪽
 * - orientation: 'vertical' (기본) | 'horizontal'
 */
export const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(function RadioGroup({ className, orientation = 'vertical', ...props }, ref) {
  const ctx = useFieldContext();
  return (
    <RadioGroupPrimitive.Root
      ref={ref}
      disabled={props.disabled ?? ctx?.disabled}
      required={props.required ?? ctx?.required}
      aria-invalid={ctx?.invalid || undefined}
      data-orientation={orientation}
      className={cn(
        'flex gap-2',
        orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap items-center gap-x-4',
        className,
      )}
      {...props}
    />
  );
});
RadioGroup.displayName = 'RadioGroup';

/**
 * RadioGroupItem — 개별 라디오 항목.
 */
export const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(function RadioGroupItem({ className, ...props }, ref) {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'inline-flex size-5 shrink-0 items-center justify-center',
        // 라디오 — 각진 디자인 강제이지만 원형은 디자인 시스템에서 예외 허용 (시각 식별성)
        // PROJECT_PLAN 7.4 — radius 토큰은 0/2/4지만 radio는 시각상 원형이 보편적
        // 본 컴포넌트는 sm 라디우스(2px)로 미세 라운드만 적용해 각진 톤을 유지
        'rounded-sm border border-border-strong bg-canvas',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        'disabled:cursor-not-allowed disabled:opacity-60',
        'transition-colors duration-base ease-standard',
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <span className="block size-2 bg-foreground" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = 'RadioGroupItem';
