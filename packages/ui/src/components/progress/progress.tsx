import * as ProgressPrimitive from '@radix-ui/react-progress';
import * as React from 'react';

import { cn } from '../../lib/cn';

export interface ProgressProps extends React.ComponentPropsWithoutRef<
  typeof ProgressPrimitive.Root
> {
  /** 진행률(0~100). `undefined`/`null`이면 indeterminate 모드. */
  value?: number | null;
  /** 시각 크기. 기본 'md'. */
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
} as const;

/**
 * Progress — 진행률 표시.
 *
 * - 결정 모드: `value` 0~100 (퍼센트)
 * - 비결정(indeterminate) 모드: `value`를 생략 또는 `null` — 무한 슬라이드 애니메이션
 * - 애니메이션은 `prefers-reduced-motion: reduce` 시 globals.css가 즉시화
 * - 시맨틱: Radix가 `role="progressbar"` + `aria-valuenow/min/max` 자동 부여
 */
export const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(function Progress({ className, value, size = 'md', ...props }, ref) {
  const isIndeterminate = value === undefined || value === null;
  const clamped = isIndeterminate ? undefined : Math.min(100, Math.max(0, value));

  return (
    <ProgressPrimitive.Root
      ref={ref}
      value={clamped}
      className={cn(
        'relative w-full overflow-hidden bg-surface-strong rounded-sm',
        sizeMap[size],
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-indeterminate={isIndeterminate || undefined}
        className={cn(
          'h-full bg-foreground',
          'transition-transform duration-base ease-standard',
          // 결정 모드: 부모 너비를 가득 채우고 translateX로 채워진 비율 노출
          // 비결정 모드: 1/3 폭으로 좌→우 무한 슬라이드 (Tailwind 임의 keyframes)
          isIndeterminate
            ? ['w-1/3', 'animate-[progress-slide_1.4s_cubic-bezier(0.2,0,0,1)_infinite]']
            : 'w-full',
        )}
        style={isIndeterminate ? undefined : { transform: `translateX(-${100 - (clamped ?? 0)}%)` }}
      />
      {/* indeterminate keyframes 정의 — Tailwind v4의 @keyframes 인라인 */}
      {isIndeterminate ? (
        <style>{`
          @keyframes progress-slide {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(300%); }
          }
        `}</style>
      ) : null}
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = 'Progress';
