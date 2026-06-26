import * as React from 'react';

import { useReducedMotion } from '../../lib/use-reduced-motion';

import type { SpotlightTextProps } from './types';

/**
 * SpotlightText — 커서 주변만 밝게, 나머지는 어둡게 — 스포트라이트 효과.
 *
 * # 구현
 * - 두 레이어 겹침:
 *   1) 베이스(dim): 낮은 opacity — 항상 보이는 회미한 텍스트
 *   2) 하이라이트: 풀 opacity, 위에 절대 위치 — radial-gradient mask로 커서 주변만 노출
 * - 커서 좌표는 `--mx`, `--my` CSS 변수로 컨테이너에 직접 set → React 재렌더 X.
 * - 커서가 컨테이너를 벗어나면 좌표를 화면 밖으로 보내 mask가 안 보이게.
 *
 * # a11y
 * - `prefers-reduced-motion: reduce` 시 highlight를 항상 표시 (단일 레이어, 인터랙션 없음).
 * - aria-label로 원문 노출, 두 레이어 모두 aria-hidden.
 */
export function SpotlightText({
  text,
  radius = 120,
  dimOpacity = 0.15,
  highlightColor,
  fontSize,
  fontWeight,
  color,
  className,
  style,
}: SpotlightTextProps) {
  const reduced = useReducedMotion();
  const containerRef = React.useRef<HTMLSpanElement>(null);

  const handlePointerMove = React.useCallback((e: React.PointerEvent<HTMLSpanElement>) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    container.style.setProperty('--baneung-spot-x', `${e.clientX - rect.left}px`);
    container.style.setProperty('--baneung-spot-y', `${e.clientY - rect.top}px`);
  }, []);

  const handlePointerLeave = React.useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    // 좌표를 화면 밖 멀리 보내 mask가 보이지 않게.
    container.style.setProperty('--baneung-spot-x', '-9999px');
    container.style.setProperty('--baneung-spot-y', '-9999px');
  }, []);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
    fontWeight,
    color: color ?? 'currentColor',
    // 초기 좌표는 화면 밖 — pointer가 들어오기 전엔 highlight 미노출.
    ['--baneung-spot-x' as never]: '-9999px',
    ['--baneung-spot-y' as never]: '-9999px',
    ...style,
  };

  // reduced motion이면 단일 레이어 (highlight=풀 opacity)로 정적 표시.
  if (reduced) {
    return (
      <span aria-label={text} className={className} style={containerStyle}>
        {text}
      </span>
    );
  }

  // 하이라이트 mask — 커서 주변 radius만 black(보임), 외곽은 transparent(가림).
  const maskImage = `radial-gradient(${radius}px circle at var(--baneung-spot-x) var(--baneung-spot-y), black 0%, transparent 100%)`;

  return (
    <span
      ref={containerRef}
      aria-label={text}
      className={className}
      style={containerStyle}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* 1) 베이스 dim 레이어 — 항상 보이는 흐릿한 텍스트. */}
      <span
        aria-hidden="true"
        style={{
          opacity: dimOpacity,
          display: 'inline-block',
        }}
      >
        {text}
      </span>
      {/* 2) 하이라이트 레이어 — mask로 커서 주변만 노출. */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          color: highlightColor ?? color ?? 'currentColor',
          opacity: 1,
          pointerEvents: 'none',
          WebkitMaskImage: maskImage,
          maskImage: maskImage,
          // 부드러운 가장자리. 짧은 transition으로 커서 추적이 미세하게 부드럽게.
          transition: 'mask-position 80ms linear',
          whiteSpace: 'pre',
        }}
      >
        {text}
      </span>
    </span>
  );
}
