import * as React from 'react';

import { useInView } from '../../lib/use-in-view';
import { useReducedMotion } from '../../lib/use-reduced-motion';

import type { GravityTextProps } from './types';

/**
 * GravityText — 글자가 중력에 떨어지거나 흩어지는 효과.
 *
 * # 구현
 * - 각 글자별로 random dx (가로 흩어짐), dy (세로 낙하), rotation을 1회 생성 (useMemo).
 * - "falling=true"일 때 transform이 (dx, dy, rotate)로 transition → CSS가 보간.
 * - "falling=false"면 transform: none, 정상 위치 → hover-out 시 복귀에 활용.
 *
 * # 트리거별 동작
 * - mount: 마운트 즉시 + rAF로 falling=true (1회).
 * - inView: 화면 진입 시 falling=true (1회).
 * - hover: pointerenter=true, pointerleave=false → 흩어짐/복귀 토글.
 *
 * # a11y
 * - `prefers-reduced-motion: reduce` 시 transform 비활성, 정적 텍스트로 표시.
 * - aria-label로 원문 노출, 글자 span aria-hidden.
 */
export function GravityText({
  text,
  trigger = 'mount',
  duration = 1400,
  stagger = 30,
  spread = 0.5,
  gravity = 320,
  rotation = 90,
  threshold = 0.2,
  fontSize,
  fontWeight,
  color,
  className,
  style,
}: GravityTextProps) {
  const reduced = useReducedMotion();
  const containerRef = React.useRef<HTMLSpanElement>(null);
  // inView 트리거일 때만 IntersectionObserver 사용. 그 외엔 즉시 true 반환.
  // mount 트리거도 useInView가 rAF로 한 번 더 paint 후 true 전환 → transition 발사.
  const inView = useInView(containerRef, trigger === 'inView', threshold);

  // hover 상태 — trigger='hover'일 때만 의미.
  const [hovered, setHovered] = React.useState(false);

  // falling 결정 — 트리거별 분기.
  let falling: boolean;
  if (reduced) {
    falling = false; // 모션 줄임 시 떨어지지 않음.
  } else if (trigger === 'hover') {
    falling = hovered;
  } else {
    // mount 또는 inView — useInView가 true 되면 떨어짐.
    falling = inView;
  }

  // 각 글자별 random offset — text 변경되거나 spread/gravity 바뀔 때만 재생성.
  const chars = React.useMemo(() => Array.from(text), [text]);
  const offsets = React.useMemo(() => {
    // Math.random 기반이라 SSR/CSR 불일치 가능 — hydration 후 한 번 더 생성되니 OK.
    return chars.map(() => {
      // dx: -spread*200 ~ +spread*200 (px)
      const dx = (Math.random() - 0.5) * spread * 220;
      // dy: 기본 gravity + 약간의 변동 (글자마다 다른 속도감)
      const dy = gravity * (0.8 + Math.random() * 0.5);
      // 회전: -rotation ~ +rotation
      const rot = (Math.random() - 0.5) * rotation * 2;
      return { dx, dy, rot };
    });
  }, [chars, spread, gravity, rotation]);

  const containerStyle: React.CSSProperties = {
    display: 'inline-block',
    fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
    fontWeight,
    color,
    // overflow visible — 글자가 컨테이너 밖으로 떨어지는 게 보여야 함.
    overflow: 'visible',
    ...style,
  };

  // hover 트리거: pointer 이벤트로 토글. 그 외 트리거에선 이벤트 무시.
  const isHoverTrigger = trigger === 'hover';

  return (
    <span
      ref={containerRef}
      aria-label={text}
      className={className}
      style={containerStyle}
      onPointerEnter={isHoverTrigger ? () => setHovered(true) : undefined}
      onPointerLeave={isHoverTrigger ? () => setHovered(false) : undefined}
    >
      {chars.map((c, i) => {
        if (/\s/.test(c)) {
          return (
            <span key={i} aria-hidden="true" style={{ whiteSpace: 'pre' }}>
              {c}
            </span>
          );
        }
        const off = offsets[i] ?? { dx: 0, dy: 0, rot: 0 };
        return (
          <span
            key={i}
            aria-hidden="true"
            style={{
              display: 'inline-block',
              transform: falling
                ? `translate(${off.dx}px, ${off.dy}px) rotate(${off.rot}deg)`
                : 'translate(0, 0) rotate(0)',
              opacity: falling ? 0 : 1,
              // 떨어질 땐 가속 ease-in, 복귀할 땐 ease-out 느낌. cubic-bezier로 자연스러운 fall.
              transition: reduced
                ? undefined
                : `transform ${duration}ms cubic-bezier(.34,.07,.43,.95), opacity ${duration}ms ease-in`,
              transitionDelay: reduced ? undefined : `${i * stagger}ms`,
              willChange: 'transform, opacity',
            }}
          >
            {c}
          </span>
        );
      })}
    </span>
  );
}
