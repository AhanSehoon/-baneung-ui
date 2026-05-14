import * as React from 'react';

import { cn } from '../../lib/cn';

interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

/**
 * Grid 내장 페이지네이션 — 단순한 prev/next + 페이지 번호.
 *
 * 디자인 시스템의 Pagination 컴포넌트(@baneung-pack/ui)와는 별개로,
 * Grid 패키지가 ui에 의존하지 않도록 자체적으로 가벼운 페이지네이션을 제공한다.
 * 사용자가 더 풍부한 페이징이 필요하면 `showPagination={false}` + 외부 컴포넌트.
 */
export function GridPagination({ page, pageCount, onPageChange }: PaginationProps) {
  // 1. 보여줄 페이지 번호 계산 — 현재 페이지 주변 ±2, 양 끝 추가, ellipsis 압축
  const pages = React.useMemo(() => {
    if (pageCount <= 7) {
      return Array.from({ length: pageCount }, (_, i) => i + 1);
    }
    const result: (number | 'ellipsis')[] = [1];
    const start = Math.max(2, page - 2);
    const end = Math.min(pageCount - 1, page + 2);
    if (start > 2) result.push('ellipsis');
    for (let i = start; i <= end; i++) result.push(i);
    if (end < pageCount - 1) result.push('ellipsis');
    result.push(pageCount);
    return result;
  }, [page, pageCount]);

  if (pageCount <= 1) return null;

  return (
    <nav
      role="navigation"
      aria-label="페이지 이동"
      className="flex items-center justify-center gap-1 border-t border-border-default px-3 py-2"
    >
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className={cn(
          'inline-flex h-8 min-w-8 items-center justify-center px-2 text-sm',
          'border border-border-default bg-canvas text-foreground',
          'hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        )}
        aria-label="이전 페이지"
      >
        ‹
      </button>
      {pages.map((p, idx) =>
        p === 'ellipsis' ? (
          <span
            key={`ellipsis-${idx}`}
            aria-hidden="true"
            className="inline-flex h-8 min-w-8 items-center justify-center text-sm text-foreground-muted"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={cn(
              'inline-flex h-8 min-w-8 items-center justify-center px-2 text-sm',
              'border border-border-default',
              p === page
                ? 'bg-foreground text-foreground-inverse'
                : 'bg-canvas text-foreground hover:bg-surface',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
            )}
          >
            {p}
          </button>
        ),
      )}
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pageCount}
        className={cn(
          'inline-flex h-8 min-w-8 items-center justify-center px-2 text-sm',
          'border border-border-default bg-canvas text-foreground',
          'hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        )}
        aria-label="다음 페이지"
      >
        ›
      </button>
    </nav>
  );
}
