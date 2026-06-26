import { formatEventTime, isMultiDay } from './event-utils';
import { cn } from '../../lib/cn';

import type { LaidOutSegment } from './event-layout';
import type { CalendarEvent, EventColor } from './types';
import type * as React from 'react';

/**
 * 색상 키 → Tailwind 클래스 매핑. 토큰 시맨틱 색을 우선 사용.
 * 'gray'는 surface 톤 (강조 약함). 임의 string은 fallback으로 inline style 처리.
 */
const COLOR_MAP: Record<string, { bg: string; text: string; dot: string }> = {
  blue: { bg: 'bg-info/15 hover:bg-info/25', text: 'text-info', dot: 'bg-info' },
  green: {
    bg: 'bg-success/15 hover:bg-success/25',
    text: 'text-success',
    dot: 'bg-success',
  },
  red: { bg: 'bg-danger/15 hover:bg-danger/25', text: 'text-danger', dot: 'bg-danger' },
  amber: {
    bg: 'bg-warning/15 hover:bg-warning/25',
    text: 'text-warning',
    dot: 'bg-warning',
  },
  gray: {
    bg: 'bg-surface hover:bg-surface-strong',
    text: 'text-foreground',
    dot: 'bg-foreground-muted',
  },
  purple: {
    bg: 'bg-[#7C3AED]/15 hover:bg-[#7C3AED]/25',
    text: 'text-[#7C3AED]',
    dot: 'bg-[#7C3AED]',
  },
};

/**
 * 색상 키 또는 임의 string → 시각 토큰 반환. 임의 string은 hex/css color로 간주.
 */
function resolveColor(color: EventColor | undefined) {
  const key = color ?? 'blue';
  if (key in COLOR_MAP) {
    const m = COLOR_MAP[key];
    if (m) return { ...m, customColor: undefined };
  }
  // 임의 색 — inline style fallback (배경 15% alpha 적용은 불가, opaque bg)
  return {
    bg: '',
    text: '',
    dot: '',
    customColor: key as string,
  };
}

export interface EventSegmentBarProps {
  segment: LaidOutSegment;
  /** 한 lane의 높이 (px). */
  laneHeight: number;
  /** lane 간 간격 (px). */
  laneGap: number;
  /** caption 영역 높이 — 첫 번째 lane이 시작하는 위치 (px). */
  topOffset: number;
  /** 클릭 핸들러 — 부모로 위임. */
  onClick?: (event: CalendarEvent) => void;
  /** 드래그 시작 — 부모가 dragging 상태 추적용. */
  onDragStart?: (event: CalendarEvent) => void;
  /** 드래그 종료 — 부모가 dragging 상태 해제. */
  onDragEnd?: () => void;
  /** 드래그 가능 여부 (HTML5 native DnD). */
  draggable?: boolean;
}

/**
 * EventSegmentBar — 한 주 안에서 일정의 가로 막대 렌더링.
 *
 *  - 다일 range: 가로 막대, 시작/종료 모서리에 따라 rounded 여부 결정
 *    - continuesLeft면 왼쪽 모서리 flat + 좌측 borderless / 아니면 rounded
 *    - continuesRight도 동일
 *  - 1일짜리: 동일하게 막대로 표시 (소비자가 시각 통일 선호 가정)
 *  - 시간 있는 일정: 제목 앞에 "HH:mm" 표시
 *
 * 절대 위치 — `EventWeek`의 overlay layer 안에 배치.
 *  - left: `(startCol / 7) * 100%`
 *  - width: `((endCol - startCol + 1) / 7) * 100%`
 *  - top: `topOffset + lane * (laneHeight + laneGap)`
 */
export function EventSegmentBar({
  segment,
  laneHeight,
  laneGap,
  topOffset,
  onClick,
  onDragStart,
  onDragEnd,
  draggable,
}: EventSegmentBarProps): React.ReactElement {
  const { event, startCol, endCol, continuesLeft, continuesRight, lane } = segment;
  const colors = resolveColor(event.color);
  const time = formatEventTime(event);
  const multi = isMultiDay(event);

  // 위치 계산 — 7컬럼 그리드, 1px씩 좌우 inset으로 셀 보더와 겹침 방지
  const leftPercent = (startCol / 7) * 100;
  const widthPercent = ((endCol - startCol + 1) / 7) * 100;
  const top = topOffset + lane * (laneHeight + laneGap);

  const handleClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
    onClick?.(event);
  };

  // HTML5 native drag — 셀의 onDragOver/onDrop이 dataTransfer.event-id를 읽어 처리
  const handleDragStart = (e: React.DragEvent): void => {
    if (!draggable) return;
    e.dataTransfer.setData('application/x-event-id', event.id);
    e.dataTransfer.effectAllowed = 'move';
    onDragStart?.(event);
  };

  const handleDragEnd = (): void => {
    onDragEnd?.();
  };

  // <button>은 일부 브라우저에서 native draggable 동작이 불안정 → role=button div 사용.
  // 키보드 접근성은 tabIndex + onKeyDown로 별도 처리.
  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(event);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      title={`${time ? time + ' ' : ''}${event.title}`}
      className={cn(
        'absolute z-10 flex items-center gap-1 overflow-hidden text-left',
        'px-1.5 text-xs font-medium transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring',
        'cursor-pointer select-none',
        // rounded 모서리 — 진짜 시작/종료에만 적용
        !continuesLeft && 'rounded-l-sm',
        !continuesRight && 'rounded-r-sm',
        multi && 'min-w-0',
        colors.bg,
        colors.text,
        draggable && 'cursor-grab active:cursor-grabbing',
      )}
      style={{
        left: `calc(${leftPercent}% + 2px)`,
        width: `calc(${widthPercent}% - 4px)`,
        top,
        height: laneHeight,
        ...(colors.customColor && {
          backgroundColor: colors.customColor + '26', // ~15% alpha
          color: colors.customColor,
        }),
      }}
    >
      {/* 시간 표시 (있을 때만) */}
      {time && <span className="font-semibold tabular-nums">{time}</span>}
      <span className="truncate">{event.title}</span>
      {/* 연속 표시 화살표 */}
      {continuesLeft && (
        <span aria-hidden className="absolute left-0.5 opacity-60">
          ◀
        </span>
      )}
      {continuesRight && (
        <span aria-hidden className="absolute right-0.5 opacity-60">
          ▶
        </span>
      )}
    </div>
  );
}
