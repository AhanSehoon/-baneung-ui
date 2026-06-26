import * as React from 'react';

import { useReducedMotion } from '../../lib/use-reduced-motion';

import type { VariableFontHoverProps } from './types';

/**
 * VariableFontHover — 커서 주변 글자만 굵어지는 효과 (가변 폰트 친화).
 *
 * # 동작
 * - 컨테이너 onPointerMove로 커서 좌표 추적.
 * - 각 글자의 화면상 중심점과 커서 사이 거리 계산 → radius 안이면 굵기 보간.
 * - DOM 측정은 useLayoutEffect/ResizeObserver로 캐싱 (mousemove마다 measure하면 비쌈).
 * - 글자별 font-weight를 rAF로 throttle한 인라인 style로 직접 set → React 재렌더 없음.
 *
 * # a11y / fallback
 * - `prefers-reduced-motion: reduce` 시 모든 글자 minWeight로 고정 (인터랙션 비활성).
 * - 터치 디바이스에선 hover 자체가 없으니 인터랙션 없음 (안전).
 */
export function VariableFontHover({
  text,
  minWeight = 300,
  maxWeight = 900,
  radius = 80,
  transitionMs = 220,
  fontSize,
  color,
  fontFamily,
  className,
  style,
}: VariableFontHoverProps) {
  const reduced = useReducedMotion();
  const chars = React.useMemo(() => Array.from(text), [text]);

  const containerRef = React.useRef<HTMLSpanElement>(null);
  // 각 글자 span ref를 인덱스로 관리 — measure 시 사용.
  const charRefs = React.useRef<(HTMLSpanElement | null)[]>([]);
  // 각 글자 중심 좌표 캐시 (컨테이너 기준 px). resize/scroll 시 갱신.
  const centersRef = React.useRef<{ x: number; y: number }[]>([]);
  const rafIdRef = React.useRef<number | null>(null);

  const measure = React.useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    centersRef.current = charRefs.current.map((el) => {
      if (!el) return { x: 0, y: 0 };
      const r = el.getBoundingClientRect();
      return {
        x: r.left - containerRect.left + r.width / 2,
        y: r.top - containerRect.top + r.height / 2,
      };
    });
  }, []);

  // 마운트 + 폰트/크기 변경 시 한 번 측정.
  React.useLayoutEffect(() => {
    measure();
    // 폰트 비동기 로드 케이스 — document.fonts.ready 후 한 번 더.
    if (typeof document !== 'undefined' && 'fonts' in document) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fontsReady = (document as any).fonts?.ready as Promise<void> | undefined;
      if (fontsReady)
        fontsReady.then(measure).catch(() => {
          // 폰트 로드 실패 시 무시 — 이미 측정된 첫 값으로 동작.
        });
    }
  }, [text, fontSize, fontFamily, measure]);

  // resize 시 재측정.
  React.useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return;
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => ro.disconnect();
  }, [measure]);

  const handlePointerMove = React.useCallback(
    (e: React.PointerEvent<HTMLSpanElement>) => {
      if (reduced) return;
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      // rAF로 한 frame당 한 번만 업데이트 — pointermove 빈도 throttle.
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        const centers = centersRef.current;
        const span = maxWeight - minWeight;
        charRefs.current.forEach((el, i) => {
          if (!el) return;
          const c = centers[i];
          if (!c) return;
          const dx = c.x - mx;
          const dy = c.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          // 거리 0에서 1.0, radius 이상에서 0 — easeOutQuad로 부드러운 falloff.
          const t = Math.max(0, 1 - dist / radius);
          const eased = t * t * (3 - 2 * t); // smoothstep
          const weight = Math.round(minWeight + span * eased);
          el.style.fontWeight = String(weight);
        });
      });
    },
    [reduced, minWeight, maxWeight, radius],
  );

  const handlePointerLeave = React.useCallback(() => {
    if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = null;
    charRefs.current.forEach((el) => {
      if (el) el.style.fontWeight = String(minWeight);
    });
  }, [minWeight]);

  // cleanup rAF on unmount.
  React.useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  const containerStyle: React.CSSProperties = {
    display: 'inline-block',
    fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
    fontFamily,
    color,
    // 폰트 굵기 변화에 따른 폭 변화 — letter-spacing 미세 보정으로 줄바꿈 흔들림 완화.
    fontFeatureSettings: '"kern" 1',
    ...style,
  };

  return (
    <span
      ref={containerRef}
      aria-label={text}
      className={className}
      style={containerStyle}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {chars.map((c, i) => {
        // 공백은 정적 — measure 대상이지만 굵기 변경은 무의미.
        if (/\s/.test(c)) {
          return (
            <span
              key={i}
              ref={(el) => {
                charRefs.current[i] = el;
              }}
              aria-hidden="true"
              style={{ whiteSpace: 'pre', fontWeight: minWeight }}
            >
              {c}
            </span>
          );
        }
        return (
          <span
            key={i}
            ref={(el) => {
              charRefs.current[i] = el;
            }}
            aria-hidden="true"
            style={{
              display: 'inline-block',
              fontWeight: minWeight,
              transition: reduced ? undefined : `font-weight ${transitionMs}ms ease`,
              willChange: 'font-weight',
            }}
          >
            {c}
          </span>
        );
      })}
    </span>
  );
}
