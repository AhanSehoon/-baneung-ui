import { useVirtualizer, type Virtualizer } from '@tanstack/react-virtual';
import * as React from 'react';

import { GridPagination } from './pagination';
import { cn } from '../../lib/cn';

import type { GridColumn, GridProps } from './types';

/**
 * 한 셀의 값을 props 기반으로 렌더링.
 *
 * v0.1.0은 text + 커스텀 함수만 지원.
 *   - renderer === 'text' 또는 미지정: 값을 String() 변환 후 표시
 *   - renderer가 함수: (value, row) => ReactNode 결과를 그대로 렌더
 *
 * dropdown/icon/date/number-comma 등 built-in renderer는 v0.2.0+에서 추가.
 */
function renderCell<TRow>(column: GridColumn<TRow>, row: TRow): React.ReactNode {
  // 1. accessor로 값 추출
  const value =
    typeof column.accessor === 'function'
      ? column.accessor(row)
      : (row as Record<string, unknown>)[column.accessor as string];

  // 2. renderer 적용
  if (typeof column.renderer === 'function') {
    return column.renderer(value, row);
  }
  // 'text' or undefined
  if (value === null || value === undefined) return '';
  return String(value);
}

/**
 * Grid — virtualization 토글 + 내장 페이지네이션을 가진 데이터 그리드 (MVP).
 *
 * # 모드
 * - `virtualized={false}` (기본): 전체 행을 일반 `<table>`로 렌더. 작은 데이터셋용.
 * - `virtualized={true}`: 보이는 행만 렌더 (TanStack Virtual). 큰 데이터셋용.
 *
 * # 페이지네이션
 * - `pageSize > 0`이면 페이지네이션 활성.
 * - `showPagination=false`로 내장 UI 숨김 (외부 페이징 사용 시).
 * - controlled: `page` + `onPageChange` 둘 다 전달.
 * - uncontrolled: 둘 다 미전달 → 내부 state로 관리.
 *
 * # 접근성
 * - 시맨틱 `<table>`/`<thead>`/`<tbody>`/`<tr>`/`<th>`/`<td>` 사용 (가상화 시에도)
 * - `aria-rowcount`, `aria-colcount`로 전체 크기 안내
 * - 페이지 네비게이션에 role="navigation"
 *
 * @example
 *   <Grid
 *     columns={[
 *       { id: 'name', header: '이름', accessor: 'name' },
 *       { id: 'price', header: '가격', accessor: 'price', align: 'right' },
 *     ]}
 *     data={items}
 *     virtualized={items.length > 1000}
 *     pageSize={20}
 *   />
 */
export const Grid = React.forwardRef(function GridInner<TRow = Record<string, unknown>>(
  {
    columns,
    data,
    virtualized = false,
    rowHeight = 36,
    height = 400,
    pageSize = 0,
    showPagination = true,
    page: pageProp,
    onPageChange,
    emptyState,
    getRowId,
    className,
    ...props
  }: GridProps<TRow>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  // 1. 페이지 상태 — controlled/uncontrolled 모두 지원
  const [internalPage, setInternalPage] = React.useState(1);
  const page = pageProp ?? internalPage;
  const setPage = React.useCallback(
    (next: number) => {
      if (onPageChange) onPageChange(next);
      else setInternalPage(next);
    },
    [onPageChange],
  );

  // 2. 페이지네이션 적용 — pageSize가 0이면 전체 데이터, 아니면 슬라이스
  const pageCount = pageSize > 0 ? Math.max(1, Math.ceil(data.length / pageSize)) : 1;
  const visibleData = React.useMemo(() => {
    if (pageSize <= 0) return data;
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, page, pageSize]);

  // 3. 가상화용 ref + virtualizer
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: virtualized ? visibleData.length : 0,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => rowHeight,
    overscan: 8,
  });

  const heightStyle = typeof height === 'number' ? `${height}px` : height;
  const isEmpty = visibleData.length === 0;

  return (
    <div
      ref={ref}
      className={cn('flex flex-col border border-border-default', className)}
      {...props}
    >
      {/* 스크롤 컨테이너 */}
      <div
        ref={scrollRef}
        className="relative overflow-auto"
        style={{ height: virtualized ? heightStyle : undefined, maxHeight: heightStyle }}
        role="region"
        aria-label="데이터 그리드"
      >
        <table
          className="w-full border-collapse text-sm"
          aria-rowcount={data.length}
          aria-colcount={columns.length}
        >
          <thead className="sticky top-0 z-10 bg-surface">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.id}
                  scope="col"
                  className={cn(
                    'border-b border-border-default px-3 py-2 font-medium text-foreground',
                    col.align === 'right' && 'text-right',
                    col.align === 'center' && 'text-center',
                    (!col.align || col.align === 'left') && 'text-left',
                  )}
                  style={{ width: col.width }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          {isEmpty ? (
            <tbody>
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-3 py-8 text-center text-foreground-muted"
                >
                  {emptyState ?? '표시할 데이터가 없습니다.'}
                </td>
              </tr>
            </tbody>
          ) : virtualized ? (
            <VirtualizedBody
              columns={columns}
              data={visibleData}
              virtualizer={virtualizer}
              rowHeight={rowHeight}
              getRowId={getRowId}
            />
          ) : (
            <tbody>
              {visibleData.map((row, idx) => {
                const rowKey = getRowId ? getRowId(row, idx) : idx;
                return (
                  <tr
                    key={rowKey}
                    className="border-b border-border-subtle last:border-b-0 hover:bg-surface"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.id}
                        className={cn(
                          'px-3 py-2 text-foreground',
                          col.align === 'right' && 'text-right',
                          col.align === 'center' && 'text-center',
                          (!col.align || col.align === 'left') && 'text-left',
                        )}
                      >
                        {renderCell(col, row)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
      </div>

      {/* 페이지네이션 — pageSize>0 + showPagination=true 인 경우만 */}
      {pageSize > 0 && showPagination && (
        <GridPagination page={page} pageCount={pageCount} onPageChange={setPage} />
      )}
    </div>
  );
}) as <TRow = Record<string, unknown>>(
  props: GridProps<TRow> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => React.ReactElement;

(Grid as unknown as { displayName: string }).displayName = 'Grid';

/**
 * 가상화된 tbody — TanStack Virtual로 보이는 행만 렌더.
 *
 * 시맨틱 `<table>`을 유지하려고 `<tbody>` 안에 절대위치 row 트릭 대신
 * `transform: translateY()`로 각 행 위치를 옮기는 방식을 사용한다.
 */
function VirtualizedBody<TRow>({
  columns,
  data,
  virtualizer,
  rowHeight,
  getRowId,
}: {
  columns: GridColumn<TRow>[];
  data: TRow[];
  virtualizer: Virtualizer<HTMLDivElement, Element>;
  rowHeight: number;
  getRowId?: (row: TRow, index: number) => string | number;
}) {
  const items = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();
  // tbody 전체 높이를 totalSize와 맞춰 스크롤바를 정확히 표시.
  // items가 비어있는 케이스는 isEmpty 분기에서 이미 걸러져 여기 도달하지 않지만,
  // 인덱스 접근의 strict 옵션 안전성을 위해 noUncheckedIndexedAccess 가드를 둠.
  const first = items[0];
  const last = items[items.length - 1];
  const paddingTop = first ? first.start : 0;
  const paddingBottom = last ? totalSize - last.end : 0;

  return (
    <tbody>
      {paddingTop > 0 && (
        <tr aria-hidden="true">
          <td colSpan={columns.length} style={{ height: paddingTop, padding: 0, border: 0 }} />
        </tr>
      )}
      {items.map((vi) => {
        const row = data[vi.index];
        if (row === undefined) return null;
        const rowKey = getRowId ? getRowId(row, vi.index) : vi.index;
        return (
          <tr
            key={rowKey}
            data-index={vi.index}
            className="border-b border-border-subtle hover:bg-surface"
            style={{ height: rowHeight }}
          >
            {columns.map((col) => (
              <td
                key={col.id}
                className={cn(
                  'px-3 py-2 text-foreground',
                  col.align === 'right' && 'text-right',
                  col.align === 'center' && 'text-center',
                  (!col.align || col.align === 'left') && 'text-left',
                )}
              >
                {renderCell(col, row)}
              </td>
            ))}
          </tr>
        );
      })}
      {paddingBottom > 0 && (
        <tr aria-hidden="true">
          <td colSpan={columns.length} style={{ height: paddingBottom, padding: 0, border: 0 }} />
        </tr>
      )}
    </tbody>
  );
}
