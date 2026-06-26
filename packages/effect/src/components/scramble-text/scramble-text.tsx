import * as React from 'react';

import { useReducedMotion } from '../../lib/use-reduced-motion';

import type { ScrambleTextProps } from './types';

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*<>?/\\';

/**
 * ScrambleText — 해킹/디코딩 스타일 텍스트 등장 효과.
 *
 * # 동작
 * - 각 글자 위치를 시간 흐름에 따라 차례로 "고정" → 고정되기 전까지 매 프레임 랜덤 글자 표시.
 * - 공백(`' '`)은 항상 공백 — 스크램블 대상 아님 (시각적 자연스러움).
 *
 * # a11y
 * - `prefers-reduced-motion: reduce`면 즉시 전체 텍스트 표시.
 * - `aria-label`로 스크린리더에 최종 텍스트 한 번 전달.
 *
 * @example
 *   <ScrambleText text="ACCESS GRANTED" color="#16A34A" fontSize={24} />
 *
 * @example 루프
 *   <ScrambleText text="DECRYPTING..." loop pauseAfterRevealMs={2000} />
 */
export function ScrambleText({
  text,
  characters = DEFAULT_CHARS,
  revealSpeed = 60,
  scrambleSpeed = 35,
  loop = false,
  pauseAfterRevealMs = 2500,
  resetKey,
  fontSize,
  fontWeight,
  color,
  className,
  style,
}: ScrambleTextProps) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = React.useState<string>(text);

  React.useEffect(() => {
    if (reduced) {
      setDisplay(text);
      return;
    }

    let cancelled = false;
    let intervalId: ReturnType<typeof setInterval> | undefined;
    let loopTimeoutId: ReturnType<typeof setTimeout> | undefined;
    let startTime = 0;

    const pickRandom = (): string => {
      const i = Math.floor(Math.random() * characters.length);
      return characters[i] ?? ' ';
    };

    const renderFrame = () => {
      if (cancelled) return;
      const elapsed = Date.now() - startTime;
      const revealed = Math.min(text.length, Math.floor(elapsed / revealSpeed));

      let next = '';
      for (let i = 0; i < text.length; i++) {
        const original = text[i] ?? '';
        if (i < revealed) {
          next += original;
        } else if (original === ' ') {
          next += ' ';
        } else if (original === '\n') {
          next += '\n';
        } else {
          next += pickRandom();
        }
      }
      setDisplay(next);

      // 모두 풀린 뒤: loop면 대기 후 재시작, 아니면 정지.
      if (revealed >= text.length) {
        if (intervalId) clearInterval(intervalId);
        if (loop) {
          loopTimeoutId = setTimeout(start, pauseAfterRevealMs);
        }
      }
    };

    const start = () => {
      if (cancelled) return;
      startTime = Date.now();
      // 첫 프레임은 즉시 — 깜빡임 없이 바로 스크램블 시작.
      renderFrame();
      intervalId = setInterval(renderFrame, scrambleSpeed);
    };

    start();

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
      if (loopTimeoutId) clearTimeout(loopTimeoutId);
    };
  }, [text, characters, revealSpeed, scrambleSpeed, loop, pauseAfterRevealMs, reduced, resetKey]);

  const containerStyle: React.CSSProperties = {
    fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
    fontWeight,
    color,
    // 글자 폭 일정하게 — 스크램블 시 너비 흔들림 최소화.
    fontVariantNumeric: 'tabular-nums',
    ...style,
  };

  return (
    <span aria-label={text} className={className} style={containerStyle}>
      <span aria-hidden="true" style={{ whiteSpace: 'pre' }}>
        {display}
      </span>
    </span>
  );
}
