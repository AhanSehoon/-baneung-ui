import { useDayPicker, type MonthCaptionProps } from 'react-day-picker';

import { cn } from '../../lib/cn';

import type * as React from 'react';

/**
 * 한글 월 이름 (1 ~ 12월). 큰 숫자 위 보조 텍스트와 select 옵션에 사용.
 */
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
 * PlannerMonthCaption — `variant='planner'` 캘린더의 상단 캡션.
 *
 * 디자인: 작은 보조 텍스트 (예: "2026년 | 6월") + 매우 큰 월 숫자 ("06").
 * 년/월 선택은 보조 텍스트의 두 영역(년 / 월)에 invisible `<select>`를 오버레이해
 * 클릭 시 OS native picker가 뜨도록 처리.
 *
 * # 왜 native select 오버레이?
 *  - Calendar 본체와 동일한 패턴 유지 → 일관된 UX
 *  - 모바일에서 OS picker (iOS 휠/Android 풀스크린) 자동 활용 → a11y 최선
 *  - 자체 popover/menu 의존성 없음 → 0 추가 deps
 */
export function PlannerMonthCaption({ calendarMonth }: MonthCaptionProps): React.ReactElement {
  const { goToMonth, getModifiers: _getModifiers, ...rest } = useDayPicker();
  const date = calendarMonth.date;
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-indexed

  // startMonth / endMonth 컨텍스트에서 가져옴 (Calendar가 props로 전달했거나 기본 ±10년)
  const startMonth = (rest as { startMonth?: Date }).startMonth;
  const endMonth = (rest as { endMonth?: Date }).endMonth;
  const startYear = startMonth?.getFullYear() ?? year - 10;
  const endYear = endMonth?.getFullYear() ?? year + 10;

  const yearOptions: number[] = [];
  for (let y = startYear; y <= endYear; y++) yearOptions.push(y);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    goToMonth(new Date(year, parseInt(e.target.value, 10), 1));
  };
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    goToMonth(new Date(parseInt(e.target.value, 10), month, 1));
  };

  return (
    <div className="flex justify-center pb-3 pt-1 select-none">
      {/* "2026년 | 6월" — 각 부분이 invisible <select>로 클릭 가능. 큰 숫자 영역은 제거. */}
      <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-foreground-muted">
        {/* 년 */}
        <span className="relative inline-flex h-7 items-center px-2 hover:text-foreground transition-colors">
          {year}년
          <select
            aria-label="년도 선택"
            className={cn(
              'absolute inset-0 z-10 w-full opacity-0 cursor-pointer',
              'appearance-none border-0 bg-transparent',
              '[&>option]:bg-canvas [&>option]:text-foreground',
            )}
            value={year}
            onChange={handleYearChange}
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}년
              </option>
            ))}
          </select>
        </span>
        <span aria-hidden="true" className="text-foreground-subtle">
          |
        </span>
        {/* 월 */}
        <span className="relative inline-flex h-7 items-center px-2 hover:text-foreground transition-colors">
          {MONTH_LABELS_KO[month]}
          <select
            aria-label="월 선택"
            className={cn(
              'absolute inset-0 z-10 w-full opacity-0 cursor-pointer',
              'appearance-none border-0 bg-transparent',
              '[&>option]:bg-canvas [&>option]:text-foreground',
            )}
            value={month}
            onChange={handleMonthChange}
          >
            {MONTH_LABELS_KO.map((label, i) => (
              <option key={i} value={i}>
                {label}
              </option>
            ))}
          </select>
        </span>
      </div>
    </div>
  );
}
