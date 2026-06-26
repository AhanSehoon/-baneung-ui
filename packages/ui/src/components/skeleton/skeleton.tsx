import * as React from 'react';

import { cn } from '../../lib/cn';

export type SkeletonVariant = 'shimmer' | 'pulse';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 애니메이션 종류. 기본 'pulse' (기존 동작 호환). */
  variant?: SkeletonVariant;
}

/**
 * Skeleton — 로딩 플레이스홀더.
 *
 * - `variant='pulse'` (기본): 토큰 `surface-strong` 색에 미세한 펄스 (기존 동작)
 * - `variant='shimmer'`: 빛이 좌→우로 흐르는 그라데이션 (Effect 패키지에서 이전)
 * - `prefers-reduced-motion: reduce` 시 globals.css의 reset이 즉시화
 * - 자체 role/aria 없음 → 부모가 `aria-busy` 또는 `aria-live`를 지정
 *
 * 조합용 헬퍼: `SkeletonText` (여러 줄) · `SkeletonCircle` (아바타).
 */
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { className, variant = 'pulse', style, ...props },
  ref,
) {
  if (variant === 'shimmer') {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn('rounded-sm', className)}
        style={{
          background:
            'linear-gradient(90deg, var(--color-bg-surface-strong, #E9ECEF) 0%, var(--color-bg-surface, #F8F9FA) 50%, var(--color-bg-surface-strong, #E9ECEF) 100%)',
          backgroundSize: '200% 100%',
          animation: 'baneung-skeleton-shimmer 1.4s linear infinite',
          ...style,
        }}
        {...props}
      >
        <style>{`
          @keyframes baneung-skeleton-shimmer {
            0%   { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
          @media (prefers-reduced-motion: reduce) {
            [data-skeleton-shimmer] { animation: none; }
          }
        `}</style>
      </div>
    );
  }
  // 기본 pulse — 기존 UI Skeleton 동작 그대로.
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn('animate-pulse bg-surface-strong rounded-sm', className)}
      style={style}
      {...props}
    />
  );
});
Skeleton.displayName = 'Skeleton';

export interface SkeletonTextProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 줄 개수. 기본 3. */
  lines?: number;
  /** 줄당 높이 (px). 기본 14. */
  lineHeight?: number;
  /** 줄 사이 간격 (px). 기본 8. */
  gap?: number;
  /** 마지막 줄 폭 비율 (0~1). 기본 0.6. */
  lastLineWidthRatio?: number;
  variant?: SkeletonVariant;
}

/**
 * SkeletonText — 여러 줄 텍스트 placeholder. 마지막 줄은 자연스럽게 짧게.
 */
export const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonTextProps>(
  function SkeletonText(
    {
      lines = 3,
      lineHeight = 14,
      gap = 8,
      lastLineWidthRatio = 0.6,
      variant,
      className,
      style,
      ...props
    },
    ref,
  ) {
    const safeLines = Math.max(1, lines);
    return (
      <div
        ref={ref}
        aria-busy="true"
        aria-hidden="true"
        className={className}
        style={{ display: 'flex', flexDirection: 'column', gap, ...style }}
        {...props}
      >
        {Array.from({ length: safeLines }).map((_, i) => {
          const isLast = i === safeLines - 1 && safeLines > 1;
          return (
            <Skeleton
              key={i}
              variant={variant}
              style={{
                width: isLast ? `${Math.round(lastLineWidthRatio * 100)}%` : '100%',
                height: `${lineHeight}px`,
              }}
            />
          );
        })}
      </div>
    );
  },
);
SkeletonText.displayName = 'SkeletonText';

export interface SkeletonCircleProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 지름 (px). 기본 40. */
  size?: number;
  variant?: SkeletonVariant;
}

/**
 * SkeletonCircle — 원형 (아바타 placeholder).
 */
export const SkeletonCircle = React.forwardRef<HTMLDivElement, SkeletonCircleProps>(
  function SkeletonCircle({ size = 40, variant, className, style, ...props }, ref) {
    return (
      <Skeleton
        ref={ref}
        variant={variant}
        className={className}
        style={{ width: size, height: size, borderRadius: '50%', ...style }}
        {...props}
      />
    );
  },
);
SkeletonCircle.displayName = 'SkeletonCircle';
