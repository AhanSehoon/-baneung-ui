import * as React from 'react';

import { useInView } from '../../lib/use-in-view';
import { useReducedMotion } from '../../lib/use-reduced-motion';

import type { BlurInTextProps } from './types';

/**
 * BlurInText — 흐릿하게 시작해 선명해지며 등장하는 텍스트.
 *
 * # 구현
 * - `filter: blur(Npx)` → `blur(0)` + `opacity: 0` → `1` 전환.
 * - 분할 단위(by)에 따라 글자/단어/전체로 묶고 stagger로 시차 적용.
 *
 * # a11y
 * - `prefers-reduced-motion: reduce`면 즉시 전체 표시 (애니메이션 없음).
 * - aria-label로 원문 노출, 쪼개진 span은 aria-hidden.
 */
export function BlurInText({
  text,
  by = 'word',
  stagger = 50,
  duration = 600,
  blurAmount = 8,
  trigger = 'mount',
  threshold = 0.15,
  fontSize,
  fontWeight,
  color,
  className,
  style,
}: BlurInTextProps) {
  const reduced = useReducedMotion();
  const containerRef = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(containerRef, trigger === 'inView', threshold);

  // 분할 결과 메모이즈.
  const items = React.useMemo<string[]>(() => {
    if (by === 'all') return [text];
    if (by === 'word') return text.split(/(\s+)/).filter((s) => s.length > 0);
    return Array.from(text); // char (이모지/한글 안전)
  }, [text, by]);

  // 최종 상태로 도달했는지 여부.
  // - reduced motion: 항상 final state (애니메이션 없이 즉시 표시).
  // - 일반: useInView가 트리거되면 final state로 transition.
  const visible = reduced || inView;

  const containerStyle: React.CSSProperties = {
    display: 'inline-block',
    fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
    fontWeight,
    color,
    ...style,
  };

  return (
    <span ref={containerRef} aria-label={text} className={className} style={containerStyle}>
      {items.map((item, i) => {
        // 공백은 보이는 공간만 유지 — 애니메이션 불필요.
        const isWhitespace = /^\s+$/.test(item);
        if (isWhitespace) {
          return (
            <span key={i} aria-hidden="true" style={{ whiteSpace: 'pre' }}>
              {item}
            </span>
          );
        }
        return (
          <span
            key={i}
            aria-hidden="true"
            style={{
              display: 'inline-block',
              filter: visible ? 'blur(0px)' : `blur(${blurAmount}px)`,
              opacity: visible ? 1 : 0,
              // reduced면 transition 자체를 끔 (점프). 일반은 transition 정의.
              transition: reduced
                ? undefined
                : `filter ${duration}ms ease-out, opacity ${duration}ms ease-out`,
              transitionDelay: reduced ? undefined : `${i * stagger}ms`,
              willChange: 'filter, opacity',
            }}
          >
            {item}
          </span>
        );
      })}
    </span>
  );
}
