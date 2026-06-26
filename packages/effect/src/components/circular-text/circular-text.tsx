import * as React from 'react';

import { useReducedMotion } from '../../lib/use-reduced-motion';

import type { CircularTextProps } from './types';

/**
 * CircularText — 원형 경로를 따라 배치된 텍스트 (회전).
 *
 * # 구현
 * - 컨테이너: position:relative, 정사각형 (2*radius + padding).
 * - 각 글자를 컨테이너 중심에 두고 rotate + translate로 원주 위치로 이동:
 *   `transform: rotate(angle) translateY(-radius)`
 * - 컨테이너 자체에 `animation: spin` → 전체가 회전 → 글자도 함께 돈다.
 *
 * # a11y
 * - `prefers-reduced-motion: reduce` 시 회전 정지 (정적 배지처럼 표시).
 * - 컨테이너 aria-label로 원문 노출, 각 글자 span aria-hidden.
 *
 * # 주의
 * - 텍스트 길이가 너무 길면 글자 간격이 좁아져 겹침. 보통 8~20자가 적당.
 */
export function CircularText({
  text,
  radius = 80,
  durationMs = 12000,
  direction = 'cw',
  startAngleDeg = 0,
  fontSize,
  fontWeight,
  color,
  className,
  style,
}: CircularTextProps) {
  const reduced = useReducedMotion();
  const chars = React.useMemo(() => Array.from(text), [text]);
  const n = Math.max(1, chars.length);
  const stepDeg = 360 / n;

  // 컨테이너 사이즈 — 글자가 원주 위에 있으니 padding은 fontSize 기준 약간 여유.
  const fontSizePx = typeof fontSize === 'number' ? fontSize : 16;
  const containerSize = radius * 2 + fontSizePx * 2;

  // 회전 정지 조건: reduced motion 또는 durationMs <= 0.
  const spinning = !reduced && durationMs > 0;

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    width: containerSize,
    height: containerSize,
    // 회전 — 음수 duration은 spinning=false로 처리되니 여기선 양수만.
    animation: spinning
      ? `baneung-circular-spin ${durationMs}ms linear infinite ${direction === 'ccw' ? 'reverse' : 'normal'}`
      : undefined,
    fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
    fontWeight,
    color,
    ...style,
  };

  return (
    <span aria-label={text} className={className} style={containerStyle}>
      {chars.map((c, i) => {
        const angle = startAngleDeg + i * stepDeg;
        return (
          <span
            key={i}
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              // 1) translate(-50%,-50%): 글자 자신을 중앙 정렬 기준점으로
              // 2) rotate(angle): 회전축 설정
              // 3) translateY(-radius): 원주 위로 밀어냄 (12시 방향이 -y)
              transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radius}px)`,
              transformOrigin: 'center',
              whiteSpace: 'pre',
            }}
          >
            {c}
          </span>
        );
      })}
      <style>{`
        @keyframes baneung-circular-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </span>
  );
}
