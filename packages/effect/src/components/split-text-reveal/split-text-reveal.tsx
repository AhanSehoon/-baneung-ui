import * as React from 'react';

import { useInView } from '../../lib/use-in-view';
import { useReducedMotion } from '../../lib/use-reduced-motion';

import type { SplitTextRevealProps } from './types';

/**
 * SplitTextReveal — 글자 또는 단어 단위로 순차 페이드+슬라이드 인.
 *
 * # 구현
 * - 글자(char): 모든 글자를 inline-block span으로. 공백은 visible space 유지.
 * - 단어(word): 공백 기준 분할, 공백은 그대로 텍스트로 (줄바꿈 자연스러움).
 * - 각 항목에 `transitionDelay = i * stagger`로 시차 적용.
 *
 * # 트리거
 * - 'mount' (기본): 마운트 즉시 시작.
 * - 'inView': IntersectionObserver로 화면에 들어올 때 1회 발사. 스크롤 reveal 패턴.
 *
 * # a11y
 * - `prefers-reduced-motion: reduce`면 즉시 전체 표시 (애니메이션 없음).
 * - aria-label로 스크린리더에 원문 전달, 쪼개진 span은 aria-hidden.
 */
export function SplitTextReveal({
  text,
  by = 'char',
  stagger = 30,
  duration = 400,
  trigger = 'mount',
  threshold = 0.15,
  fontSize,
  fontWeight,
  color,
  className,
  style,
}: SplitTextRevealProps) {
  const reduced = useReducedMotion();
  const containerRef = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(containerRef, trigger === 'inView', threshold);

  // 분할 결과 — 메모이즈.
  const items = React.useMemo(() => {
    if (by === 'word') {
      // 공백을 보존하면서 단어 단위 분할 (캡처 그룹).
      return text.split(/(\s+)/).filter((s) => s.length > 0);
    }
    // 글자 단위 — Array.from으로 surrogate pair(이모지 등) 안전 처리.
    return Array.from(text);
  }, [text, by]);

  // 최종 상태 도달 여부:
  // - reduced motion: 항상 final state (애니메이션 없이 즉시).
  // - 일반: useInView가 트리거되면 final state로 transition.
  // (이전 `animate = !reduced && inView` 패턴은 reduced 시 opacity=0으로 굳는 버그가 있었음.)
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
        // 공백은 보이는 공간을 유지하되 애니메이션 대상에서 제외 (불필요한 span 절약).
        const isWhitespace = /^\s+$/.test(item);
        if (isWhitespace) {
          return (
            <span key={i} aria-hidden="true" style={{ whiteSpace: 'pre' }}>
              {item}
            </span>
          );
        }
        // reduced 모드면 transitionDelay 0으로 — 즉시 표시.
        return (
          <span
            key={i}
            aria-hidden="true"
            style={{
              display: 'inline-block',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(0.4em)',
              transition: reduced
                ? undefined
                : `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
              transitionDelay: reduced ? undefined : `${i * stagger}ms`,
              willChange: 'opacity, transform',
            }}
          >
            {item}
          </span>
        );
      })}
    </span>
  );
}
