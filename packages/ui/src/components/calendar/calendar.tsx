import { enUS, ja, ko, zhCN } from 'date-fns/locale';
import { DayPicker, type DayPickerProps } from 'react-day-picker';

import { PlannerMonthCaption } from './planner-caption';
import { cn } from '../../lib/cn';

import type * as React from 'react';

/**
 * 내장 단축 로케일 키. 그 외 언어는 date-fns Locale 객체를 직접 전달.
 *
 * @example 추가 언어 사용
 *   import { fr } from 'date-fns/locale';
 *   <Calendar locale={fr} />
 */
export type CalendarLocale = 'ko' | 'en' | 'ja' | 'zh-CN';

/**
 * Calendar 시각 variant.
 *  - `'compact'`(기본) — 작은 인라인 캘린더. DatePicker popover 등에 적합.
 *  - `'planner'` — 큰 월 숫자 + 보조 텍스트 + 셀별 보더가 있는 벽걸이/월간 계획표 스타일.
 *    각 셀이 크고 일정/메모 영역으로 활용 가능 (자식으로 컨텐츠 주입 가능 — `<Calendar.Day>` 패턴 추후 확장).
 */
export type CalendarVariant = 'compact' | 'planner';

/**
 * DayPickerProps는 mode("single"|"multiple"|"range"|undefined)에 따른
 * discriminated union이므로, 표준 Omit을 쓰면 디스크리미네이션이 풀려
 * `selected`/`onSelect` 등 분기별 prop이 사라진다. distributive Omit으로
 * 각 union 멤버에 개별적으로 Omit을 적용해 분기를 보존.
 */
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

export type CalendarProps = DistributiveOmit<DayPickerProps, 'locale'> & {
  /**
   * 표시 로케일. 단축 키워드 또는 date-fns Locale 객체.
   * - 단축: 'ko'(기본 · 한글) | 'en' | 'ja' | 'zh-CN'
   * - 그 외 언어: `date-fns/locale`에서 import해 객체 전달 (예: `import { fr } from 'date-fns/locale'`)
   *
   * 한국 사용자 대상 디자인 시스템이라 기본값은 'ko'.
   * 글로벌 앱은 라우트/세션 언어를 prop으로 전달하면 됨.
   */
  locale?: CalendarLocale | DayPickerProps['locale'];
  /**
   * 시각 variant. 기본 'compact'.
   * planner는 큰 월 숫자 + 보더가 있는 큰 셀의 벽걸이 캘린더 스타일.
   */
  variant?: CalendarVariant;
};

const localeMap = { ko, en: enUS, ja, 'zh-CN': zhCN } as const;

/**
 * planner variant — 단일 글자 한글 요일 (일/월/화/수/목/금/토).
 * 표시는 항상 한글 단축형 (vs Locale에 의존하지 않음). 다국어 시 일반 weekday 사용.
 */
const PLANNER_WEEKDAY_KO = ['일', '월', '화', '수', '목', '금', '토'];

/**
 * Calendar — react-day-picker 래퍼.
 *
 * # 모드 (`mode`)
 *  - `mode="single"` (기본 — DatePicker가 사용)
 *  - `mode="multiple"` — 여러 날짜
 *  - `mode="range"` — 시작/종료 범위
 *
 * # variant (`variant`)
 *  - `'compact'`(기본) — 인라인 작은 캘린더
 *  - `'planner'` — 벽걸이/월간 계획표 스타일 (큰 월 숫자 + 보더 셀 + 주말 색상)
 *
 * # 캡션 레이아웃 (`captionLayout`) — compact variant 전용
 *  - `'dropdown'` (기본) — 월/년 native `<select>` 드롭다운
 *  - `'label'` — `← | 2026년 6월 | →` 단순 텍스트 + 좌/우 nav 버튼
 *  - planner variant는 자체 캡션 사용 (captionLayout 무시)
 *
 * # i18n
 *  - 기본 한국어. `locale` prop으로 언어 교체.
 *  - planner variant는 한글 단축 요일 고정. 다국어 weekday가 필요하면 compact 사용.
 */
export function Calendar({
  className,
  classNames,
  locale = 'ko',
  captionLayout = 'dropdown',
  startMonth,
  endMonth,
  hideNavigation,
  variant = 'compact',
  components,
  formatters,
  modifiers,
  modifiersClassNames,
  ...props
}: CalendarProps): React.ReactElement {
  // 'ko' | 'en' | 'ja' | 'zh-CN' 단축 키워드 → date-fns Locale 객체로 매핑
  const resolvedLocale =
    typeof locale === 'string' && locale in localeMap
      ? localeMap[locale as CalendarLocale]
      : (locale as DayPickerProps['locale']);

  // dropdown caption은 startMonth/endMonth 범위가 필요. 미지정 시 현재 ±10년으로 기본 제공.
  const now = new Date();
  const defaultStartMonth = startMonth ?? new Date(now.getFullYear() - 10, 0);
  const defaultEndMonth = endMonth ?? new Date(now.getFullYear() + 10, 11);

  const isPlanner = variant === 'planner';

  // dropdown 모드 여부 (compact 전용 — planner는 자체 캡션)
  const isDropdownMode =
    !isPlanner && typeof captionLayout === 'string' && captionLayout.startsWith('dropdown');

  // dropdown 모드 기본은 nav 숨김 (dropdowns가 빠른 점프 담당, 화살표 중복).
  // 단, 소비자가 명시적으로 `hideNavigation`을 지정하면 그것을 우선.
  // planner는 자체 캡션에 년/월 선택 포함 → 항상 nav 숨김.
  const hideNav = hideNavigation ?? (isPlanner || isDropdownMode);

  // planner variant: weekend 색상 modifier 자동 적용
  const plannerModifiers = isPlanner
    ? {
        sunday: (date: Date) => date.getDay() === 0,
        saturday: (date: Date) => date.getDay() === 6,
        ...modifiers,
      }
    : modifiers;

  const plannerModifiersClassNames = isPlanner
    ? {
        sunday: '[&>button]:text-danger',
        saturday: '[&>button]:text-info',
        ...modifiersClassNames,
      }
    : modifiersClassNames;

  // planner variant: 한글 단축 요일 사용 (일/월/화/수/목/금/토)
  // PLANNER_WEEKDAY_KO[0..6]은 항상 string이지만 TS는 noUncheckedIndexedAccess로 string|undefined 추론.
  // formatWeekdayName 시그니처는 string 반환 요구 → '' 폴백으로 좁힘 (실제로는 도달 불가).
  const plannerFormatters = isPlanner
    ? {
        formatWeekdayName: (weekday: Date) => PLANNER_WEEKDAY_KO[weekday.getDay()] ?? '',
        ...formatters,
      }
    : formatters;

  // planner variant: 자체 MonthCaption 컴포넌트 주입 (큰 월 숫자 + 보조 텍스트 + 선택)
  const plannerComponents = isPlanner
    ? { MonthCaption: PlannerMonthCaption, ...components }
    : components;

  // discriminated union(DayPickerProps의 mode 분기)을 보존하기 위해 spread 시 캐스팅.
  const dayPickerProps = props as unknown as DayPickerProps;

  return (
    <DayPicker
      {...dayPickerProps}
      locale={resolvedLocale}
      captionLayout={isPlanner ? 'label' : captionLayout}
      startMonth={defaultStartMonth}
      endMonth={defaultEndMonth}
      hideNavigation={hideNav}
      // planner는 outside 날짜를 회색으로 노출 → 마지막 주 빈 영역 없이 보더 완성.
      // (v9 기본 showOutsideDays=false면 빈 셀 + hidden invisible → 셀 보더까지 사라져 그리드 깨짐.)
      // 소비자가 `showOutsideDays`를 명시하면 그 값을 우선.
      showOutsideDays={
        (dayPickerProps as { showOutsideDays?: boolean }).showOutsideDays ?? isPlanner
      }
      components={plannerComponents}
      formatters={plannerFormatters}
      modifiers={plannerModifiers}
      modifiersClassNames={plannerModifiersClassNames}
      className={cn('bg-canvas text-foreground', isPlanner ? 'p-4' : 'p-3', className)}
      classNames={buildClassNames({ isPlanner, isDropdownMode, classNames })}
    />
  );
}

/**
 * variant별 classNames를 빌드. compact는 인라인 작은 셀, planner는 큰 보더 셀.
 *
 * # planner 핵심 차이
 *  - month_grid: `border-collapse` + 외곽 border
 *  - week, day: 각 셀 우/하 보더 (border-collapse로 중복 제거)
 *  - day_button: `min-h-20` 큰 셀, 숫자는 좌상단 정렬 (justify-start items-start + p-1)
 *  - weekday: uppercase tracking, padding 늘림
 */
function buildClassNames({
  isPlanner,
  isDropdownMode,
  classNames,
}: {
  isPlanner: boolean;
  isDropdownMode: boolean;
  classNames?: Partial<Record<string, string>>;
}): Record<string, string> {
  if (isPlanner) {
    return {
      root: cn('rdp-root', classNames?.root),
      months: cn('flex flex-col gap-4', classNames?.months),
      month: cn('flex flex-col gap-0', classNames?.month),
      // month_caption은 PlannerMonthCaption이 책임 → 기본 wrapper만
      month_caption: cn('flex justify-center', classNames?.month_caption),
      month_grid: cn('w-full border-collapse', classNames?.month_grid),
      weekdays: cn('flex border-b border-border-default', classNames?.weekdays),
      weekday: cn(
        'flex-1 text-[11px] font-medium uppercase tracking-[0.15em] text-foreground-muted py-2',
        // 일요일/토요일 색상 (첫/마지막 컬럼)
        '[&:first-child]:text-danger [&:last-child]:text-info',
        classNames?.weekday,
      ),
      week: cn('flex w-full', classNames?.week),
      // 큰 셀 + 우/하 보더. 첫 컬럼만 좌측 보더 추가해 외곽 보더 완성.
      day: cn(
        'flex-1 min-h-20 p-0 text-left text-xs',
        'border-r border-b border-border-default',
        '[&:first-child]:border-l',
        classNames?.day,
      ),
      day_button: cn(
        'flex h-full w-full items-start justify-start p-1.5 rounded-none',
        'hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring',
        'disabled:opacity-40 disabled:pointer-events-none',
        classNames?.day_button,
      ),
      selected: cn(
        '[&>button]:bg-foreground [&>button]:text-foreground-inverse [&>button]:hover:bg-foreground',
        classNames?.selected,
      ),
      today: cn('[&>button]:font-bold [&>button]:text-ring', classNames?.today),
      outside: cn('[&>button]:text-foreground-subtle [&>button]:opacity-40', classNames?.outside),
      disabled: cn('opacity-40', classNames?.disabled),
      // 셀 자체는 visible (보더 유지) — 버튼 내용만 invisible.
      // (이전 'invisible'은 셀 통째로 hidden → 보더 사라져 그리드 깨짐.)
      hidden: cn('[&>button]:invisible', classNames?.hidden),
      ...classNames,
    };
  }

  // compact (기본)
  return {
    root: cn('rdp-root', classNames?.root),
    months: cn('relative flex flex-col gap-4 sm:flex-row', classNames?.months),
    month: cn('flex flex-col gap-3', classNames?.month),
    month_caption: cn('flex h-8 items-center justify-center px-10', classNames?.month_caption),
    caption_label: cn(
      'inline-flex items-center gap-1 text-sm font-medium',
      isDropdownMode &&
        'h-8 px-2 border border-border-default bg-canvas text-foreground hover:bg-surface transition-colors',
      classNames?.caption_label,
    ),
    dropdowns: cn('inline-flex items-center gap-1.5', classNames?.dropdowns),
    dropdown_root: cn('relative inline-flex items-center', classNames?.dropdown_root),
    dropdown: cn(
      'absolute inset-0 z-10 w-full opacity-0 cursor-pointer',
      'appearance-none border-0 bg-transparent text-foreground',
      '[&>option]:bg-canvas [&>option]:text-foreground',
      classNames?.dropdown,
    ),
    chevron: cn('size-3.5 text-foreground-muted shrink-0', classNames?.chevron),
    nav: cn(
      'absolute top-3 inset-x-0 flex justify-between px-3 z-20 pointer-events-none',
      classNames?.nav,
    ),
    button_previous: cn(
      'inline-flex size-7 items-center justify-center rounded-none pointer-events-auto',
      'border border-border-default bg-canvas text-foreground hover:bg-surface',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
      'disabled:opacity-40 disabled:pointer-events-none',
      classNames?.button_previous,
    ),
    button_next: cn(
      'inline-flex size-7 items-center justify-center rounded-none pointer-events-auto',
      'border border-border-default bg-canvas text-foreground hover:bg-surface',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
      'disabled:opacity-40 disabled:pointer-events-none',
      classNames?.button_next,
    ),
    month_grid: cn('w-full border-collapse', classNames?.month_grid),
    weekdays: cn('flex', classNames?.weekdays),
    weekday: cn('flex-1 text-xs font-normal text-foreground-muted py-1', classNames?.weekday),
    week: cn('flex w-full mt-1', classNames?.week),
    day: cn('flex-1 p-0 text-center text-sm', classNames?.day),
    day_button: cn(
      'inline-flex size-8 items-center justify-center rounded-none',
      'hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
      'disabled:opacity-40 disabled:pointer-events-none',
      classNames?.day_button,
    ),
    selected: cn(
      '[&>button]:bg-foreground [&>button]:text-foreground-inverse [&>button]:hover:bg-foreground',
      classNames?.selected,
    ),
    today: cn('[&>button]:border [&>button]:border-ring', classNames?.today),
    outside: cn('text-foreground-subtle opacity-50', classNames?.outside),
    disabled: cn('opacity-40', classNames?.disabled),
    hidden: cn('invisible', classNames?.hidden),
    ...classNames,
  };
}
