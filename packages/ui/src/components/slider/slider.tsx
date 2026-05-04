import * as SliderPrimitive from '@radix-ui/react-slider';
import * as React from 'react';

import { cn } from '../../lib/cn';

export interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  /**
   * 각 thumb의 스크린리더 라벨. 미지정 시 `aria-label`을 전 thumb에 동일 적용.
   * 범위(2개 thumb)면 `['최소', '최대']` 처럼 명시 권장.
   */
  thumbLabels?: string[];
}

/**
 * Slider — Radix 기반 단일/범위 값 슬라이더.
 *
 * - 단일: `value={[5]}` / `defaultValue={[5]}` — `aria-label` 한 개로 충분
 * - 범위: `value={[2, 8]}` — `thumbLabels={['최소', '최대']}` 권장
 * - 키보드: ←/→ (1 step), Page Up/Down (10 step), Home/End
 * - 모바일: 터치 영역은 thumb 주변 padding-box로 44×44px 보장
 */
export const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
  function Slider(
    {
      className,
      thumbLabels,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      ...props
    },
    ref,
  ) {
    const length = (props.value ?? props.defaultValue ?? [0]).length;
    return (
      <SliderPrimitive.Root
        ref={ref}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        className={cn(
          'relative flex w-full touch-none select-none items-center',
          'data-[orientation=vertical]:h-full data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
          className,
        )}
        {...props}
      >
        <SliderPrimitive.Track
          className={cn(
            'relative grow overflow-hidden bg-border-default',
            'h-1.5 rounded-sm',
            'data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5',
          )}
        >
          <SliderPrimitive.Range
            className={cn('absolute bg-foreground', 'h-full data-[orientation=vertical]:w-full')}
          />
        </SliderPrimitive.Track>
        {Array.from({ length }).map((_, i) => (
          <SliderPrimitive.Thumb
            key={i}
            aria-label={thumbLabels?.[i] ?? ariaLabel}
            aria-labelledby={thumbLabels?.[i] ? undefined : ariaLabelledby}
            className={cn(
              'block size-5 shrink-0 cursor-grab active:cursor-grabbing',
              'rounded-sm border-2 border-foreground bg-canvas',
              'shadow-sm',
              'transition-colors duration-base ease-standard',
              'hover:bg-surface',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
              'disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-60',
            )}
          />
        ))}
      </SliderPrimitive.Root>
    );
  },
);
Slider.displayName = 'Slider';
