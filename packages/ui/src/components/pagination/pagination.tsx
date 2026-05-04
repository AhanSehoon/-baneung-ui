import * as React from 'react';

import { cn } from '../../lib/cn';
import { useControllableState } from '../../lib/use-controllable-state';

export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  /** 현재 페이지 (1-based, controlled). 미지정 시 uncontrolled — `defaultPage` 사용. */
  page?: number;
  /** uncontrolled 초기 페이지. 기본 1. */
  defaultPage?: number;
  /** 전체 페이지 수. */
  total: number;
  /** 페이지 변경 콜백 (controlled/uncontrolled 모두 호출됨). */
  onPageChange?: (page: number) => void;
  /** 현재 페이지 좌우로 보일 항목 수. 기본 1. */
  siblings?: number;
  /** 처음/마지막 사이의 표시 페이지 수 (모바일에서는 자동 숨김). */
  showFirstLast?: boolean;
  /** sm 미만에서 자동으로 단순 모드(`< N / Total >`)로 전환. 기본 true. */
  responsive?: boolean;
}

type PageEntry = number | 'ellipsis-left' | 'ellipsis-right';

/**
 * 페이지 표시 범위 산출.
 * - total <= 7: 모두 표시
 * - 그 외: [1, ..., current-siblings, ..., current+siblings, ..., total]
 *   양 끝과 현재 주변만 보이고 사이 빈 곳은 ellipsis로 압축.
 */
export function getPageRange(current: number, total: number, siblings = 1): PageEntry[] {
  const totalNumbers = siblings * 2 + 5; // first + last + current + 2*siblings + 2 ellipsis 자리

  if (total <= totalNumbers) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(2, current - siblings);
  const rightSibling = Math.min(total - 1, current + siblings);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < total - 1;

  const out: PageEntry[] = [1];

  if (showLeftEllipsis) {
    out.push('ellipsis-left');
  } else {
    for (let i = 2; i < leftSibling; i++) out.push(i);
  }

  for (let i = leftSibling; i <= rightSibling; i++) out.push(i);

  if (showRightEllipsis) {
    out.push('ellipsis-right');
  } else {
    for (let i = rightSibling + 1; i < total; i++) out.push(i);
  }

  if (total > 1) out.push(total);
  return out;
}

const buttonClass = cn(
  'inline-flex h-8 min-w-8 items-center justify-center px-2 text-sm',
  'bg-canvas text-foreground-muted',
  'border border-border-default rounded-none',
  'hover:bg-surface hover:text-foreground',
  'transition-colors duration-fast ease-standard',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
  'disabled:cursor-not-allowed disabled:opacity-50',
  'aria-[current=page]:bg-foreground aria-[current=page]:text-foreground-inverse',
  'aria-[current=page]:border-foreground',
);

/**
 * Pagination — 페이지 네비게이션.
 *
 * 데스크톱: 1, 2, 3 … N 패턴 (현재 좌우 `siblings`개 + 처음/끝).
 * 모바일(sm 미만, `responsive=true` 기본): "← 1 / N →" 단순 모드 (Tailwind sm 브레이크포인트 기반).
 *
 * - controlled — 항상 `page` + `onPageChange` 필요
 * - 키보드: 각 버튼은 native button 시맨틱이라 Tab + Enter/Space 동작
 * - 시맨틱: `<nav role="navigation">` + `aria-label="페이지"` + `aria-current="page"`
 */
export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(function Pagination(
  {
    page: pageProp,
    defaultPage = 1,
    total,
    onPageChange,
    siblings = 1,
    responsive = true,
    className,
    ...props
  },
  ref,
) {
  const [page, setPage] = useControllableState<number>({
    prop: pageProp,
    defaultProp: defaultPage,
    onChange: onPageChange,
  });
  const current = page ?? 1;
  const range = React.useMemo(
    () => getPageRange(current, total, siblings),
    [current, total, siblings],
  );

  const goPrev = (): void => setPage(Math.max(1, current - 1));
  const goNext = (): void => setPage(Math.min(total, current + 1));

  return (
    <nav
      ref={ref}
      aria-label="페이지"
      className={cn('flex items-center justify-center gap-1', className)}
      {...props}
    >
      <button
        type="button"
        onClick={goPrev}
        disabled={current <= 1}
        aria-label="이전 페이지"
        className={buttonClass}
      >
        ‹
      </button>

      {/* 모바일 단순 모드 — sm 미만에서만 보임 */}
      {responsive ? (
        <span className="px-2 text-sm text-foreground-muted sm:hidden">
          {current} / {total}
        </span>
      ) : null}

      {/* 데스크톱 — 페이지 번호 */}
      <ul className={cn('flex items-center gap-1', responsive && 'hidden sm:flex')}>
        {range.map((entry, idx) => {
          if (entry === 'ellipsis-left' || entry === 'ellipsis-right') {
            return (
              <li
                key={`${entry}-${idx}`}
                aria-hidden="true"
                className="px-1 text-foreground-subtle"
              >
                …
              </li>
            );
          }
          return (
            <li key={entry}>
              <button
                type="button"
                onClick={(): void => setPage(entry)}
                aria-label={`${entry}페이지로 이동`}
                aria-current={entry === current ? 'page' : undefined}
                className={buttonClass}
              >
                {entry}
              </button>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={goNext}
        disabled={current >= total}
        aria-label="다음 페이지"
        className={buttonClass}
      >
        ›
      </button>
    </nav>
  );
});
Pagination.displayName = 'Pagination';
