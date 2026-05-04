import { enUS, ko } from 'date-fns/locale';
import { DayPicker, type DayPickerProps } from 'react-day-picker';

import { cn } from '../../lib/cn';

import type * as React from 'react';

export type CalendarLocale = 'en' | 'ko';

/**
 * DayPickerProps는 mode("single"|"multiple"|"range"|undefined)에 따른
 * discriminated union이므로, 표준 Omit을 쓰면 디스크리미네이션이 풀려
 * `selected`/`onSelect` 등 분기별 prop이 사라진다. distributive Omit으로
 * 각 union 멤버에 개별적으로 Omit을 적용해 분기를 보존.
 */
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

export type CalendarProps = DistributiveOmit<DayPickerProps, 'locale'> & {
  /**
   * 표시 로케일. 'en'(기본, 영문 — January / Sun) | 'ko'(한글 — 1월 / 일).
   * 더 세밀한 제어가 필요하면 date-fns Locale 객체를 직접 전달.
   */
  locale?: CalendarLocale | DayPickerProps['locale'];
};

const localeMap = { en: enUS, ko } as const;

/**
 * Calendar — react-day-picker 래퍼.
 *
 * 단일 / 다중 / 범위 선택 모두 react-day-picker의 `mode` prop으로 결정합니다:
 *  - `mode="single"` (기본 — DatePicker가 사용)
 *  - `mode="multiple"` — 여러 날짜 선택
 *  - `mode="range"` — 시작/종료
 *
 * 기본적으로 `captionLayout="dropdown"`을 사용해 월/년 셀렉터를 노출합니다.
 * 키보드 네비게이션, prefers-reduced-motion은 react-day-picker가 처리합니다.
 */
export function Calendar({
  className,
  classNames,
  locale = 'en',
  captionLayout = 'dropdown',
  startMonth,
  endMonth,
  ...props
}: CalendarProps): React.ReactElement {
  // 'en' | 'ko' 단축 키워드 → date-fns Locale 객체로 매핑
  const resolvedLocale =
    typeof locale === 'string' && locale in localeMap
      ? localeMap[locale as CalendarLocale]
      : (locale as DayPickerProps['locale']);

  // dropdown caption은 startMonth/endMonth 범위가 필요. 미지정 시 현재 ±10년으로 기본 제공.
  const now = new Date();
  const defaultStartMonth = startMonth ?? new Date(now.getFullYear() - 10, 0);
  const defaultEndMonth = endMonth ?? new Date(now.getFullYear() + 10, 11);

  // discriminated union(DayPickerProps의 mode 분기)을 보존하기 위해 spread 시 캐스팅.
  // 우리 타입은 Omit으로 locale만 좁혔지만, react-day-picker의 PropsBase
  // intersection이 Omit으로 단일화되면서 mode 디스크리미네이션이 풀린다.
  const dayPickerProps = props as unknown as DayPickerProps;

  return (
    <DayPicker
      {...dayPickerProps}
      locale={resolvedLocale}
      captionLayout={captionLayout}
      startMonth={defaultStartMonth}
      endMonth={defaultEndMonth}
      className={cn('p-3 bg-canvas text-foreground', className)}
      classNames={{
        root: cn('rdp-root', classNames?.root),
        months: cn('flex flex-col gap-4 sm:flex-row', classNames?.months),
        month: cn('flex flex-col gap-3', classNames?.month),
        month_caption: cn(
          'flex h-8 items-center justify-center text-sm font-medium',
          classNames?.month_caption,
        ),
        caption_label: cn('text-sm font-medium', classNames?.caption_label),
        dropdowns: cn('flex items-center gap-1', classNames?.dropdowns),
        dropdown_root: cn('relative inline-flex', classNames?.dropdown_root),
        dropdown: cn(
          'inline-flex h-8 items-center gap-1 px-2 text-sm font-medium',
          'bg-canvas text-foreground border border-border-default rounded-none',
          'hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          'cursor-pointer',
          classNames?.dropdown,
        ),
        nav: cn('absolute top-2 inset-x-0 flex justify-between px-2', classNames?.nav),
        button_previous: cn(
          'inline-flex size-7 items-center justify-center rounded-none',
          'border border-border-default bg-canvas hover:bg-surface',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          classNames?.button_previous,
        ),
        button_next: cn(
          'inline-flex size-7 items-center justify-center rounded-none',
          'border border-border-default bg-canvas hover:bg-surface',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
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
      }}
    />
  );
}
