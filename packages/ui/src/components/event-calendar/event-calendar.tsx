'use client';

import { addMonths, differenceInDays, startOfMonth, subMonths } from 'date-fns';
import { enUS, ja, ko, zhCN } from 'date-fns/locale';
import * as React from 'react';

import { CaptionPicker } from './caption-picker';
import { getMonthGrid } from './event-utils';
import { EventWeekRow } from './event-week';
import { cn } from '../../lib/cn';
import { useControllableState } from '../../lib/use-controllable-state';

import type { CalendarProps } from './types';
import type { Day } from 'date-fns';

const LOCALE_MAP = { ko, en: enUS, ja, 'zh-CN': zhCN } as const;

const MONTH_LABELS_KO = [
  '1월',
  '2월',
  '3월',
  '4월',
  '5월',
  '6월',
  '7월',
  '8월',
  '9월',
  '10월',
  '11월',
  '12월',
];
const WEEKDAY_KO = ['일', '월', '화', '수', '목', '금', '토'];

/**
 * Calendar — 월간 일정 캘린더 (Google Calendar 월간 뷰 스타일).
 *
 * # 핵심 기능
 *  - 1일 일정: 셀 안에 색상 도트 + 제목
 *  - 다일 range 일정: 가로 막대로 여러 셀에 걸쳐 표시
 *  - 주 경계 분할: range가 주를 넘으면 ◀ / ▶ 표시로 연속성 시각화
 *  - 다중 lane: 동일 셀에 여러 일정 → 세로로 스택 (greedy 알고리즘)
 *  - "+N 더보기" popover: 셀당 maxVisible 초과 시
 *  - 드래그-드롭 이동: `onEventMove` 함수 전달 시 활성
 *  - 한글 기본, locale prop으로 다국어
 *
 * # 사용 예
 *   <Calendar
 *     events={[
 *       { id: '1', start: new Date('2026-06-15'), end: new Date('2026-06-15'),
 *         title: '회의', color: 'blue', allDay: true },
 *       { id: '2', start: new Date('2026-06-20'), end: new Date('2026-06-23'),
 *         title: '워크샵', color: 'green' },
 *     ]}
 *     onEventClick={(e) => console.log(e)}
 *     onEventMove={(e, start, end) => updateEvent(e.id, { start, end })}
 *   />
 */
export function Calendar({
  events,
  month: monthProp,
  defaultMonth,
  onMonthChange,
  onEventClick,
  onEventMove,
  maxVisible = 3,
  locale,
  className,
}: CalendarProps): React.ReactElement {
  const [month, setMonth] = useControllableState<Date>({
    prop: monthProp,
    defaultProp: defaultMonth ?? startOfMonth(new Date()),
    onChange: onMonthChange,
  });

  const currentMonth = month ?? startOfMonth(new Date());
  const year = currentMonth.getFullYear();
  const monthIdx = currentMonth.getMonth();

  const weeks = React.useMemo(() => getMonthGrid(currentMonth), [currentMonth]);

  // 년/월 dropdown 옵션
  const yearOptions = React.useMemo(() => {
    const list: number[] = [];
    for (let y = year - 10; y <= year + 10; y++) list.push(y);
    return list;
  }, [year]);

  // 드래그-드롭 — onEventMove가 있을 때만 활성.
  // HTML5 native drag로 처리: EventSegmentBar onDragStart가 dataTransfer.event-id 설정,
  // DayCell onDrop이 eventId 읽어 여기로 위임.
  const draggable = !!onEventMove;

  const handleDayDrop = (date: Date, eventId: string): void => {
    if (!onEventMove) return;
    const event = events.find((ev) => ev.id === eventId);
    if (!event) return;
    const duration = differenceInDays(event.end, event.start);
    const newStart = new Date(date);
    newStart.setHours(event.start.getHours(), event.start.getMinutes(), 0, 0);
    const newEnd = new Date(newStart);
    newEnd.setDate(newEnd.getDate() + duration);
    onEventMove(event, newStart, newEnd);
  };

  // locale 해석 (현재는 weekday 표시에만 사용 — 한글 고정 디자인)
  const resolvedLocale =
    typeof locale === 'string' && locale in LOCALE_MAP
      ? LOCALE_MAP[locale as keyof typeof LOCALE_MAP]
      : ((locale as typeof ko | undefined) ?? ko);

  // 한글이 아닌 locale이면 date-fns의 localized weekday short name 사용.
  // date-fns Day 타입은 0|1|2|3|4|5|6 union이라 number 캐스팅 필요.
  const weekdayLabels =
    resolvedLocale === ko
      ? WEEKDAY_KO
      : Array.from({ length: 7 }, (_, i) => {
          const dow = i as Day;
          return resolvedLocale.localize?.day(dow, { width: 'short' }) ?? WEEKDAY_KO[i] ?? '';
        });

  const handlePrev = (): void => {
    setMonth(subMonths(currentMonth, 1));
  };
  const handleNext = (): void => {
    setMonth(addMonths(currentMonth, 1));
  };

  return (
    <div className={cn('w-full bg-canvas text-foreground p-4', className)}>
      {/* 캡션 — 년/월 + prev/next */}
      <div className="relative flex items-center justify-center pb-3 select-none">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="이전 달"
          className={cn(
            'absolute left-0 inline-flex size-7 items-center justify-center rounded-none',
            'border border-border-default bg-canvas text-foreground hover:bg-surface',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          )}
        >
          ‹
        </button>
        <div className="flex items-center gap-1">
          <CaptionPicker
            ariaLabel="년도 선택"
            triggerLabel={`${year}년`}
            value={year}
            options={yearOptions.map((y) => ({ value: y, label: `${y}년` }))}
            onChange={(y) => setMonth(new Date(y, monthIdx, 1))}
          />
          <span aria-hidden className="text-foreground-subtle text-sm">
            |
          </span>
          <CaptionPicker
            ariaLabel="월 선택"
            triggerLabel={MONTH_LABELS_KO[monthIdx] ?? ''}
            value={monthIdx}
            options={MONTH_LABELS_KO.map((label, i) => ({ value: i, label }))}
            onChange={(m) => setMonth(new Date(year, m, 1))}
          />
        </div>
        <button
          type="button"
          onClick={handleNext}
          aria-label="다음 달"
          className={cn(
            'absolute right-0 inline-flex size-7 items-center justify-center rounded-none',
            'border border-border-default bg-canvas text-foreground hover:bg-surface',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          )}
        >
          ›
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="flex border-b border-border-default">
        {weekdayLabels.map((label, i) => (
          <div
            key={i}
            className={cn(
              'flex-1 text-[11px] font-medium uppercase tracking-[0.15em] py-2 text-center',
              i === 0 && 'text-danger',
              i === 6 && 'text-info',
              i !== 0 && i !== 6 && 'text-foreground-muted',
            )}
          >
            {label}
          </div>
        ))}
      </div>

      {/* 6 주 그리드 */}
      <div className="flex flex-col">
        {weeks.map((week, wIdx) => (
          <EventWeekRow
            key={wIdx}
            week={week}
            displayMonth={currentMonth}
            events={events}
            maxVisible={maxVisible}
            onEventClick={onEventClick}
            draggable={draggable}
            onDayDrop={handleDayDrop}
          />
        ))}
      </div>
    </div>
  );
}
