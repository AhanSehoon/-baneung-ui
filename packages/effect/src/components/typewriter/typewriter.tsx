import * as React from 'react';

import { useReducedMotion } from '../../lib/use-reduced-motion';

import type { TypewriterProps } from './types';

/**
 * Typewriter — 한 글자씩 등장하는 텍스트 + 깜빡이는 커서 이펙트.
 *
 * # 기능
 * - 1회 모드(`loop=false`, 기본): 다 친 뒤 정지, 커서 깜빡임.
 * - 루프 모드(`loop=true`): 타이핑 → 멈춤 → 지움 → 멈춤 → 다시 타이핑 반복.
 * - 시각 커스터마이즈: `fontSize` / `fontWeight` / `color` / 커서 옵션.
 * - 접근성:
 *   - `prefers-reduced-motion: reduce` 사용자에겐 즉시 전체 표시 (애니메이션 비활성).
 *   - `aria-label`로 스크린리더에 전체 텍스트를 한 번에 전달 → 한 글자씩 읽히는 거 방지.
 *
 * # Tailwind 비종속
 * - 소비자가 Tailwind 없이도 동작하도록 모든 시각 props는 inline style로 처리.
 * - `className`은 그대로 통과 (소비자가 Tailwind/CSS Module로 보강할 수 있음).
 *
 * @example 1회 타이핑
 *   <Typewriter text="Hello, world!" />
 *
 * @example 무한 루프 + 컬러
 *   <Typewriter text="문의해 주세요" loop color="#1F2937" fontSize={20} fontWeight={600} />
 *
 * @example 언더스코어 커서
 *   <Typewriter text="$ npm install" cursorChar="_" />
 */
type Phase = 'typing' | 'paused-full' | 'erasing' | 'paused-empty';

export function Typewriter({
  text,
  speedMs = 50,
  eraseSpeedMs = 24,
  pauseAfterTypeMs = 3000,
  pauseAfterEraseMs = 450,
  loop = false,
  resetKey,
  fontSize,
  fontWeight,
  color,
  showCursor = true,
  cursorColor,
  cursorWidth = 2,
  cursorChar,
  className,
  style,
}: TypewriterProps) {
  const [shown, setShown] = React.useState('');
  const [phase, setPhase] = React.useState<Phase>('typing');
  const reduceMotion = useReducedMotion();

  React.useEffect(() => {
    if (reduceMotion) {
      // a11y — 모션 줄임 모드: 애니메이션 없이 즉시 전체 표시. 루프도 무의미.
      setShown(text);
      setPhase('paused-full');
      return;
    }

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const schedule = (fn: () => void, delay: number): void => {
      if (cancelled) return;
      timeoutId = setTimeout(() => {
        if (!cancelled) fn();
      }, delay);
    };

    const typeStep = (i: number): void => {
      if (cancelled) return;
      setShown(text.slice(0, i));
      setPhase('typing');
      if (i < text.length) {
        schedule(() => typeStep(i + 1), speedMs);
      } else if (loop) {
        setPhase('paused-full');
        schedule(() => eraseStep(text.length), pauseAfterTypeMs);
      } else {
        setPhase('paused-full');
      }
    };

    const eraseStep = (i: number): void => {
      if (cancelled) return;
      setShown(text.slice(0, i));
      setPhase('erasing');
      if (i > 0) {
        schedule(() => eraseStep(i - 1), eraseSpeedMs);
      } else {
        setPhase('paused-empty');
        schedule(() => typeStep(1), pauseAfterEraseMs);
      }
    };

    setShown('');
    setPhase('typing');
    schedule(() => typeStep(1), speedMs);

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [
    text,
    speedMs,
    eraseSpeedMs,
    pauseAfterTypeMs,
    pauseAfterEraseMs,
    loop,
    reduceMotion,
    resetKey,
  ]);

  // 커서는 멈춤 단계에선 깜빡임, 능동 단계(타이핑/지움)에선 solid.
  const isPaused = phase === 'paused-full' || phase === 'paused-empty';

  // 외부 컨테이너 style — 사용자 style이 우선이도록 spread 순서 주의.
  const containerStyle: React.CSSProperties = {
    fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
    fontWeight,
    color,
    ...style,
  };

  // 커서 색은 별도 지정 시 적용, 아니면 currentColor(텍스트 색 자동 추적).
  const cursorFill = cursorColor ?? 'currentColor';

  return (
    <span aria-label={text} className={className} style={containerStyle}>
      <span aria-hidden="true">{shown}</span>
      {showCursor && (
        <CursorMark char={cursorChar} width={cursorWidth} color={cursorFill} blink={isPaused} />
      )}
      <style>{`@keyframes baneung-effect-caret-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }`}</style>
    </span>
  );
}

/**
 * 커서 마크업 — 글자 커서(`cursorChar`) 또는 막대 커서 둘 중 하나.
 * 막대는 1em 높이, baseline에 살짝 위로 정렬해 자연스럽게 보이게.
 */
function CursorMark({
  char,
  width,
  color,
  blink,
}: {
  char?: string;
  width: number;
  color: string;
  blink: boolean;
}) {
  const baseStyle: React.CSSProperties = {
    display: 'inline-block',
    marginLeft: '0.06em',
    color,
    animation: blink ? 'baneung-effect-caret-blink 1.05s step-end infinite' : undefined,
  };

  if (char) {
    return (
      <span aria-hidden="true" style={baseStyle}>
        {char}
      </span>
    );
  }
  // 막대 커서 — 1em 높이로 텍스트와 같은 size 따라감.
  return (
    <span
      aria-hidden="true"
      style={{
        ...baseStyle,
        width: `${width}px`,
        height: '1em',
        backgroundColor: color,
        verticalAlign: 'middle',
        transform: 'translateY(-0.05em)',
      }}
    />
  );
}
