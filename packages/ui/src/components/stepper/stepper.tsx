import { useReducedMotion } from '../../lib/use-reduced-motion';

import type { StepperProps, StepperSize } from './types';
import type * as React from 'react';

const SIZE_MAP: Record<
  StepperSize,
  { circle: number; font: number; labelGap: number; bar: number }
> = {
  sm: { circle: 24, font: 12, labelGap: 6, bar: 2 },
  md: { circle: 32, font: 14, labelGap: 8, bar: 2 },
  lg: { circle: 40, font: 16, labelGap: 10, bar: 3 },
};

/**
 * Stepper — 다단계 진행 표시기 (1 → 2 → 3).
 *
 * # 단계 상태
 * - completed: index < current — 체크 아이콘 + 채워진 연결선
 * - active:    index === current — 강조된 숫자 + 외곽선
 * - upcoming:  index > current — 흐린 숫자 + 점선/비활성 연결선
 *
 * # 방향
 * - horizontal: 가로 배치, 연결선이 좌→우
 * - vertical: 세로 배치, 연결선이 위→아래
 *
 * # ARIA
 * - 컨테이너 `role="list"` + `aria-label`
 * - 각 단계 `role="listitem"` + `aria-current="step"` (active일 때)
 * - 클릭 가능한 경우 native button → 키보드 자동 지원
 *
 * # a11y
 * - `prefers-reduced-motion: reduce` 시 연결선/아이콘 transition 비활성
 */
export function Stepper({
  steps,
  current,
  orientation = 'horizontal',
  size = 'md',
  activeColor = '#1F2937',
  inactiveColor = '#CED4DA',
  duration = 400,
  onStepClick,
  className,
  style,
}: StepperProps) {
  const reduced = useReducedMotion();
  const dims = SIZE_MAP[size];
  const isHorizontal = orientation === 'horizontal';
  const interactive = !!onStepClick;

  return (
    <ol
      aria-label="진행 단계"
      className={className}
      style={{
        display: 'flex',
        flexDirection: isHorizontal ? 'row' : 'column',
        alignItems: isHorizontal ? 'flex-start' : 'stretch',
        gap: 0,
        listStyle: 'none',
        margin: 0,
        padding: 0,
        ...style,
      }}
    >
      {steps.map((step, i) => {
        const isCompleted = i < current;
        const isActive = i === current;
        const isLast = i === steps.length - 1;
        const stateColor = isCompleted || isActive ? activeColor : inactiveColor;

        return (
          <li
            key={i}
            aria-current={isActive ? 'step' : undefined}
            style={{
              display: 'flex',
              flexDirection: isHorizontal ? 'column' : 'row',
              alignItems: isHorizontal ? 'center' : 'flex-start',
              flex: isLast ? '0 0 auto' : 1,
              minWidth: 0,
              gap: isHorizontal ? 0 : dims.labelGap,
            }}
          >
            {/* circle + connector wrapper */}
            <div
              style={{
                display: 'flex',
                flexDirection: isHorizontal ? 'row' : 'column',
                alignItems: 'center',
                width: isHorizontal ? '100%' : 'auto',
                flexShrink: 0,
              }}
            >
              {/* step circle */}
              {interactive ? (
                <button
                  type="button"
                  onClick={() => onStepClick(i)}
                  aria-label={`단계 ${i + 1}${isActive ? ' (현재)' : isCompleted ? ' (완료)' : ''}`}
                  style={circleStyle({
                    size: dims.circle,
                    font: dims.font,
                    isCompleted,
                    isActive,
                    stateColor,
                    activeColor,
                    reduced,
                    duration,
                    interactive: true,
                  })}
                >
                  <StepIcon index={i} isCompleted={isCompleted} customIcon={step.icon} />
                </button>
              ) : (
                <span
                  aria-hidden="true"
                  style={circleStyle({
                    size: dims.circle,
                    font: dims.font,
                    isCompleted,
                    isActive,
                    stateColor,
                    activeColor,
                    reduced,
                    duration,
                    interactive: false,
                  })}
                >
                  <StepIcon index={i} isCompleted={isCompleted} customIcon={step.icon} />
                </span>
              )}

              {/* 연결선 — 마지막 단계 뒤엔 없음 */}
              {!isLast && (
                <span
                  aria-hidden="true"
                  style={{
                    position: 'relative',
                    flex: 1,
                    height: isHorizontal ? dims.bar : undefined,
                    width: isHorizontal ? undefined : dims.bar,
                    minHeight: isHorizontal ? undefined : 24,
                    background: inactiveColor,
                    margin: isHorizontal ? `0 8px` : `8px 0`,
                    overflow: 'hidden',
                  }}
                >
                  {/* 채움 — completed면 100%, 아니면 0% */}
                  <span
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: activeColor,
                      transformOrigin: isHorizontal ? 'left' : 'top',
                      transform: isCompleted
                        ? 'scale(1)'
                        : isHorizontal
                          ? 'scaleX(0)'
                          : 'scaleY(0)',
                      transition: reduced
                        ? undefined
                        : `transform ${duration}ms cubic-bezier(.4,0,.2,1)`,
                    }}
                  />
                </span>
              )}
            </div>

            {/* 라벨 + 설명 */}
            <div
              style={{
                marginTop: isHorizontal ? dims.labelGap : 0,
                paddingLeft: isHorizontal ? 0 : 0,
                paddingBottom: !isHorizontal && !isLast ? 24 : 0,
                textAlign: isHorizontal ? 'center' : 'left',
                color: isActive ? activeColor : isCompleted ? activeColor : '#6B7280',
                fontSize: dims.font,
                fontWeight: isActive ? 700 : 500,
                lineHeight: 1.3,
                flex: isHorizontal ? undefined : 1,
                minWidth: 0,
              }}
            >
              <div style={{ wordBreak: 'keep-all' }}>{step.label}</div>
              {step.description && (
                <div
                  style={{
                    marginTop: 2,
                    fontSize: dims.font - 2,
                    fontWeight: 400,
                    color: '#9CA5B3',
                  }}
                >
                  {step.description}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function circleStyle({
  size,
  font,
  isCompleted,
  isActive,
  stateColor,
  activeColor,
  reduced,
  duration,
  interactive,
}: {
  size: number;
  font: number;
  isCompleted: boolean;
  isActive: boolean;
  stateColor: string;
  activeColor: string;
  reduced: boolean;
  duration: number;
  interactive: boolean;
}): React.CSSProperties {
  return {
    width: size,
    height: size,
    flexShrink: 0,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: isCompleted ? stateColor : 'transparent',
    color: isCompleted ? '#FFFFFF' : isActive ? activeColor : stateColor,
    border: `2px solid ${stateColor}`,
    borderRadius: '50%',
    fontSize: font,
    fontWeight: 700,
    cursor: interactive ? 'pointer' : 'default',
    padding: 0,
    transition: reduced
      ? undefined
      : `background ${duration}ms ease, color ${duration}ms ease, border-color ${duration}ms ease, transform 200ms ease`,
    transform: isActive ? 'scale(1.05)' : 'scale(1)',
  };
}

function StepIcon({
  index,
  isCompleted,
  customIcon,
}: {
  index: number;
  isCompleted: boolean;
  customIcon?: React.ReactNode;
}) {
  if (customIcon) return <>{customIcon}</>;
  if (isCompleted) {
    return (
      <svg
        width="60%"
        height="60%"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        aria-hidden="true"
      >
        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return <span aria-hidden="true">{index + 1}</span>;
}
