import * as React from 'react';

import { useReducedMotion } from '../../lib/use-reduced-motion';

import type { RippleProps } from './types';

interface RippleInstance {
  id: number;
  x: number;
  y: number;
  size: number;
}

/**
 * Ripple — 자식 요소를 감싸 클릭 위치에서 물결이 퍼지는 효과를 입혀주는 래퍼.
 *
 * @example
 *   <Ripple>
 *     <button>클릭</button>
 *   </Ripple>
 *
 * @example
 *   <Ripple color="rgba(0,0,0,0.2)" duration={800}>
 *     <div className="card">카드 전체에 ripple</div>
 *   </Ripple>
 *
 * # 구현
 * - children을 그대로 렌더 + 위에 `position:absolute`로 ripple span 오버레이.
 * - 컨테이너 자체는 `position:relative` + `overflow:hidden` (ripple이 모서리 밖으로 안 나가게).
 * - 클릭 좌표 → 컨테이너 원점 기준 (x, y) 계산.
 * - 원 크기 = 컨테이너의 두 모서리 중 먼 거리 × 2 → 항상 컨테이너 전체를 덮음.
 * - 애니메이션 종료 후 자동 cleanup.
 *
 * # a11y
 * - `prefers-reduced-motion: reduce` 시 ripple 비활성 (clean한 wrapper).
 * - pointer-events: none — 클릭 이벤트는 자식이 모두 받음.
 */
export function Ripple({
  children,
  color = 'currentColor',
  duration = 600,
  opacity = 0.35,
  disabled = false,
  className,
  style,
}: RippleProps) {
  const reduced = useReducedMotion();
  const containerRef = React.useRef<HTMLSpanElement>(null);
  const [ripples, setRipples] = React.useState<RippleInstance[]>([]);
  const idCounterRef = React.useRef(0);

  function handlePointerDown(e: React.PointerEvent<HTMLSpanElement>) {
    if (disabled || reduced) return;
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // 원이 컨테이너 전체를 덮도록 — 클릭 지점에서 가장 먼 모서리까지의 거리.
    const farX = Math.max(x, rect.width - x);
    const farY = Math.max(y, rect.height - y);
    const radius = Math.sqrt(farX * farX + farY * farY);
    const size = radius * 2;

    const id = idCounterRef.current++;
    setRipples((prev) => [...prev, { id, x, y, size }]);

    // 애니메이션 끝나면 제거.
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, duration);
  }

  return (
    <span
      ref={containerRef}
      className={className}
      onPointerDown={handlePointerDown}
      style={{
        position: 'relative',
        display: 'inline-block',
        overflow: 'hidden',
        // children이 inline이면 wrapper도 inline, block이면 block — wrapper는 자식 outline에 영향 X.
        ...style,
      }}
    >
      {children}
      {/* ripple overlay — 자식 위에 absolute. pointer-events:none → 클릭은 자식에. */}
      {ripples.map((r) => (
        <span
          key={r.id}
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: r.x - r.size / 2,
            top: r.y - r.size / 2,
            width: r.size,
            height: r.size,
            borderRadius: '50%',
            background: color,
            opacity,
            pointerEvents: 'none',
            transform: 'scale(0)',
            animation: `baneung-ripple-expand ${duration}ms ease-out forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes baneung-ripple-expand {
          to {
            transform: scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </span>
  );
}
