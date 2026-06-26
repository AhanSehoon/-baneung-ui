import { isSameDay, isSameMonth } from 'date-fns';

import { assignLanes, countHiddenAtColumn, type LaidOutSegment } from './event-layout';
import { MoreEventsPopover } from './event-popover';
import { EventSegmentBar } from './event-segment';
import { getEventsOnDay, getWeekEventSegments } from './event-utils';
import { cn } from '../../lib/cn';

import type { CalendarEvent } from './types';
import type * as React from 'react';

const LANE_HEIGHT = 20; // px
const LANE_GAP = 2; // px
const DAY_NUMBER_HEIGHT = 28; // px — 셀 상단 날짜 숫자 영역
const MORE_BUTTON_HEIGHT = 18; // px — "+N 더보기" 줄

export interface EventWeekRowProps {
  /** 7개 날짜 (일~토). */
  week: Date[];
  /** 표시 중인 월 — outside 날짜 색상 구분용. */
  displayMonth: Date;
  /** 전체 일정. */
  events: CalendarEvent[];
  /** 셀당 최대 표시 lane 수. 초과 시 "+N 더보기". */
  maxVisible: number;
  /** 일정 클릭 핸들러. */
  onEventClick?: (event: CalendarEvent) => void;
  /** 드래그-드롭 활성 여부. */
  draggable?: boolean;
  /** 드래그 시작 — dataTransfer.event-id를 부모가 trackable하게. */
  onEventDragStart?: (event: CalendarEvent) => void;
  /** 드래그 종료. */
  onEventDragEnd?: () => void;
  /** 드롭 대상 날짜. dataTransfer에서 event-id 읽어 부모가 처리. */
  onDayDrop?: (date: Date, eventId: string) => void;
}

/**
 * EventWeekRow — 한 주(7일) 렌더링.
 *
 * 구조:
 *  ┌─ relative wrapper (높이 = day_num + maxLane × (lane_height + gap) + more_btn)
 *  │  ├─ 7개 day cell (배경 + 보더 + 날짜 숫자 좌상단)
 *  │  └─ absolute overlay (모든 event segment bars)
 *  │      └─ "+N 더보기" trigger (셀별, lane이 maxVisible 초과 시)
 *  └─
 *
 * lane 할당은 주 단위로 한 번 계산 → 모든 셀에 동일 적용.
 */
export function EventWeekRow({
  week,
  displayMonth,
  events,
  maxVisible,
  onEventClick,
  draggable,
  onEventDragStart,
  onEventDragEnd,
  onDayDrop,
}: EventWeekRowProps): React.ReactElement {
  const segments = assignLanes(getWeekEventSegments(week, events));

  // 그려질 lane 수 — maxVisible로 cap. 셀 높이 계산용.
  const visibleSegments = segments.filter((s) => s.lane < maxVisible);
  const displayedLanes = Math.min(maxVisible, Math.max(0, ...segments.map((s) => s.lane + 1)));

  // 셀 최소 높이: 날짜 숫자(28) + displayed lanes + "+N" 줄 여유(18)
  const rowMinHeight =
    DAY_NUMBER_HEIGHT + displayedLanes * (LANE_HEIGHT + LANE_GAP) + MORE_BUTTON_HEIGHT;

  return (
    <div className="relative flex w-full" style={{ minHeight: rowMinHeight }}>
      {/* 배경 셀 — 7개 */}
      {week.map((day, colIdx) => {
        const outside = !isSameMonth(day, displayMonth);
        const today = isSameDay(day, new Date());
        const hidden = countHiddenAtColumn(segments, colIdx, maxVisible);
        return (
          <DayCell
            key={day.toISOString()}
            day={day}
            colIdx={colIdx}
            outside={outside}
            today={today}
            hiddenCount={hidden}
            allEventsOnDay={hidden > 0 ? getEventsOnDay(day, events) : []}
            onEventClick={onEventClick}
            onDrop={onDayDrop}
            draggable={!!draggable}
          />
        );
      })}
      {/* 일정 bar overlay */}
      <div className="pointer-events-none absolute inset-0">
        {visibleSegments.map((seg) => (
          <SegmentWrapper key={seg.event.id + '-' + seg.startCol}>
            <EventSegmentBar
              segment={seg}
              laneHeight={LANE_HEIGHT}
              laneGap={LANE_GAP}
              topOffset={DAY_NUMBER_HEIGHT}
              onClick={onEventClick}
              onDragStart={onEventDragStart}
              onDragEnd={onEventDragEnd}
              draggable={draggable}
            />
          </SegmentWrapper>
        ))}
      </div>
    </div>
  );
}

/**
 * pointer-events-auto wrapper — overlay layer가 pointer-events-none이므로
 * 자식 bar만 클릭 받도록 wrap. (셀 background는 클릭/드롭 받기 위함.)
 */
function SegmentWrapper({ children }: { children: React.ReactNode }): React.ReactElement {
  return <div className="pointer-events-auto">{children}</div>;
}

interface DayCellProps {
  day: Date;
  colIdx: number;
  outside: boolean;
  today: boolean;
  hiddenCount: number;
  allEventsOnDay: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onDrop?: (date: Date, eventId: string) => void;
  draggable: boolean;
}

/**
 * DayCell — 단일 날짜 셀. 보더, 날짜 숫자, "+N 더보기" 트리거.
 */
function DayCell({
  day,
  colIdx,
  outside,
  today,
  hiddenCount,
  allEventsOnDay,
  onEventClick,
  onDrop,
  draggable,
}: DayCellProps): React.ReactElement {
  const dow = day.getDay();
  const dayColor =
    dow === 0
      ? 'text-danger' // 일요일
      : dow === 6
        ? 'text-info' // 토요일
        : 'text-foreground';

  const handleDragOver = (e: React.DragEvent): void => {
    if (!draggable) return;
    e.preventDefault(); // 필수 — drop 허용
    e.dataTransfer.dropEffect = 'move';
  };
  const handleDrop = (e: React.DragEvent): void => {
    if (!draggable) return;
    e.preventDefault();
    const eventId = e.dataTransfer.getData('application/x-event-id');
    if (!eventId) return;
    onDrop?.(day, eventId);
  };

  return (
    <div
      data-date={day.toISOString()}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={cn(
        'relative flex-1 border-r border-b border-border-default',
        colIdx === 0 && 'border-l',
        outside && 'bg-surface/40',
      )}
    >
      {/* 날짜 숫자 — 좌상단 */}
      <div
        className={cn(
          'flex items-center justify-end px-2 pt-1.5 text-xs font-medium tabular-nums',
          dayColor,
          outside && 'opacity-40',
          today && 'font-bold',
        )}
      >
        {today && (
          <span
            aria-label="오늘"
            className="mr-1 inline-flex size-5 items-center justify-center rounded-full bg-foreground text-foreground-inverse"
          >
            {day.getDate()}
          </span>
        )}
        {!today && day.getDate()}
      </div>
      {/* "+N 더보기" — hiddenCount > 0이면 셀 하단에 */}
      {hiddenCount > 0 && (
        <div className="absolute bottom-0 left-0 right-0 px-1.5 pb-1">
          <MoreEventsPopover
            date={day}
            events={allEventsOnDay}
            onEventClick={onEventClick}
            trigger={
              <button
                type="button"
                className={cn(
                  'block w-full text-left text-[11px] text-foreground-muted',
                  'hover:text-foreground hover:bg-surface px-1 py-0.5',
                  'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
                )}
              >
                +{hiddenCount} 더보기
              </button>
            }
          />
        </div>
      )}
    </div>
  );
}

export { LANE_HEIGHT, LANE_GAP, DAY_NUMBER_HEIGHT, MORE_BUTTON_HEIGHT };
export type { LaidOutSegment };
