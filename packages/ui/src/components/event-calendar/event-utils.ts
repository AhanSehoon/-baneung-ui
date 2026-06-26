import {
  addDays,
  differenceInCalendarDays,
  endOfWeek,
  format,
  isSameDay,
  isWithinInterval,
  max as maxDate,
  min as minDate,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns';

import type { CalendarEvent } from './types';

/**
 * 월간 캘린더 그리드 — 항상 6주 × 7일 = 42 셀.
 * 시작은 해당 월의 첫째 날이 포함된 주의 일요일.
 * 6주 고정으로 매월 레이아웃이 흔들리지 않음 (Google Calendar 패턴).
 *
 * @param month - 표시할 월(임의 날짜 가능, 내부에서 startOfMonth 처리)
 * @returns 6주 배열. 각 주는 [일, 월, ..., 토] 7개 Date.
 */
export function getMonthGrid(month: Date): Date[][] {
  const firstDay = startOfMonth(month);
  // weekStartsOn: 0 (Sunday) — 한국 캘린더 관례
  const gridStart = startOfWeek(firstDay, { weekStartsOn: 0 });
  const weeks: Date[][] = [];
  for (let w = 0; w < 6; w++) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(addDays(gridStart, w * 7 + d));
    }
    weeks.push(week);
  }
  return weeks;
}

/**
 * 일정 segment — 특정 주(week)와 일정(event)의 교집합.
 *
 * 다일 일정이 주 경계를 넘으면 여러 segment로 분할됨.
 * 각 segment는 그 주 내의 시작 컬럼(0~6)과 종료 컬럼(0~6).
 *
 *  - continuesLeft: true면 이 segment의 시작은 일정 진짜 시작이 아님 (이전 주에서 이어짐)
 *  - continuesRight: true면 종료가 진짜 끝이 아님 (다음 주로 이어짐)
 */
export interface EventSegment {
  event: CalendarEvent;
  startCol: number;
  endCol: number;
  continuesLeft: boolean;
  continuesRight: boolean;
}

/**
 * 한 주(week)에 표시할 일정 segment들을 계산.
 *
 *  - 주의 어느 날과도 겹치지 않는 일정은 제외.
 *  - 일정이 주 시작 전에 시작하면 startCol=0 + continuesLeft=true.
 *  - 일정이 주 끝 이후까지 가면 endCol=6 + continuesRight=true.
 */
export function getWeekEventSegments(week: Date[], events: CalendarEvent[]): EventSegment[] {
  if (week.length === 0) return [];
  const weekStartFirst = week[0];
  const weekEndLast = week[6];
  if (!weekStartFirst || !weekEndLast) return [];
  const weekStart = startOfDay(weekStartFirst);
  const weekEnd = endOfWeek(weekEndLast, { weekStartsOn: 0 });
  const segments: EventSegment[] = [];

  for (const event of events) {
    const eventStart = startOfDay(event.start);
    const eventEnd = startOfDay(event.end);
    // 일정이 주 범위와 겹치지 않으면 skip
    if (eventEnd < weekStart || eventStart > weekEnd) continue;

    const segmentStart = maxDate([eventStart, weekStart]);
    const segmentEnd = minDate([eventEnd, startOfDay(weekEndLast)]);

    const startCol = differenceInCalendarDays(segmentStart, weekStart);
    const endCol = differenceInCalendarDays(segmentEnd, weekStart);

    segments.push({
      event,
      startCol: Math.max(0, Math.min(6, startCol)),
      endCol: Math.max(0, Math.min(6, endCol)),
      continuesLeft: eventStart < weekStart,
      continuesRight: eventEnd > startOfDay(weekEndLast),
    });
  }

  return segments;
}

/**
 * 특정 날짜에 해당하는 일정 전체 목록 (range 포함 — 그 날짜를 cover하는 모든 일정).
 * "+N 더보기" 클릭 popover에서 사용.
 */
export function getEventsOnDay(date: Date, events: CalendarEvent[]): CalendarEvent[] {
  const day = startOfDay(date);
  return events.filter((event) => {
    const start = startOfDay(event.start);
    const end = startOfDay(event.end);
    return isWithinInterval(day, { start, end }) || isSameDay(day, start);
  });
}

/**
 * 시간 표시 — "HH:mm" (24h). allDay면 빈 문자열.
 */
export function formatEventTime(event: CalendarEvent): string {
  if (event.allDay ?? true) return '';
  return format(event.start, 'HH:mm');
}

/**
 * 다일 일정 여부.
 */
export function isMultiDay(event: CalendarEvent): boolean {
  return !isSameDay(event.start, event.end);
}
