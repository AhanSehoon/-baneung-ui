import { useVirtualizer, type Virtualizer } from '@tanstack/react-virtual';
import * as React from 'react';

import { EditableCell } from './editable-cell';
import { GridPagination } from './pagination';
import { SelectionCheckbox } from './selection-checkbox';
import { useGridState } from './use-grid-state';
import { cn } from '../../lib/cn';

import type { GridColumn, GridHandle, GridProps } from './types';

type RowId = string | number;

/** 컬럼이 보유한 값을 row에서 꺼낸다. */
function getCellValue<TRow>(column: GridColumn<TRow>, row: TRow): unknown {
  return typeof column.accessor === 'function'
    ? column.accessor(row)
    : (row as Record<string, unknown>)[column.accessor as string];
}

/**
 * 한 셀의 표시 노드 (편집 모드의 input은 EditableCell이 별도로 다룬다).
 *
 *   - renderer === 'text' 또는 미지정: 값을 String() 변환 후 표시
 *   - renderer가 함수: (value, row) => ReactNode 결과를 그대로 렌더
 */
function renderDisplay<TRow>(column: GridColumn<TRow>, row: TRow): React.ReactNode {
  const value = getCellValue(column, row);
  if (typeof column.renderer === 'function') {
    return column.renderer(value, row);
  }
  if (value === null || value === undefined) return '';
  return String(value);
}

/**
 * Grid — virtualization · 페이지네이션 · 인라인 편집 · 행 선택 · imperative API를
 * 통합한 데이터 그리드.
 *
 * # 모드
 * - `virtualized={false}` (기본): 전체 행을 일반 `<table>`로 렌더.
 * - `virtualized={true}`: 보이는 행만 렌더 (TanStack Virtual).
 *
 * # 페이지네이션
 * - `pageSize > 0`이면 자동 활성. `showPagination=false`로 내장 UI만 숨길 수 있음
 *   (외부 컴포넌트 + `page`/`onPageChange` controlled로 통합).
 *
 * # 편집
 * - 컬럼에 `editable: true` 지정 → 셀 더블클릭 → input 진입.
 * - Enter/blur로 commit (한글 IME composition 안전), Escape로 cancel.
 *
 * # 행 선택 + 외부 제어
 * - `selectable={true}`로 첫 컬럼에 체크박스 자동 추가.
 * - `ref={gridRef}`로 imperative API 접근. 외부 버튼에서
 *   `gridRef.current?.deleteSelected()` 호출로 일괄 삭제 가능.
 *
 * @example
 *   const gridRef = useRef<GridHandle<Item>>(null);
 *   <Grid ref={gridRef} columns={cols} data={rows} selectable getRowId={r => r.id} />
 *   <Button onClick={() => gridRef.current?.deleteSelected()}>선택 삭제</Button>
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
    selectable = false,
    onRowChange,
    className,
    ...props
  }: GridProps<TRow>,
  ref: React.ForwardedRef<GridHandle<TRow>>,
) {
  // ID 추출 — getRowId 미지정 시 인덱스. 단 selectable/편집과는 같이 쓰지 말 것.
  const resolveRowId = React.useCallback(
    (row: TRow, index: number): RowId => (getRowId ? getRowId(row, index) : index),
    [getRowId],
  );

  // 1. 내부 상태 (편집·삭제·선택)
  const state = useGridState(data, resolveRowId, onRowChange);

  // 1b. active cell — 클릭한 셀에 테두리 highlight (AUIGrid 스타일 current cell)
  const [activeCell, setActiveCell] = React.useState<{
    rowId: RowId;
    columnId: string;
  } | null>(null);
  const activateCell = React.useCallback((rowId: RowId, columnId: string) => {
    setActiveCell({ rowId, columnId });
  }, []);

  // 2. 페이지 상태 — controlled/uncontrolled
  const [internalPage, setInternalPage] = React.useState(1);
  const page = pageProp ?? internalPage;
  const setPage = React.useCallback(
    (next: number) => {
      if (onPageChange) onPageChange(next);
      else setInternalPage(next);
    },
    [onPageChange],
  );

  // 3. 현재 화면에 보일 데이터 (편집된 rows + 페이지네이션 적용)
  const pageCount = pageSize > 0 ? Math.max(1, Math.ceil(state.rows.length / pageSize)) : 1;
  const visibleData = React.useMemo(() => {
    if (pageSize <= 0) return state.rows;
    const start = (page - 1) * pageSize;
    return state.rows.slice(start, start + pageSize);
  }, [state.rows, page, pageSize]);

  // 4. 가상화
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: virtualized ? visibleData.length : 0,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => rowHeight,
    overscan: 8,
  });

  // 5. imperative API 노출
  React.useImperativeHandle(
    ref,
    () => ({
      getSavedData: state.getSavedData,
      getChangedData: state.getChangedData,
      getDeletedData: state.getDeletedData,
      getSelectedIds: state.getSelectedIds,
      deleteSelected: state.deleteSelected,
      clearSelection: state.clearSelection,
      reset: state.reset,
    }),
    [state],
  );

  // 6. 셀 commit 핸들러 — string key accessor만 지원
  const handleCellCommit = React.useCallback(
    (id: RowId, col: GridColumn<TRow>, value: string) => {
      if (typeof col.accessor === 'function') {
        // 함수 accessor는 set 방법을 모르므로 편집 무시.
        return;
      }
      state.editCell(id, col.accessor as string, value);
    },
    [state],
  );

  const heightStyle = typeof height === 'number' ? `${height}px` : height;
  const isEmpty = visibleData.length === 0;
  // 헤더 체크박스 상태 — visibleData 기준
  const allSelected =
    selectable &&
    visibleData.length > 0 &&
    visibleData.every((row, idx) => state.selectedIds.has(resolveRowId(row, idx)));
  const someSelected =
    selectable &&
    !allSelected &&
    visibleData.some((row, idx) => state.selectedIds.has(resolveRowId(row, idx)));
  // selectable 시 헤더/td 컬럼 수 +1
  const colSpan = columns.length + (selectable ? 1 : 0);

  return (
    <div className={cn('flex flex-col border border-border-default', className)} {...props}>
      <div
        ref={scrollRef}
        className="relative overflow-auto"
        style={{ height: virtualized ? heightStyle : undefined, maxHeight: heightStyle }}
        role="region"
        aria-label="데이터 그리드"
      >
        <table
          className="w-full border-collapse text-sm"
          aria-rowcount={state.rows.length}
          aria-colcount={colSpan}
        >
          <thead className="sticky top-0 z-10 bg-surface">
            <tr>
              {selectable && (
                <th
                  scope="col"
                  className="w-10 border-b border-border-default px-3 py-2 text-center"
                >
                  <SelectionCheckbox
                    label="모두 선택"
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={() => state.toggleAll(visibleData)}
                  />
                </th>
              )}
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
                <td colSpan={colSpan} className="px-3 py-8 text-center text-foreground-muted">
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
              resolveRowId={resolveRowId}
              selectable={selectable}
              selectedIds={state.selectedIds}
              onToggleRow={state.toggleRow}
              onCellCommit={handleCellCommit}
              activeCell={activeCell}
              onCellActivate={activateCell}
            />
          ) : (
            <tbody>
              {visibleData.map((row, idx) => {
                const id = resolveRowId(row, idx);
                return (
                  <GridRow
                    key={id}
                    rowId={id}
                    row={row}
                    columns={columns}
                    selectable={selectable}
                    selected={state.selectedIds.has(id)}
                    onToggle={state.toggleRow}
                    onCellCommit={handleCellCommit}
                    activeCell={activeCell}
                    onCellActivate={activateCell}
                  />
                );
              })}
            </tbody>
          )}
        </table>
      </div>

      {pageSize > 0 && showPagination && (
        <GridPagination page={page} pageCount={pageCount} onPageChange={setPage} />
      )}
    </div>
  );
}) as <TRow = Record<string, unknown>>(
  props: GridProps<TRow> & { ref?: React.ForwardedRef<GridHandle<TRow>> },
) => React.ReactElement;

(Grid as unknown as { displayName: string }).displayName = 'Grid';

// ─────────────────────────────────────────────────────────────────────────────
// 행 1개 렌더 — 체크박스 + 각 컬럼 셀 (편집 가능 셀은 EditableCell 사용)
// ─────────────────────────────────────────────────────────────────────────────

interface GridRowProps<TRow> {
  rowId: RowId;
  row: TRow;
  columns: GridColumn<TRow>[];
  selectable: boolean;
  selected: boolean;
  onToggle: (id: RowId) => void;
  onCellCommit: (id: RowId, col: GridColumn<TRow>, value: string) => void;
  activeCell: { rowId: RowId; columnId: string } | null;
  onCellActivate: (rowId: RowId, columnId: string) => void;
  height?: number;
}

function GridRow<TRow>({
  rowId,
  row,
  columns,
  selectable,
  selected,
  onToggle,
  onCellCommit,
  activeCell,
  onCellActivate,
  height,
}: GridRowProps<TRow>) {
  return (
    <tr
      className="border-b border-border-subtle last:border-b-0 hover:bg-surface"
      data-selected={selected || undefined}
      style={height !== undefined ? { height } : undefined}
    >
      {selectable && (
        <td className="w-10 px-3 py-2 text-center">
          <SelectionCheckbox
            label={`행 ${String(rowId)} 선택`}
            checked={selected}
            onChange={() => onToggle(rowId)}
          />
        </td>
      )}
      {columns.map((col) => {
        const display = renderDisplay(col, row);
        const align = col.align;
        // 편집 가능 + accessor가 string key일 때만 EditableCell 사용
        const isEditable = col.editable && typeof col.accessor === 'string';
        const value = getCellValue(col, row);
        const isActive = activeCell?.rowId === rowId && activeCell.columnId === col.id;

        return (
          <td
            key={col.id}
            aria-selected={isActive || undefined}
            onClick={() => onCellActivate(rowId, col.id)}
            className={cn(
              // 활성 셀은 ring으로 안쪽 테두리 그려서 layout shift 없이 강조 (AUIGrid 스타일)
              'cursor-pointer px-3 py-2 text-foreground',
              isActive && 'relative z-[1] outline outline-2 -outline-offset-2 outline-ring',
              align === 'right' && 'text-right',
              align === 'center' && 'text-center',
              (!align || align === 'left') && 'text-left',
            )}
          >
            {isEditable ? (
              <EditableCell
                value={value}
                display={display}
                align={align}
                onCommit={(next) => onCellCommit(rowId, col, next)}
              />
            ) : (
              display
            )}
          </td>
        );
      })}
    </tr>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 가상화 tbody — 보이는 행만 GridRow로 렌더
// ─────────────────────────────────────────────────────────────────────────────

interface VirtualizedBodyProps<TRow> {
  columns: GridColumn<TRow>[];
  data: TRow[];
  virtualizer: Virtualizer<HTMLDivElement, Element>;
  rowHeight: number;
  resolveRowId: (row: TRow, index: number) => RowId;
  selectable: boolean;
  selectedIds: Set<RowId>;
  onToggleRow: (id: RowId) => void;
  onCellCommit: (id: RowId, col: GridColumn<TRow>, value: string) => void;
  activeCell: { rowId: RowId; columnId: string } | null;
  onCellActivate: (rowId: RowId, columnId: string) => void;
}

function VirtualizedBody<TRow>({
  columns,
  data,
  virtualizer,
  rowHeight,
  resolveRowId,
  selectable,
  selectedIds,
  onToggleRow,
  onCellCommit,
  activeCell,
  onCellActivate,
}: VirtualizedBodyProps<TRow>) {
  const items = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();
  const first = items[0];
  const last = items[items.length - 1];
  const paddingTop = first ? first.start : 0;
  const paddingBottom = last ? totalSize - last.end : 0;
  const colSpan = columns.length + (selectable ? 1 : 0);

  return (
    <tbody>
      {paddingTop > 0 && (
        <tr aria-hidden="true">
          <td colSpan={colSpan} style={{ height: paddingTop, padding: 0, border: 0 }} />
        </tr>
      )}
      {items.map((vi) => {
        const row = data[vi.index];
        if (row === undefined) return null;
        const id = resolveRowId(row, vi.index);
        return (
          <GridRow
            key={id}
            rowId={id}
            row={row}
            columns={columns}
            selectable={selectable}
            selected={selectedIds.has(id)}
            onToggle={onToggleRow}
            onCellCommit={onCellCommit}
            activeCell={activeCell}
            onCellActivate={onCellActivate}
            height={rowHeight}
          />
        );
      })}
      {paddingBottom > 0 && (
        <tr aria-hidden="true">
          <td colSpan={colSpan} style={{ height: paddingBottom, padding: 0, border: 0 }} />
        </tr>
      )}
    </tbody>
  );
}
