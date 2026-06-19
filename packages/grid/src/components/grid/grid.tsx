import { useVirtualizer, type Virtualizer } from '@tanstack/react-virtual';
import * as React from 'react';

import { buildCsv, downloadCsv } from './csv';
import { EditableCell } from './editable-cell';
import { FilterPopover } from './filter-popover';
import { GridPagination } from './pagination';
import { SelectionCheckbox } from './selection-checkbox';
import { applySortAndFilter, collectUniqueValues, nextSortState } from './sort-filter';
import { collectExpandableIds, flattenTree, type FlatRow } from './tree-utils';
import { useGridState } from './use-grid-state';
import { cn } from '../../lib/cn';

import type { GridColumn, GridHandle, GridProps, GridSortState } from './types';

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
 * renderer 값:
 *  - 함수: 결과 그대로
 *  - 'progress': 진행률 바 + 숫자 (min/max로 범위 조정)
 *  - 'date': 날짜 포맷팅 (dateFormat 옵션)
 *  - 'text' / undefined: String(value)
 */
function renderDisplay<TRow>(column: GridColumn<TRow>, row: TRow): React.ReactNode {
  const value = getCellValue(column, row);
  if (typeof column.renderer === 'function') return column.renderer(value, row);
  if (column.renderer === 'progress') return renderProgress(value, column);
  if (column.renderer === 'date') return renderDate(value, column);
  if (value === null || value === undefined) return '';
  return String(value);
}

/** 진행률 바 + 우측 숫자 — `<progress>` 시맨틱 + 위에 시각적 fill. */
function renderProgress<TRow>(value: unknown, column: GridColumn<TRow>): React.ReactNode {
  const min = column.min ?? 0;
  const max = column.max ?? 100;
  const num = typeof value === 'number' ? value : Number(value);
  const safe = Number.isFinite(num) ? num : min;
  const clamped = Math.max(min, Math.min(max, safe));
  const ratio = max > min ? (clamped - min) / (max - min) : 0;
  return (
    <span
      role="progressbar"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={clamped}
      className="relative flex h-5 w-full items-center bg-surface"
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 bg-success"
        style={{ width: `${ratio * 100}%` }}
      />
      <span className="relative z-[1] w-full text-center text-xs font-medium text-foreground">
        {Math.round(clamped)}
      </span>
    </span>
  );
}

/** 필터 funnel 아이콘 — SVG. */
function FunnelIcon() {
  return (
    <svg viewBox="0 0 14 14" className="h-3 w-3" aria-hidden="true" fill="currentColor">
      <path d="M1.5 2h11l-4.25 5.5V12L5.75 11V7.5L1.5 2z" />
    </svg>
  );
}

/** Date 포맷팅 — YYYY/MM/DD/HH/mm/ss 토큰 치환. */
function renderDate<TRow>(value: unknown, column: GridColumn<TRow>): string {
  const fmt = column.dateFormat ?? 'YYYY-MM-DD';
  let date: Date | null = null;
  if (value instanceof Date) date = value;
  else if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) date = parsed;
  }
  if (!date) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return fmt
    .replace('YYYY', String(date.getFullYear()))
    .replace('MM', pad(date.getMonth() + 1))
    .replace('DD', pad(date.getDate()))
    .replace('HH', pad(date.getHours()))
    .replace('mm', pad(date.getMinutes()))
    .replace('ss', pad(date.getSeconds()));
}

/**
 * Grid — virtualization · 페이지네이션 · 인라인 편집 · 행 선택 · 트리(계층) 모드 ·
 * imperative API를 통합한 데이터 그리드.
 *
 * @example
 *   <Grid
 *     ref={gridRef}
 *     columns={cols}
 *     data={rows}
 *     selectable
 *     getRowId={(r) => r.id}
 *   />
 *
 * @example
 *   // Tree 모드 (계층 표시)
 *   <Grid
 *     columns={cols}
 *     data={nestedData}
 *     tree
 *     getChildren={(r) => r.children}
 *     getRowId={(r) => r.id}
 *     defaultExpandedIds="all"
 *   />
 */
export const Grid = React.forwardRef(function GridInner<TRow = Record<string, unknown>>(
  {
    columns,
    data,
    virtualized = false,
    rowHeight = 36,
    height = 400,
    autoSize = false,
    pageSize = 0,
    showPagination = true,
    page: pageProp,
    onPageChange,
    emptyState,
    getRowId,
    selectable = false,
    onRowChange,
    tree = false,
    getChildren,
    defaultExpandedIds = 'none',
    cellSelection = 'single',
    clearOnDelete = false,
    className,
    ...props
  }: GridProps<TRow>,
  ref: React.ForwardedRef<GridHandle<TRow>>,
) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  // ID 추출 — getRowId 미지정 시 인덱스. tree 모드에서는 안정적 ID가 필수.
  const resolveRowId = React.useCallback(
    (row: TRow, index: number): RowId => (getRowId ? getRowId(row, index) : index),
    [getRowId],
  );

  // 1. 내부 상태 (편집·삭제·선택)
  const state = useGridState(data, resolveRowId, onRowChange);

  // 1b. 셀 선택 — single/multi 모두 selectedCells Set으로 통일.
  //     cellKey = `${rowId}${columnId}` (null byte로 충돌 회피).
  const cellKey = (rowId: RowId, columnId: string) => `${rowId}${columnId}`;
  const [activeCell, setActiveCell] = React.useState<{
    rowId: RowId;
    columnId: string;
  } | null>(null);
  const [selectedCells, setSelectedCells] = React.useState<Set<string>>(new Set());
  // 드래그 시작 셀 (multi 모드). 드래그 중 mousemove로 currentCell 갱신.
  const dragStartRef = React.useRef<{ rowId: RowId; columnId: string } | null>(null);
  const activateCell = React.useCallback(
    (rowId: RowId, columnId: string) => {
      if (cellSelection === 'none') return;
      setActiveCell({ rowId, columnId });
      setSelectedCells(new Set([cellKey(rowId, columnId)]));
    },
    [cellSelection],
  );

  // 1c. Tree 펼침 상태 — defaultExpandedIds로 초기화. data 또는 prop이 바뀌면 재계산.
  const initialExpanded = React.useMemo<Set<RowId>>(() => {
    if (!tree || !getChildren) return new Set();
    if (defaultExpandedIds === 'all') {
      return collectExpandableIds(data, getChildren, resolveRowId);
    }
    if (Array.isArray(defaultExpandedIds)) {
      return new Set(defaultExpandedIds);
    }
    return new Set();
  }, [tree, getChildren, data, defaultExpandedIds, resolveRowId]);
  const [expandedIds, setExpandedIds] = React.useState<Set<RowId>>(initialExpanded);
  React.useEffect(() => {
    setExpandedIds(initialExpanded);
  }, [initialExpanded]);
  const toggleExpand = React.useCallback((id: RowId) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // 2. 페이지 상태
  const [internalPage, setInternalPage] = React.useState(1);
  const page = pageProp ?? internalPage;
  const setPage = React.useCallback(
    (next: number) => {
      if (onPageChange) onPageChange(next);
      else setInternalPage(next);
    },
    [onPageChange],
  );

  // 1d. sort / filter 상태 — filter는 컬럼별 "제외" 값 Set.
  const [sortState, setSortState] = React.useState<GridSortState | null>(null);
  const [filters, setFilters] = React.useState<Record<string, Set<string>>>({});
  // 필터 popover anchor — funnel 버튼의 clientRect를 캡처해 Portal로 띄움.
  const [openFilter, setOpenFilter] = React.useState<{
    colId: string;
    anchorRect: { left: number; top: number; bottom: number; right: number };
  } | null>(null);
  const toggleSort = React.useCallback((columnId: string) => {
    setSortState((prev) => nextSortState(prev, columnId));
  }, []);
  const applyFilter = React.useCallback((columnId: string, excluded: Set<string>) => {
    setFilters((prev) => ({ ...prev, [columnId]: excluded }));
  }, []);

  // 3. 화면에 보일 행 — 트리 모드면 flattenTree, 아니면 state.rows를 FlatRow로 wrap.
  //    그 후 filter + sort를 적용 (트리 모드는 sort skip — hierarchy 보존).
  const allFlatRows = React.useMemo<FlatRow<TRow>[]>(() => {
    const base: FlatRow<TRow>[] =
      tree && getChildren
        ? flattenTree(data, getChildren, expandedIds, resolveRowId)
        : state.rows.map((row, idx) => ({
            row,
            id: resolveRowId(row, idx),
            level: 0,
            hasChildren: false,
            expanded: false,
          }));
    return applySortAndFilter(base, columns, filters, sortState, tree);
  }, [tree, getChildren, data, expandedIds, state.rows, resolveRowId, columns, filters, sortState]);

  // 4. 페이지네이션 적용
  const pageCount = pageSize > 0 ? Math.max(1, Math.ceil(allFlatRows.length / pageSize)) : 1;
  const visibleFlatRows = React.useMemo(() => {
    if (pageSize <= 0) return allFlatRows;
    const start = (page - 1) * pageSize;
    return allFlatRows.slice(start, start + pageSize);
  }, [allFlatRows, page, pageSize]);

  // 5. 가상화
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: virtualized ? visibleFlatRows.length : 0,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => rowHeight,
    overscan: 8,
  });

  // 6. 셀 commit 핸들러 (먼저 정의 — clearSelectedCells에서 사용)
  const handleCellCommit = React.useCallback(
    (id: RowId, col: GridColumn<TRow>, value: string) => {
      if (typeof col.accessor === 'function') return;
      state.editCell(id, col.accessor as string, value);
    },
    [state],
  );

  // 7. cell-selection 기반 helpers — addRow / removeSelectedRows / clearSelectedCells
  const addRow = React.useCallback(
    (newRow: TRow, position: 'first' | 'last' | 'above-active' | 'below-active') => {
      state.addRow(newRow, position, activeCell?.rowId);
    },
    [state, activeCell],
  );
  const selectedCellRowIds = React.useCallback((): Set<RowId> => {
    if (selectedCells.size === 0) {
      if (activeCell) return new Set([activeCell.rowId]);
      return new Set();
    }
    const ids = new Set<RowId>();
    selectedCells.forEach((key) => {
      const sep = key.indexOf('');
      if (sep < 0) return;
      const rawId = key.slice(0, sep);
      // RowId can be number — convert when applicable
      const asNum = Number(rawId);
      ids.add(Number.isFinite(asNum) && String(asNum) === rawId ? asNum : rawId);
    });
    return ids;
  }, [selectedCells, activeCell]);
  const removeSelectedRows = React.useCallback(() => {
    if (cellSelection === 'none') return;
    state.removeRowsByIds(selectedCellRowIds());
    setSelectedCells(new Set());
    setActiveCell(null);
  }, [cellSelection, state, selectedCellRowIds]);
  const clearSelectedCells = React.useCallback(() => {
    if (cellSelection === 'none') return;
    const cellsToCheck =
      selectedCells.size > 0
        ? Array.from(selectedCells)
        : activeCell
          ? [cellKey(activeCell.rowId, activeCell.columnId)]
          : [];
    cellsToCheck.forEach((key) => {
      const sep = key.indexOf('');
      if (sep < 0) return;
      const rawId = key.slice(0, sep);
      const colId = key.slice(sep + 1);
      const asNum = Number(rawId);
      const rowId = Number.isFinite(asNum) && String(asNum) === rawId ? asNum : rawId;
      const col = columns.find((c) => c.id === colId);
      if (col && typeof col.accessor === 'string') {
        state.editCell(rowId, col.accessor, '');
      }
    });
  }, [cellSelection, selectedCells, activeCell, columns, state]);

  // CSV export — `options.rows` 명시 시 그 행만, 아니면 saved data (편집 반영, 삭제 제외).
  const exportCsv = React.useCallback(
    (filename = 'grid.csv', options?: { rows?: TRow[] }) => {
      const targetRows = options?.rows ?? state.getSavedData();
      const csv = buildCsv(columns, targetRows);
      downloadCsv(csv, filename);
    },
    [state, columns],
  );

  // 8. imperative API
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
      addRow,
      removeSelectedRows,
      clearSelectedCells,
      exportCsv,
    }),
    [state, addRow, removeSelectedRows, clearSelectedCells, exportCsv],
  );

  // 9. multi-cell drag — mousedown으로 시작, mousemove로 사각형 갱신, mouseup으로 종료.
  //    visibleFlatRows / columns의 순서를 기준으로 인덱스 비교 → 사각형 영역 셀 키 수집.
  const handleCellMouseDown = React.useCallback(
    (rowId: RowId, columnId: string, e: React.MouseEvent) => {
      if (cellSelection !== 'multi') return;
      // 좌측 클릭만
      if (e.button !== 0) return;
      dragStartRef.current = { rowId, columnId };
      setActiveCell({ rowId, columnId });
      setSelectedCells(new Set([cellKey(rowId, columnId)]));
    },
    [cellSelection],
  );
  const handleCellMouseEnter = React.useCallback(
    (rowId: RowId, columnId: string) => {
      if (cellSelection !== 'multi') return;
      const start = dragStartRef.current;
      if (!start) return;
      // 사각형 계산: 행 인덱스 & 컬럼 인덱스 min~max 사이
      const rowIds = visibleFlatRows.map((fr) => fr.id);
      const colIds = columns.map((c) => c.id);
      const r1 = rowIds.indexOf(start.rowId);
      const r2 = rowIds.indexOf(rowId);
      const c1 = colIds.indexOf(start.columnId);
      const c2 = colIds.indexOf(columnId);
      if (r1 < 0 || r2 < 0 || c1 < 0 || c2 < 0) return;
      const rLo = Math.min(r1, r2);
      const rHi = Math.max(r1, r2);
      const cLo = Math.min(c1, c2);
      const cHi = Math.max(c1, c2);
      const next = new Set<string>();
      for (let r = rLo; r <= rHi; r++) {
        for (let c = cLo; c <= cHi; c++) {
          const rid = rowIds[r];
          const cid = colIds[c];
          if (rid !== undefined && cid !== undefined) next.add(cellKey(rid, cid));
        }
      }
      setSelectedCells(next);
    },
    [cellSelection, visibleFlatRows, columns],
  );
  // 전역 mouseup — 드래그 종료
  React.useEffect(() => {
    if (cellSelection !== 'multi') return;
    const onUp = () => {
      dragStartRef.current = null;
    };
    document.addEventListener('mouseup', onUp);
    return () => document.removeEventListener('mouseup', onUp);
  }, [cellSelection]);

  // 10. Delete 키 — 옵션 켜진 경우 선택된 셀 값 클리어. 컨테이너 포커스 시에만 작동.
  const handleContainerKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (!clearOnDelete) return;
      if (cellSelection === 'none') return;
      if (e.key !== 'Delete' && e.key !== 'Backspace') return;
      // 편집 중인 input 안에서의 Delete는 무시 — 텍스트 편집 우선
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT'
      )
        return;
      e.preventDefault();
      clearSelectedCells();
    },
    [clearOnDelete, cellSelection, clearSelectedCells],
  );

  const heightStyle = typeof height === 'number' ? `${height}px` : height;
  const isEmpty = visibleFlatRows.length === 0;
  // 헤더 체크박스 — visible 행 기준
  const allSelected =
    selectable &&
    visibleFlatRows.length > 0 &&
    visibleFlatRows.every((fr) => state.selectedIds.has(fr.id));
  const someSelected =
    selectable && !allSelected && visibleFlatRows.some((fr) => state.selectedIds.has(fr.id));
  const colSpan = columns.length + (selectable ? 1 : 0);

  return (
    <div
      ref={containerRef}
      tabIndex={clearOnDelete && cellSelection !== 'none' ? 0 : undefined}
      onKeyDown={handleContainerKeyDown}
      className={cn(
        'flex flex-col border border-border-default outline-none',
        // autoSize 시 부모 컨테이너에 꽉 맞춤 (caller 측이 부모 div에 명시적 height을 줘야 함)
        autoSize && 'h-full w-full',
        className,
      )}
      {...props}
    >
      <div
        ref={scrollRef}
        className={cn(
          'relative overflow-auto',
          // autoSize 시 남는 세로 공간 전부 차지 (페이지네이션 푸터는 자동으로 바닥에 고정).
          // min-h-0는 flex-shrink가 작동하려면 필수 — 없으면 콘텐츠가 컨테이너 밖으로 넘침.
          autoSize && 'flex-1 min-h-0',
        )}
        style={
          autoSize
            ? undefined
            : { height: virtualized ? heightStyle : undefined, maxHeight: heightStyle }
        }
        role="region"
        aria-label="데이터 그리드"
      >
        <table
          className="w-full border-collapse text-sm"
          aria-rowcount={allFlatRows.length}
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
                    onChange={() => state.toggleAll(visibleFlatRows.map((fr) => fr.row))}
                  />
                </th>
              )}
              {columns.map((col) => {
                const isSorted = sortState?.columnId === col.id;
                const sortIcon = !col.sortable
                  ? null
                  : !isSorted
                    ? '↕'
                    : sortState!.direction === 'asc'
                      ? '▲'
                      : '▼';
                const filterActive = (filters[col.id]?.size ?? 0) > 0;
                const isFilterOpen = openFilter?.colId === col.id;
                return (
                  <th
                    key={col.id}
                    scope="col"
                    aria-sort={
                      !isSorted
                        ? 'none'
                        : sortState!.direction === 'asc'
                          ? 'ascending'
                          : 'descending'
                    }
                    className={cn(
                      // relative — FilterPopover absolute 위치 기준점.
                      'relative border-b border-border-default px-3 py-2 font-medium text-foreground',
                      col.sortable && 'cursor-pointer select-none hover:bg-surface-strong',
                      col.align === 'right' && 'text-right',
                      col.align === 'center' && 'text-center',
                      (!col.align || col.align === 'left') && 'text-left',
                    )}
                    style={{ width: col.width }}
                    onClick={col.sortable ? () => toggleSort(col.id) : undefined}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.header}
                      {sortIcon && (
                        <span
                          aria-hidden="true"
                          className={cn(
                            'text-xs leading-none',
                            isSorted ? 'text-foreground' : 'text-foreground-subtle',
                          )}
                        >
                          {sortIcon}
                        </span>
                      )}
                      {col.filterable && (
                        <button
                          type="button"
                          aria-label={`${typeof col.header === 'string' ? col.header : col.id} 필터`}
                          aria-haspopup="dialog"
                          aria-expanded={isFilterOpen}
                          onClick={(e) => {
                            // sortable header onClick과 충돌하지 않도록.
                            e.stopPropagation();
                            if (isFilterOpen) {
                              setOpenFilter(null);
                            } else {
                              const r = e.currentTarget.getBoundingClientRect();
                              setOpenFilter({
                                colId: col.id,
                                anchorRect: {
                                  left: r.left,
                                  top: r.top,
                                  bottom: r.bottom,
                                  right: r.right,
                                },
                              });
                            }
                          }}
                          className={cn(
                            'inline-flex h-4 w-4 items-center justify-center hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                            filterActive ? 'text-success' : 'text-foreground-subtle',
                          )}
                        >
                          <FunnelIcon />
                        </button>
                      )}
                    </span>
                  </th>
                );
              })}
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
              flatRows={visibleFlatRows}
              virtualizer={virtualizer}
              rowHeight={rowHeight}
              selectable={selectable}
              selectedIds={state.selectedIds}
              onToggleRow={state.toggleRow}
              onCellCommit={handleCellCommit}
              activeCell={activeCell}
              onCellActivate={activateCell}
              tree={tree}
              onToggleExpand={toggleExpand}
              selectedCells={selectedCells}
              onCellMouseDown={handleCellMouseDown}
              onCellMouseEnter={handleCellMouseEnter}
            />
          ) : (
            <tbody>
              {visibleFlatRows.map((fr) => (
                <GridRow
                  key={fr.id}
                  flatRow={fr}
                  columns={columns}
                  selectable={selectable}
                  selected={state.selectedIds.has(fr.id)}
                  onToggle={state.toggleRow}
                  onCellCommit={handleCellCommit}
                  activeCell={activeCell}
                  onCellActivate={activateCell}
                  tree={tree}
                  onToggleExpand={toggleExpand}
                  selectedCells={selectedCells}
                  onCellMouseDown={handleCellMouseDown}
                  onCellMouseEnter={handleCellMouseEnter}
                />
              ))}
            </tbody>
          )}
        </table>
      </div>

      {pageSize > 0 && showPagination && (
        <GridPagination page={page} pageCount={pageCount} onPageChange={setPage} />
      )}

      {openFilter &&
        (() => {
          const col = columns.find((c) => c.id === openFilter.colId);
          if (!col) return null;
          return (
            <FilterPopover
              anchorRect={openFilter.anchorRect}
              allValues={collectUniqueValues(col, data, tree ? getChildren : undefined)}
              excluded={filters[openFilter.colId] ?? new Set()}
              onApply={(next) => applyFilter(openFilter.colId, next)}
              onClose={() => setOpenFilter(null)}
            />
          );
        })()}
    </div>
  );
}) as <TRow = Record<string, unknown>>(
  props: GridProps<TRow> & { ref?: React.ForwardedRef<GridHandle<TRow>> },
) => React.ReactElement;

(Grid as unknown as { displayName: string }).displayName = 'Grid';

// ─────────────────────────────────────────────────────────────────────────────
// Tree 컨트롤 — caret + 들여쓰기 (첫 컬럼에만 삽입)
// ─────────────────────────────────────────────────────────────────────────────

interface TreeAffixProps {
  level: number;
  hasChildren: boolean;
  expanded: boolean;
  onToggle: () => void;
}

function TreeAffix({ level, hasChildren, expanded, onToggle }: TreeAffixProps) {
  return (
    <span className="inline-flex items-center" style={{ paddingLeft: level * 16 }}>
      {hasChildren ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          aria-label={expanded ? '접기' : '펼치기'}
          aria-expanded={expanded}
          className="mr-1 inline-flex h-4 w-4 items-center justify-center text-foreground-muted hover:text-foreground"
        >
          <span aria-hidden="true" className="text-xs leading-none">
            {expanded ? '▼' : '▶'}
          </span>
        </button>
      ) : (
        <span
          aria-hidden="true"
          className="mr-1 inline-block w-4 text-center text-xs leading-none text-foreground-subtle"
        >
          ·
        </span>
      )}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 행 1개 렌더 (체크박스 + 컬럼 셀들)
// ─────────────────────────────────────────────────────────────────────────────

interface GridRowProps<TRow> {
  flatRow: FlatRow<TRow>;
  columns: GridColumn<TRow>[];
  selectable: boolean;
  selected: boolean;
  onToggle: (id: RowId) => void;
  onCellCommit: (id: RowId, col: GridColumn<TRow>, value: string) => void;
  activeCell: { rowId: RowId; columnId: string } | null;
  onCellActivate: (rowId: RowId, columnId: string) => void;
  tree: boolean;
  onToggleExpand: (id: RowId) => void;
  /** multi-select 모드에서 선택된 cellKey(`${rowId} ${columnId}`) 집합. */
  selectedCells: Set<string>;
  /** multi-select 모드 mousedown — 드래그 시작. */
  onCellMouseDown: (rowId: RowId, columnId: string, e: React.MouseEvent) => void;
  /** multi-select 모드 mouseenter — 드래그 중 사각형 갱신. */
  onCellMouseEnter: (rowId: RowId, columnId: string) => void;
  height?: number;
}

function GridRow<TRow>({
  flatRow,
  columns,
  selectable,
  selected,
  onToggle,
  onCellCommit,
  activeCell,
  onCellActivate,
  tree,
  onToggleExpand,
  selectedCells,
  onCellMouseDown,
  onCellMouseEnter,
  height,
}: GridRowProps<TRow>) {
  const { row, id, level, hasChildren, expanded } = flatRow;
  return (
    <tr
      className="border-b border-border-subtle last:border-b-0 hover:bg-surface"
      data-selected={selected || undefined}
      style={height !== undefined ? { height } : undefined}
    >
      {selectable && (
        <td className="w-10 px-3 py-2 text-center">
          <SelectionCheckbox
            label={`행 ${String(id)} 선택`}
            checked={selected}
            onChange={() => onToggle(id)}
          />
        </td>
      )}
      {columns.map((col, colIdx) => {
        const display = renderDisplay(col, row);
        const align = col.align;
        const isEditable = col.editable && typeof col.accessor === 'string';
        const value = getCellValue(col, row);
        const isActive = activeCell?.rowId === id && activeCell.columnId === col.id;
        const cellKeyStr = `${id}${col.id}`;
        const isMultiSelected = selectedCells.has(cellKeyStr);
        const isFirstCol = colIdx === 0;

        return (
          <td
            key={col.id}
            aria-selected={isActive || isMultiSelected || undefined}
            onClick={() => onCellActivate(id, col.id)}
            onMouseDown={(e) => onCellMouseDown(id, col.id, e)}
            onMouseEnter={() => onCellMouseEnter(id, col.id)}
            className={cn(
              'relative cursor-pointer select-none px-3 py-2 text-foreground',
              // active 셀: outline ring 강조 (단일 셀)
              isActive && 'z-[1] outline outline-2 -outline-offset-2 outline-ring',
              // multi-select 영역(active 제외): surface bg + 옅은 ring outline
              !isActive && isMultiSelected && 'bg-surface',
              align === 'right' && 'text-right',
              align === 'center' && 'text-center',
              (!align || align === 'left') && 'text-left',
            )}
          >
            {tree && isFirstCol ? (
              <span className="flex items-center">
                <TreeAffix
                  level={level}
                  hasChildren={hasChildren}
                  expanded={expanded}
                  onToggle={() => onToggleExpand(id)}
                />
                <span className="flex-1">
                  {isEditable ? (
                    <EditableCell
                      column={col}
                      value={value}
                      display={display}
                      align={align}
                      onCommit={(next) => onCellCommit(id, col, next)}
                    />
                  ) : (
                    display
                  )}
                </span>
              </span>
            ) : isEditable ? (
              <EditableCell
                column={col}
                value={value}
                display={display}
                align={align}
                onCommit={(next) => onCellCommit(id, col, next)}
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
// 가상화 tbody
// ─────────────────────────────────────────────────────────────────────────────

interface VirtualizedBodyProps<TRow> {
  columns: GridColumn<TRow>[];
  flatRows: FlatRow<TRow>[];
  virtualizer: Virtualizer<HTMLDivElement, Element>;
  rowHeight: number;
  selectable: boolean;
  selectedIds: Set<RowId>;
  onToggleRow: (id: RowId) => void;
  onCellCommit: (id: RowId, col: GridColumn<TRow>, value: string) => void;
  activeCell: { rowId: RowId; columnId: string } | null;
  onCellActivate: (rowId: RowId, columnId: string) => void;
  tree: boolean;
  onToggleExpand: (id: RowId) => void;
  selectedCells: Set<string>;
  onCellMouseDown: (rowId: RowId, columnId: string, e: React.MouseEvent) => void;
  onCellMouseEnter: (rowId: RowId, columnId: string) => void;
}

function VirtualizedBody<TRow>({
  columns,
  flatRows,
  virtualizer,
  rowHeight,
  selectable,
  selectedIds,
  onToggleRow,
  onCellCommit,
  activeCell,
  onCellActivate,
  tree,
  onToggleExpand,
  selectedCells,
  onCellMouseDown,
  onCellMouseEnter,
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
        const fr = flatRows[vi.index];
        if (fr === undefined) return null;
        return (
          <GridRow
            key={fr.id}
            flatRow={fr}
            columns={columns}
            selectable={selectable}
            selected={selectedIds.has(fr.id)}
            onToggle={onToggleRow}
            onCellCommit={onCellCommit}
            activeCell={activeCell}
            onCellActivate={onCellActivate}
            tree={tree}
            onToggleExpand={onToggleExpand}
            selectedCells={selectedCells}
            onCellMouseDown={onCellMouseDown}
            onCellMouseEnter={onCellMouseEnter}
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
