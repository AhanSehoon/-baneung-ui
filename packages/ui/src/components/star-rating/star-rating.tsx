import * as React from 'react';

import { useControllableState } from '../../lib/use-controllable-state';
import { useReducedMotion } from '../../lib/use-reduced-motion';

import type { StarRatingProps, StarRatingSize } from './types';

const SIZE_MAP: Record<StarRatingSize, number> = { sm: 16, md: 22, lg: 28 };

/**
 * StarRating — 별점 입력. half-star, hover preview, 키보드 지원.
 *
 * # 동작
 * - 클릭: 클릭한 별의 위치(half=true면 좌/우 절반)로 값 설정
 * - hover: 임시 preview (커서 떼면 원래 값으로 복귀)
 * - 같은 값 클릭 시: 0으로 reset (단, half=false에서 정수 값일 때)
 *
 * # ARIA + 키보드
 * - `role="slider"` + `aria-valuenow/min/max/valuetext` (W3C ARIA Authoring 권장)
 * - Tab으로 포커스, **ArrowLeft/Right** (또는 Down/Up)로 ±1 (half면 ±0.5)
 * - **Home / End**로 0 / max
 * - readOnly면 키보드/마우스 무시, 시각만 표시
 *
 * # a11y
 * - `prefers-reduced-motion: reduce` 시 hover/click transition 비활성
 */
export function StarRating({
  value: valueProp,
  defaultValue = 0,
  onValueChange,
  max = 5,
  half = false,
  readOnly = false,
  disabled = false,
  size = 'md',
  color = '#F59E0B',
  emptyColor = '#E9ECEF',
  gap = 4,
  'aria-label': ariaLabel = '별점',
  className,
  style,
}: StarRatingProps) {
  const reduced = useReducedMotion();
  const [valueRaw, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });
  const value = valueRaw ?? 0;
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);

  const px = SIZE_MAP[size];
  // 표시값 — hover 중이면 hover value, 아니면 실제 value.
  const display = hoverValue ?? value;
  const step = half ? 0.5 : 1;
  const disabledForInteract = readOnly || disabled;

  function handleStarClick(starIndex: number, isLeftHalf: boolean) {
    if (disabledForInteract) return;
    const next = starIndex + (half && isLeftHalf ? 0.5 : 1);
    // 같은 값 다시 클릭 시 reset (재선택 해제 UX) — half 모드에선 비활성.
    if (!half && next === value) {
      setValue(0);
    } else {
      setValue(next);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (disabledForInteract) return;
    let next: number | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = Math.min(max, value + step);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = Math.max(0, value - step);
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = max;
    if (next !== null) {
      e.preventDefault();
      setValue(next);
    }
  }

  return (
    <div
      role="slider"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={`${value} of ${max} stars`}
      aria-readonly={readOnly || undefined}
      aria-disabled={disabled || undefined}
      tabIndex={disabledForInteract ? -1 : 0}
      onKeyDown={handleKeyDown}
      onMouseLeave={() => setHoverValue(null)}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap,
        cursor: disabledForInteract ? (disabled ? 'not-allowed' : 'default') : 'pointer',
        opacity: disabled ? 0.5 : 1,
        outline: 'none',
        ...style,
      }}
      onFocus={(e) => {
        if (disabledForInteract) return;
        e.currentTarget.style.boxShadow = `0 0 0 2px ${withAlpha(color, 0.3)}`;
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          index={i}
          fillRatio={Math.max(0, Math.min(1, display - i))}
          size={px}
          color={color}
          emptyColor={emptyColor}
          half={half}
          interactive={!disabledForInteract}
          reduced={reduced}
          onClick={(isLeftHalf) => handleStarClick(i, isLeftHalf)}
          onHover={(isLeftHalf) => setHoverValue(i + (half && isLeftHalf ? 0.5 : 1))}
        />
      ))}
    </div>
  );
}

interface StarProps {
  index: number;
  /** 0(빈) ~ 1(꽉) — half면 0.5도 표시 가능. */
  fillRatio: number;
  size: number;
  color: string;
  emptyColor: string;
  half: boolean;
  interactive: boolean;
  reduced: boolean;
  onClick: (isLeftHalf: boolean) => void;
  onHover: (isLeftHalf: boolean) => void;
}

function Star({
  fillRatio,
  size,
  color,
  emptyColor,
  half,
  interactive,
  reduced,
  onClick,
  onHover,
}: StarProps) {
  // half면 별을 좌/우 두 영역으로 나눠서 hover/click 추적.
  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        width: size,
        height: size,
      }}
    >
      {/* SVG — 두 레이어: 빈 별 + 채움(clip-path로 좌측만 노출 가능) */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        aria-hidden="true"
        style={{ display: 'block' }}
      >
        {/* 빈 별 (배경) */}
        <path d={STAR_PATH} fill={emptyColor} />
        {/* 채움 — fillRatio 비율만큼 좌측에서 보이게. clipPath로 폭 비율 제어. */}
        <defs>
          <clipPath id={`clip-${size}-${color.replace('#', '')}-${Math.round(fillRatio * 100)}`}>
            <rect x="0" y="0" width={24 * fillRatio} height="24" />
          </clipPath>
        </defs>
        <path
          d={STAR_PATH}
          fill={color}
          style={{
            clipPath: `inset(0 ${(1 - fillRatio) * 100}% 0 0)`,
            transition: reduced ? undefined : 'clip-path 150ms ease',
          }}
        />
      </svg>
      {/* 인터랙티브 hover/click 영역 — native button으로 키보드/스크린리더 자동.
          aria-hidden은 부모 role="slider"가 ARIA value를 관리하므로 OK. */}
      {interactive && half && (
        <>
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onMouseEnter={() => onHover(true)}
            onClick={() => onClick(true)}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '50%',
              height: '100%',
              cursor: 'pointer',
              background: 'transparent',
              border: 'none',
              padding: 0,
            }}
          />
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onMouseEnter={() => onHover(false)}
            onClick={() => onClick(false)}
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              width: '50%',
              height: '100%',
              cursor: 'pointer',
              background: 'transparent',
              border: 'none',
              padding: 0,
            }}
          />
        </>
      )}
      {interactive && !half && (
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onMouseEnter={() => onHover(false)}
          onClick={() => onClick(false)}
          style={{
            position: 'absolute',
            inset: 0,
            cursor: 'pointer',
            background: 'transparent',
            border: 'none',
            padding: 0,
          }}
        />
      )}
    </span>
  );
}

const STAR_PATH =
  'M12 2l2.9 6.9 7.4.6-5.7 4.9 1.8 7.2L12 17.7 5.6 21.6l1.8-7.2L1.7 9.5l7.4-.6L12 2z';

function withAlpha(hex: string, alpha: number): string {
  if (!hex.startsWith('#') || hex.length !== 7) return hex;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
