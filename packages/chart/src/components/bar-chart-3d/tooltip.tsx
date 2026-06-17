import { cn } from '../../lib/cn';

import type * as React from 'react';

export interface TooltipState {
  /** 표시 여부. */
  visible: boolean;
  /** 화면 좌표 (px). */
  x: number;
  /** 화면 좌표 (px). */
  y: number;
  /** 첫 줄 (라벨). */
  label: string;
  /** 둘째 줄 (값). */
  value: number;
}

export interface TooltipProps {
  state: TooltipState;
}

/**
 * 막대 hover 시 표시되는 HTML 툴팁.
 *
 * # 왜 HTML인가 (Three.js Text 대신)
 * - 화면 좌표 기반 표시가 직관적 (마우스 옆에 띄우기 쉬움)
 * - 한글 폰트가 즉시 동작 (Pretendard 그대로)
 * - 접근성: 보조 기술이 일반 DOM은 읽지만 WebGL은 못 읽음
 *
 * # position: fixed
 * Canvas wrapper 안에 absolute로 두면 OrbitControls 중에 위치가 어긋남.
 * 화면 절대 좌표(fixed)로 두고 부모가 마우스 이벤트로 좌표 갱신.
 *
 * # 마우스 포커스 차단
 * pointer-events-none — 툴팁이 hover를 가로채 깜빡임 발생하는 걸 방지.
 */
export function Tooltip({ state }: TooltipProps): React.ReactElement | null {
  if (!state.visible) return null;
  return (
    <div
      role="tooltip"
      className={cn(
        'pointer-events-none fixed z-50',
        'rounded-none border border-border-default bg-canvas px-3 py-2 text-sm shadow-md',
        'min-w-24',
      )}
      style={{
        // 마우스 우상단에 약간 떨어뜨려 표시
        left: state.x + 12,
        top: state.y - 12,
      }}
    >
      <div className="font-medium text-foreground">{state.label}</div>
      <div className="text-foreground-muted">
        {/* 천 단위 콤마 — 정수/소수 모두 가독성 향상 */}
        {state.value.toLocaleString('ko-KR')}
      </div>
    </div>
  );
}
