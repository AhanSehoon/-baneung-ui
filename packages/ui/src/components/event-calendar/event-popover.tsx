import * as PopoverPrimitive from '@radix-ui/react-popover';
import { format } from 'date-fns';

import { formatEventTime, isMultiDay } from './event-utils';
import { cn } from '../../lib/cn';

import type { CalendarEvent, EventColor } from './types';
import type * as React from 'react';

const DOT_COLOR_MAP: Record<string, string> = {
  blue: 'bg-info',
  green: 'bg-success',
  red: 'bg-danger',
  amber: 'bg-warning',
  gray: 'bg-foreground-muted',
  purple: 'bg-[#7C3AED]',
};

function ColorDot({ color }: { color?: EventColor }): React.ReactElement {
  const key = color ?? 'blue';
  const cls = DOT_COLOR_MAP[key];
  if (cls) return <span className={cn('size-2 shrink-0 rounded-full', cls)} aria-hidden />;
  // 임의 색
  return (
    <span
      aria-hidden
      className="size-2 shrink-0 rounded-full"
      style={{ backgroundColor: key as string }}
    />
  );
}

export interface MoreEventsPopoverProps {
  /** 트리거 버튼 — "+N 더보기". */
  trigger: React.ReactNode;
  /** 해당 날짜. 헤더 표시용. */
  date: Date;
  /** 그 날짜의 전체 일정 (잘리지 않음). */
  events: CalendarEvent[];
  /** 일정 클릭 시 부모로 위임. */
  onEventClick?: (event: CalendarEvent) => void;
}

/**
 * MoreEventsPopover — 셀에 다 못 들어간 일정을 popover로 전체 표시.
 *
 * 트리거는 "+N 더보기" 텍스트(보통 셀 하단).
 * popover에는 그 날짜의 모든 일정 (range/single 무관).
 */
export function MoreEventsPopover({
  trigger,
  date,
  events,
  onEventClick,
}: MoreEventsPopoverProps): React.ReactElement {
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>{trigger}</PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={4}
          className={cn(
            'z-50 w-64 bg-canvas text-foreground',
            'border border-border-default rounded-none shadow-md',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0',
          )}
        >
          {/* 헤더 — 날짜 */}
          <div className="border-b border-border-default px-3 py-2 text-sm font-medium">
            {format(date, 'M월 d일 (E)')}
          </div>
          {/* 일정 리스트 */}
          <div className="max-h-80 overflow-y-auto p-1">
            {events.length === 0 && (
              <div className="px-2 py-4 text-center text-xs text-foreground-muted">일정 없음</div>
            )}
            {events.map((event) => (
              <button
                key={event.id}
                type="button"
                onClick={() => onEventClick?.(event)}
                className={cn(
                  'flex w-full items-center gap-2 px-2 py-1.5 text-left text-xs',
                  'hover:bg-surface transition-colors',
                  'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
                )}
              >
                <ColorDot color={event.color} />
                {!isMultiDay(event) && !(event.allDay ?? true) && (
                  <span className="tabular-nums text-foreground-muted">
                    {formatEventTime(event)}
                  </span>
                )}
                <span className="truncate">{event.title}</span>
              </button>
            ))}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
