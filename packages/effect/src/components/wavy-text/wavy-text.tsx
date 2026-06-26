import * as React from 'react';

import { useReducedMotion } from '../../lib/use-reduced-motion';

import type { WavyTextProps } from './types';

/**
 * WavyText — 글자가 파도치거나 통통 튀는 무한 애니메이션.
 *
 * # 구현
 * - 각 글자를 inline-block span으로 분할.
 * - 모든 글자가 같은 keyframe을 공유하되 `animation-delay`로 위상 어긋남.
 *   → 음수 delay로 즉시 사이클의 다른 지점에서 시작 (자연스러운 파도).
 * - `--amp` CSS 변수로 진폭(em)을 inline 주입 → 키프레임은 한 번만 정의.
 *
 * # a11y
 * - `prefers-reduced-motion: reduce`면 정적 텍스트로 표시 (애니메이션 X).
 * - 컨테이너 aria-label로 원문 노출, 각 글자 span aria-hidden.
 */
export function WavyText({
  text,
  mode = 'wave',
  amplitude = 0.25,
  duration = 2000,
  phaseStep = 0.08,
  fontSize,
  fontWeight,
  color,
  className,
  style,
}: WavyTextProps) {
  const reduced = useReducedMotion();
  const chars = React.useMemo(() => Array.from(text), [text]);
  const animationName = mode === 'bounce' ? 'baneung-wavy-bounce' : 'baneung-wavy-wave';

  const containerStyle: React.CSSProperties = {
    display: 'inline-block',
    fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
    fontWeight,
    color,
    ...style,
  };

  return (
    <span aria-label={text} className={className} style={containerStyle}>
      {chars.map((c, i) => {
        // 공백은 정적 — 움직이면 단어 간격이 흐트러져 부자연스러움.
        if (/\s/.test(c)) {
          return (
            <span key={i} aria-hidden="true" style={{ whiteSpace: 'pre' }}>
              {c}
            </span>
          );
        }
        return (
          <span
            key={i}
            aria-hidden="true"
            style={{
              display: 'inline-block',
              animation: reduced
                ? undefined
                : `${animationName} ${duration}ms ease-in-out infinite`,
              // 음수 delay로 사이클 중간부터 시작 → 글자별로 위상 어긋남.
              animationDelay: reduced ? undefined : `${-i * phaseStep * duration}ms`,
              // 키프레임 안에서 var(--amp)를 참조해 진폭 주입.
              ['--amp' as never]: `${amplitude}em`,
              willChange: 'transform',
            }}
          >
            {c}
          </span>
        );
      })}
      <style>{`
        @keyframes baneung-wavy-wave {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(calc(-1 * var(--amp))); }
        }
        @keyframes baneung-wavy-bounce {
          0%, 40%, 100% { transform: translateY(0); }
          20% { transform: translateY(calc(-1 * var(--amp))); }
        }
      `}</style>
    </span>
  );
}
