import * as React from 'react';

import { useInView } from '../../lib/use-in-view';
import { useReducedMotion } from '../../lib/use-reduced-motion';

import type { CountUpProps } from './types';

/**
 * CountUp — 숫자 카운터 애니메이션.
 *
 * # 구현
 * - requestAnimationFrame 기반 — setInterval보다 부드럽고 탭 비활성 시 자동 정지.
 * - easeOutCubic: 시작은 빠르게, 끝은 부드럽게 감속.
 * - 부호 처리: from > to면 자동으로 감소 카운트.
 *
 * # 트리거
 * - 'mount' (기본): 마운트 즉시 시작.
 * - 'inView': 화면에 들어올 때 1회 발사 (통계 섹션 패턴).
 *
 * # a11y
 * - `prefers-reduced-motion: reduce`면 즉시 to 값 표시.
 * - 폰트는 tabular-nums로 — 숫자 자리수 변화 시 깜빡임/리플로우 최소화.
 *
 * @example
 *   <CountUp to={1234567} separator="," />
 *   <CountUp from={0} to={99.9} decimals={1} suffix="%" />
 *   <CountUp to={500} prefix="$" trigger="inView" />
 */
export function CountUp({
  from = 0,
  to,
  duration = 1500,
  separator = ',',
  decimals = 0,
  decimalSeparator = '.',
  prefix = '',
  suffix = '',
  trigger = 'mount',
  threshold = 0.3,
  fontSize,
  fontWeight,
  color,
  className,
  style,
}: CountUpProps) {
  const reduced = useReducedMotion();
  const containerRef = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(containerRef, trigger === 'inView', threshold);
  const [value, setValue] = React.useState(from);

  React.useEffect(() => {
    if (!inView) {
      // 아직 발사 안 됨 — from 값 유지.
      setValue(from);
      return;
    }
    if (reduced) {
      setValue(to);
      return;
    }

    let cancelled = false;
    let rafId = 0;
    const startTime = performance.now();
    const delta = to - from;

    const tick = (now: number) => {
      if (cancelled) return;
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / Math.max(1, duration));
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(from + delta * eased);
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        // 마지막 프레임은 정확한 to로 마무리.
        setValue(to);
      }
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, [inView, reduced, from, to, duration]);

  // 포맷팅 — 소수점 자리수 + 천 단위 구분자.
  const formatted = React.useMemo(
    () => formatNumber(value, { decimals, separator, decimalSeparator }),
    [value, decimals, separator, decimalSeparator],
  );

  const containerStyle: React.CSSProperties = {
    fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
    fontWeight,
    color,
    // 자리수 변화 시 점프 방지.
    fontVariantNumeric: 'tabular-nums',
    ...style,
  };

  return (
    <span
      ref={containerRef}
      className={className}
      style={containerStyle}
      // 변화 중인 숫자는 스크린리더에 너무 시끄러움 — 최종 값 도달 시점에만 안내.
      aria-live="polite"
      aria-atomic="true"
    >
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

/** 숫자 → 천 단위 구분자 + 소수점 처리. */
function formatNumber(
  n: number,
  opts: { decimals: number; separator: string; decimalSeparator: string },
): string {
  const { decimals, separator, decimalSeparator } = opts;
  // 음수 부호 분리.
  const sign = n < 0 ? '-' : '';
  const abs = Math.abs(n);
  // 소수점 자리수 고정.
  const fixed = abs.toFixed(decimals);
  const [intPart = '0', decPart = ''] = fixed.split('.');
  // 천 단위 구분자 — separator 빈 문자열이면 스킵.
  const withSep = separator ? intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator) : intPart;
  return decPart ? `${sign}${withSep}${decimalSeparator}${decPart}` : `${sign}${withSep}`;
}
