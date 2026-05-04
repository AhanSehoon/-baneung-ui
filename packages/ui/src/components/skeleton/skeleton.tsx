import * as React from 'react';

import { cn } from '../../lib/cn';

/**
 * Skeleton — 로딩 플레이스홀더.
 *
 * - 토큰 `surface-strong` 색에 미세한 펄스 애니메이션
 * - `prefers-reduced-motion: reduce` 시 globals.css의 reset이 즉시화
 * - 자체 role/aria 없음 → 부모가 `aria-busy` 또는 `aria-live`를 지정해야 함
 */
export const Skeleton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function Skeleton({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn('animate-pulse bg-surface-strong rounded-sm', className)}
        {...props}
      />
    );
  },
);
Skeleton.displayName = 'Skeleton';
