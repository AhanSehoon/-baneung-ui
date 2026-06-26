'use client';

import { useDayPicker, type MonthCaptionProps } from 'react-day-picker';

import { cn } from '../../lib/cn';
import { CaptionPicker } from '../event-calendar/caption-picker';

import type * as React from 'react';

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

/**
 * DatePickerCalendarCaption — DatePicker 내부 Calendar의 커스텀 캡션.
 *
 * 한 줄에 prev 버튼 / 년 picker / 월 picker / next 버튼이 가로 정렬됨.
 * CaptionPicker는 event-calendar 모듈에서 재사용 (디자인 일관성).
 *
 * # 왜 이 캡션을 따로 만드는가
 *  - react-day-picker의 기본 dropdown은 native `<select>` → OS picker라 스타일링 불가
 *  - 기본 nav 버튼은 absolute 위치라 dropdown과 수직 정렬이 미세하게 어긋남
 *  - 한 캡션 안에 [‹ / 년 / 월 / ›] 모두 inline-flex로 묶어 완벽 정렬
 */
export function DatePickerCalendarCaption({
  calendarMonth,
}: MonthCaptionProps): React.ReactElement {
  const { goToMonth, nextMonth, previousMonth } = useDayPicker();
  const date = calendarMonth.date;
  const year = date.getFullYear();
  const monthIdx = date.getMonth();

  const yearOptions: { value: number; label: string }[] = [];
  for (let y = year - 10; y <= year + 10; y++) {
    yearOptions.push({ value: y, label: `${y}년` });
  }
  const monthOptions = MONTH_LABELS_KO.map((label, i) => ({ value: i, label }));

  const navBtnClass = cn(
    'inline-flex size-7 items-center justify-center rounded-none shrink-0',
    'border border-border-default bg-canvas text-foreground hover:bg-surface',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
    'disabled:opacity-40 disabled:pointer-events-none',
  );

  return (
    <div className="flex items-center justify-center gap-1 py-1">
      <button
        type="button"
        aria-label="이전 달"
        disabled={!previousMonth}
        onClick={() => previousMonth && goToMonth(previousMonth)}
        className={navBtnClass}
      >
        ‹
      </button>
      <CaptionPicker
        ariaLabel="년도 선택"
        triggerLabel={`${year}년`}
        value={year}
        options={yearOptions}
        onChange={(y) => goToMonth(new Date(y, monthIdx, 1))}
      />
      <CaptionPicker
        ariaLabel="월 선택"
        triggerLabel={MONTH_LABELS_KO[monthIdx] ?? ''}
        value={monthIdx}
        options={monthOptions}
        onChange={(m) => goToMonth(new Date(year, m, 1))}
      />
      <button
        type="button"
        aria-label="다음 달"
        disabled={!nextMonth}
        onClick={() => nextMonth && goToMonth(nextMonth)}
        className={navBtnClass}
      >
        ›
      </button>
    </div>
  );
}
