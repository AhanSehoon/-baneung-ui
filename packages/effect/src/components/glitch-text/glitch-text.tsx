import * as React from 'react';

import { useReducedMotion } from '../../lib/use-reduced-motion';

import type { GlitchTextProps } from './types';

/**
 * GlitchText — RGB 채널이 어긋나는 글리치 효과.
 *
 * # 구현
 * - 세 겹의 텍스트를 같은 위치에 겹쳐 렌더:
 *   1. 베이스 (currentColor)
 *   2. 적색 채널 (붉은 톤, 살짝 어긋남)
 *   3. 청록 채널 (시안 톤, 반대로 어긋남)
 * - `mix-blend-mode: screen`으로 색이 자연스럽게 섞이며 RGB 분리 느낌.
 * - 두 채널이 서로 다른 keyframe + 다른 duration으로 글리치 패턴 생성.
 * - `intensity`로 어긋남 거리(`--glitch`)를 inline 주입 → 키프레임은 한 번만 정의.
 *
 * # triggerOn
 * - 'always': 무한 글리치.
 * - 'hover': 평소 정적, hover/focus 시에만 글리치 (data 속성으로 토글).
 *
 * # a11y
 * - `prefers-reduced-motion: reduce`면 글리치 비활성 (정적 텍스트로 표시).
 * - aria-label로 원문 노출, 채널 레이어는 aria-hidden.
 */
export function GlitchText({
  text,
  intensity = 0.5,
  triggerOn = 'always',
  speedMs = 2200,
  redChannelColor = '#ff003c',
  cyanChannelColor = '#00fbff',
  fontSize,
  fontWeight,
  color,
  className,
  style,
}: GlitchTextProps) {
  const reduced = useReducedMotion();
  // 강도 정규화 — 너무 극단적인 값으로 깨지지 않게.
  const clamped = Math.max(0, Math.min(1, intensity));
  // 글리치 거리 (px). intensity=1일 때 약 4px.
  const distance = `${(clamped * 4).toFixed(2)}px`;

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
    fontWeight,
    color: color ?? 'currentColor',
    // intensity를 CSS 변수로 전달 — 키프레임이 참조.
    ['--baneung-glitch' as never]: distance,
    ...style,
  };

  // hover 모드면 animation은 항상 정의하고 play-state로만 토글.
  // (그래야 hover 시 :hover 셀렉터가 animation-play-state: running으로 override 가능.)
  const isHoverMode = triggerOn === 'hover';

  // 채널 레이어 공통 스타일.
  const channelBase: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    mixBlendMode: 'screen',
  };

  // hover-only: data-glitch-hover로 CSS hover/focus 셀렉터 활성화.
  return (
    <span
      aria-label={text}
      className={className}
      style={containerStyle}
      data-glitch-hover={isHoverMode ? '' : undefined}
      tabIndex={isHoverMode ? 0 : undefined}
    >
      {/* 베이스 텍스트 — 항상 보이는 본문. */}
      <span style={{ position: 'relative', zIndex: 1 }} aria-hidden="true">
        {text}
      </span>
      {/* RGB 채널 — reduced motion일 땐 렌더 안 함. */}
      {!reduced && (
        <>
          <span
            aria-hidden="true"
            data-glitch-channel="r"
            style={{
              ...channelBase,
              color: redChannelColor,
              animation: `baneung-glitch-r ${speedMs}ms infinite steps(20, end)`,
              animationPlayState: isHoverMode ? 'paused' : undefined,
            }}
          >
            {text}
          </span>
          <span
            aria-hidden="true"
            data-glitch-channel="c"
            style={{
              ...channelBase,
              color: cyanChannelColor,
              animation: `baneung-glitch-c ${Math.round(speedMs * 1.18)}ms infinite steps(22, end)`,
              animationPlayState: isHoverMode ? 'paused' : undefined,
            }}
          >
            {text}
          </span>
        </>
      )}
      <style>{`
        @keyframes baneung-glitch-r {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(var(--baneung-glitch), calc(-1 * var(--baneung-glitch))); }
          40% { transform: translate(calc(-1 * var(--baneung-glitch)), var(--baneung-glitch)); }
          60% { transform: translate(calc(var(--baneung-glitch) * 0.6), var(--baneung-glitch)); }
          80% { transform: translate(calc(-1 * var(--baneung-glitch)), calc(-1 * var(--baneung-glitch))); }
        }
        @keyframes baneung-glitch-c {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(calc(-1 * var(--baneung-glitch)), 0); }
          50% { transform: translate(var(--baneung-glitch), calc(var(--baneung-glitch) * 0.6)); }
          75% { transform: translate(calc(var(--baneung-glitch) * 0.4), calc(-1 * var(--baneung-glitch))); }
        }
        /* hover 모드: hover/focus 시 글리치 재생. */
        [data-glitch-hover]:hover [data-glitch-channel],
        [data-glitch-hover]:focus-visible [data-glitch-channel] {
          animation-play-state: running !important;
        }
      `}</style>
    </span>
  );
}
