import { useReducedMotion } from '../../lib/use-reduced-motion';

import type * as React from 'react';

/**
 * 추가 Loader 변형 — `Dots` / `Bars` / `Ring`.
 *
 * (`Spinner`는 별도 컴포넌트로 `@baneung-pack/ui`에 이미 존재 — 중복 방지.)
 *
 * 공통 props:
 * - `size`: 'sm' | 'md' | 'lg' | number(px)
 * - `color`: CSS color (기본 currentColor)
 * - `label`: 스크린리더 라벨 (기본 '로딩 중')
 * - `duration`: 한 cycle 시간 (ms)
 *
 * 모두 `role="status"` + 시각적으로 숨긴 라벨. `prefers-reduced-motion` 시 정적 표시.
 */
export type LoaderSize = 'sm' | 'md' | 'lg' | number;

export interface LoaderProps {
  size?: LoaderSize;
  color?: string;
  label?: string;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

const SIZE_MAP: Record<Exclude<LoaderSize, number>, number> = { sm: 16, md: 24, lg: 36 };
function resolveSize(s: LoaderSize): number {
  return typeof s === 'number' ? s : SIZE_MAP[s];
}

function SrOnly({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        position: 'absolute',
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: 'hidden',
        clip: 'rect(0,0,0,0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
    >
      {children}
    </span>
  );
}

/** Dots — 세 개 점이 차례로 부풀어 오름. */
export function Dots({
  size = 'md',
  color = 'currentColor',
  label = '로딩 중',
  duration = 1200,
  className,
  style,
}: LoaderProps) {
  const reduced = useReducedMotion();
  const px = resolveSize(size);
  const dot = Math.max(3, Math.round(px * 0.3));
  const gap = Math.round(dot * 0.6);
  return (
    <span
      role="status"
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap,
        height: px,
        position: 'relative',
        ...style,
      }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{
            display: 'inline-block',
            width: dot,
            height: dot,
            borderRadius: '50%',
            background: color,
            animation: reduced
              ? undefined
              : `baneung-loader-bounce ${duration}ms ease-in-out ${i * (duration / 6)}ms infinite`,
          }}
        />
      ))}
      <SrOnly>{label}</SrOnly>
      <LoaderKeyframes />
    </span>
  );
}

/** Bars — 4개 세로 막대가 차례로 늘었다 줄어듦. */
export function Bars({
  size = 'md',
  color = 'currentColor',
  label = '로딩 중',
  duration = 1000,
  className,
  style,
}: LoaderProps) {
  const reduced = useReducedMotion();
  const px = resolveSize(size);
  const bar = Math.max(2, Math.round(px * 0.16));
  const gap = Math.round(bar * 0.8);
  return (
    <span
      role="status"
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap,
        height: px,
        position: 'relative',
        ...style,
      }}
    >
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{
            display: 'inline-block',
            width: bar,
            height: '100%',
            background: color,
            transformOrigin: 'center',
            animation: reduced
              ? undefined
              : `baneung-loader-bars ${duration}ms ease-in-out ${i * (duration / 10)}ms infinite`,
          }}
        />
      ))}
      <SrOnly>{label}</SrOnly>
      <LoaderKeyframes />
    </span>
  );
}

/** Ring — 두꺼운 원형 링이 회전. 페이지 로딩용. */
export function Ring({
  size = 'md',
  color = 'currentColor',
  label = '로딩 중',
  duration = 1000,
  className,
  style,
}: LoaderProps) {
  const reduced = useReducedMotion();
  const px = resolveSize(size);
  const border = Math.max(2, Math.round(px * 0.12));
  return (
    <span
      role="status"
      className={className}
      style={{ display: 'inline-flex', position: 'relative', ...style }}
    >
      <span
        aria-hidden="true"
        style={{
          display: 'inline-block',
          width: px,
          height: px,
          borderRadius: '50%',
          border: `${border}px solid ${color}33`,
          borderTopColor: color,
          animation: reduced ? undefined : `baneung-loader-spin ${duration}ms linear infinite`,
          boxSizing: 'border-box',
        }}
      />
      <SrOnly>{label}</SrOnly>
      <LoaderKeyframes />
    </span>
  );
}

function LoaderKeyframes() {
  return (
    <style>{`
      @keyframes baneung-loader-spin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }
      @keyframes baneung-loader-bounce {
        0%, 80%, 100% { transform: scale(0.4); opacity: 0.5; }
        40%           { transform: scale(1);   opacity: 1; }
      }
      @keyframes baneung-loader-bars {
        0%, 100% { transform: scaleY(0.3); }
        50%      { transform: scaleY(1); }
      }
    `}</style>
  );
}
