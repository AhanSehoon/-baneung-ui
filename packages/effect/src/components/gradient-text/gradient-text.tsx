import * as React from 'react';

import { useReducedMotion } from '../../lib/use-reduced-motion';

import type { GradientTextProps } from './types';

const DEFAULT_FLOW_COLORS = ['#1F2937', '#3B716C', '#5BA8A0', '#85C9BD', '#1F2937'];

/** 방향 → CSS linear-gradient 각도. */
const DIRECTION_ANGLE: Record<NonNullable<GradientTextProps['direction']>, number> = {
  horizontal: 90,
  vertical: 180,
  diagonal: 135,
};

/**
 * GradientText — 그라데이션이 흐르거나 반짝이는 텍스트 이펙트.
 *
 * # 동작
 * - **flow**: 여러 색을 이은 큰 그라데이션을 `background-clip: text`로 글자에 잘라 보임 → background-position을 애니메이션.
 * - **shimmer**: 베이스 텍스트는 단색, 그 위 밝은 띠가 주기적으로 통과.
 *
 * # a11y
 * - `prefers-reduced-motion: reduce`면 애니메이션 없이 첫 프레임 정적 표시.
 * - 텍스트는 aria-label로 그대로 노출 (장식 효과만 aria-hidden).
 */
export function GradientText({
  text,
  mode = 'flow',
  colors,
  direction = 'horizontal',
  durationMs = 3000,
  shimmerColor = '#ffffff',
  baseColor,
  fontSize,
  fontWeight,
  color,
  className,
  style,
}: GradientTextProps) {
  const reduced = useReducedMotion();
  const angle = DIRECTION_ANGLE[direction];

  // mode별 background 설정.
  const flowColors = colors && colors.length >= 2 ? colors : DEFAULT_FLOW_COLORS;
  const flowBg = `linear-gradient(${angle}deg, ${flowColors.join(', ')})`;
  // shimmer: 텍스트 색 → 빛 → 텍스트 색의 좁은 띠를 글자 위로 흘려보냄.
  const baseTextColor = baseColor ?? color ?? 'currentColor';
  const shimmerBg = `linear-gradient(${angle}deg, ${baseTextColor} 40%, ${shimmerColor} 50%, ${baseTextColor} 60%)`;

  const isFlow = mode === 'flow';
  const animationName = isFlow ? 'baneung-grad-flow' : 'baneung-grad-shimmer';

  const containerStyle: React.CSSProperties = {
    display: 'inline-block',
    // background-clip:text 필수 — 글자 모양으로 잘라서 보임.
    backgroundImage: isFlow ? flowBg : shimmerBg,
    backgroundSize: '200% 100%',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    WebkitTextFillColor: 'transparent',
    // reduced motion이면 애니메이션 X — 첫 프레임 정적 그라데이션.
    animation: reduced ? undefined : `${animationName} ${durationMs}ms linear infinite`,
    fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
    fontWeight,
    ...style,
  };

  return (
    <span aria-label={text} className={className} style={containerStyle}>
      <span aria-hidden="true">{text}</span>
      <style>{`
        @keyframes baneung-grad-flow {
          0%   { background-position: 0% 50%; }
          100% { background-position: -200% 50%; }
        }
        @keyframes baneung-grad-shimmer {
          0%   { background-position: 200% 50%; }
          100% { background-position: -200% 50%; }
        }
      `}</style>
    </span>
  );
}
