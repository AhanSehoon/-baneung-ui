import * as React from 'react';

import { useControllableState } from '../../lib/use-controllable-state';
import { useReducedMotion } from '../../lib/use-reduced-motion';

import type { LikeButtonProps, LikeButtonSize } from './types';

const SIZE_MAP: Record<
  LikeButtonSize,
  { icon: number; pad: number; font: number; particle: number }
> = {
  sm: { icon: 16, pad: 4, font: 12, particle: 3 },
  md: { icon: 22, pad: 6, font: 13, particle: 4 },
  lg: { icon: 28, pad: 8, font: 14, particle: 5 },
};

/**
 * LikeButton — 좋아요 클릭 시 하트가 채워지며 주변에 작은 입자가 터지는 burst.
 *
 * # 동작
 * - false → true: 하트가 pop scale (0.7 → 1.15 → 1) + burst 입자 N개가 방사형으로 짧게 흩어짐
 * - true → false: 하트가 부드럽게 비워짐 (burst 없음)
 *
 * # Controlled / Uncontrolled
 * - `liked` + `onLikedChange` → controlled
 * - `defaultLiked` + `onLikedChange` → uncontrolled
 *
 * # ARIA + 키보드
 * - `role="button"` (native button) + `aria-pressed={liked}` (toggle 버튼 의미)
 * - Tab 포커스, Space/Enter로 토글
 *
 * # a11y
 * - `prefers-reduced-motion: reduce` 시 pop + burst 비활성 (정적 색 변화만)
 */
export function LikeButton({
  liked: likedProp,
  defaultLiked = false,
  onLikedChange,
  count,
  disabled = false,
  size = 'md',
  color = '#FF2D78',
  emptyColor = '#9CA5B3',
  burstColor,
  burstCount = 6,
  'aria-label': ariaLabel = '좋아요',
  className,
  style,
}: LikeButtonProps) {
  const reduced = useReducedMotion();
  const [likedRaw, setLiked] = useControllableState({
    prop: likedProp,
    defaultProp: defaultLiked,
    onChange: onLikedChange,
  });
  const liked = likedRaw ?? false;

  const dims = SIZE_MAP[size];
  const actualBurstColor = burstColor ?? color;

  // burst 트리거 — 매번 새 burst id로 key remount → animation 재시작.
  const [burstId, setBurstId] = React.useState<number | null>(null);
  const burstCounterRef = React.useRef(0);

  function toggle() {
    if (disabled) return;
    const next = !liked;
    setLiked(next);
    if (next && !reduced) {
      setBurstId(burstCounterRef.current++);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={liked}
      className={className}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: dims.pad,
        background: 'transparent',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        fontSize: dims.font,
        fontWeight: 600,
        color: liked ? color : '#6B7280',
        borderRadius: 0,
        outline: 'none',
        ...style,
      }}
      onFocus={(e) => {
        e.currentTarget.style.boxShadow = `0 0 0 2px ${withAlpha(color, 0.3)}`;
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* 하트 + burst 컨테이너 */}
      <span style={{ position: 'relative', display: 'inline-flex' }}>
        <svg
          width={dims.icon}
          height={dims.icon}
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{
            display: 'block',
            // pop animation — liked로 바뀔 때 한 번 발사.
            animation:
              liked && !reduced && burstId !== null
                ? `baneung-like-pop 320ms cubic-bezier(.34,1.6,.43,.95)`
                : undefined,
            transition: reduced ? undefined : 'transform 200ms ease',
          }}
          key={`heart-${burstId ?? 'idle'}`}
        >
          <path
            d="M12 21s-7-4.5-9.5-9.05C.85 9.34 2.2 6 5.5 6c1.74 0 3.41.81 4.5 2.09C11.09 6.81 12.76 6 14.5 6 17.8 6 19.15 9.34 17.5 11.95 14.99 16.5 12 21 12 21z"
            fill={liked ? color : 'none'}
            stroke={liked ? color : emptyColor}
            strokeWidth={2}
            strokeLinejoin="round"
            style={{
              transition: reduced ? undefined : 'fill 220ms ease, stroke 220ms ease',
            }}
          />
        </svg>
        {/* burst 입자 — burstId 변할 때마다 새로 mount → 애니메이션 재발사 */}
        {burstId !== null && !reduced && (
          <Burst
            key={`burst-${burstId}`}
            count={burstCount}
            color={actualBurstColor}
            size={dims.particle}
            iconSize={dims.icon}
          />
        )}
        <style>{`
          @keyframes baneung-like-pop {
            0%   { transform: scale(0.7); }
            40%  { transform: scale(1.25); }
            100% { transform: scale(1); }
          }
        `}</style>
      </span>

      {/* 카운트 */}
      {count !== undefined && (
        <span
          style={{
            minWidth: 16,
            transition: reduced ? undefined : 'color 200ms ease',
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}

/**
 * Burst — 하트 중심에서 N개 입자가 방사형으로 짧게 흩어졌다 사라짐.
 * 각 입자 인라인 keyframe + animationDelay 0 → 동시 발사.
 */
function Burst({
  count,
  color,
  size,
  iconSize,
}: {
  count: number;
  color: string;
  size: number;
  iconSize: number;
}) {
  const particles = React.useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const angle = (Math.PI * 2 * i) / count;
        const distance = iconSize * 0.9;
        return {
          dx: Math.cos(angle) * distance,
          dy: Math.sin(angle) * distance,
        };
      }),
    [count, iconSize],
  );

  return (
    <span
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: iconSize / 2,
        top: iconSize / 2,
        width: 0,
        height: 0,
        pointerEvents: 'none',
      }}
    >
      {particles.map((p, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: -size / 2,
            top: -size / 2,
            width: size,
            height: size,
            background: color,
            borderRadius: '50%',
            // CSS var로 거리 전달 — 키프레임은 한 번 정의.
            ['--bx' as never]: `${p.dx}px`,
            ['--by' as never]: `${p.dy}px`,
            animation: `baneung-like-burst 500ms ease-out forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes baneung-like-burst {
          0%   { transform: translate(0, 0) scale(1);   opacity: 1; }
          100% { transform: translate(var(--bx), var(--by)) scale(0.3); opacity: 0; }
        }
      `}</style>
    </span>
  );
}

function withAlpha(hex: string, alpha: number): string {
  if (!hex.startsWith('#') || hex.length !== 7) return hex;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
