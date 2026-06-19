import { useVirtualizer, type Virtualizer } from '@tanstack/react-virtual';
import * as React from 'react';

import { computeAggregate } from './aggregate';
import { buildTsv, parseTsv, readClipboard, writeClipboard } from './clipboard';
import { buildCsv, downloadCsv } from './csv';
import { EditableCell } from './editable-cell';
import { FilterPopover } from './filter-popover';
import { GridPagination } from './pagination';
import { SelectionCheckbox } from './selection-checkbox';
import {
  applySortAndFilter,
  collectUniqueValues,
  nextMultiSortStates,
  nextSortState,
} from './sort-filter';
import { collectExpandableIds, flattenTree, type FlatRow } from './tree-utils';
import { useGridState } from './use-grid-state';
import { clearGridView, loadGridView, saveGridView } from './view';
import { exportXlsx as exportXlsxHelper } from './xlsx';
import { cn } from '../../lib/cn';

import type {
  GridColumn,
  GridContextMenuContext,
  GridContextMenuItem,
  GridHandle,
  GridProps,
  GridSortState,
  GridView,
} from './types';

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
    clipboard = false,
    quickFilter,
    resizable = false,
    onColumnResize,
    reorderable = false,
    onColumnReorder,
    columnVisibility: visibilityProp,
    onColumnVisibilityChange,
    showColumnMenu = false,
    showFooter = false,
    contextMenu,
    viewKey,
    onViewChange,
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

  // 1d. sort / filter 상태 — 다중 정렬을 위해 배열로 관리 (단일 정렬은 길이 1).
  const [sortStates, setSortStates] = React.useState<GridSortState[]>([]);
  const [filters, setFilters] = React.useState<Record<string, Set<string>>>({});
  // 필터 popover anchor — funnel 버튼의 clientRect를 캡처해 Portal로 띄움.
  const [openFilter, setOpenFilter] = React.useState<{
    colId: string;
    anchorRect: { left: number; top: number; bottom: number; right: number };
  } | null>(null);
  /**
   * 헤더 클릭으로 정렬 토글.
   * - 일반 클릭: 해당 컬럼만 단일 정렬 (3-state: 없음 → asc → desc → 없음). 기존 다중 정렬은 초기화.
   * - Shift+클릭: 다중 정렬 — 기존 배열에 추가/토글/제거 (asc → desc → 제거).
   */
  const toggleSort = React.useCallback((columnId: string, multi: boolean) => {
    setSortStates((prev) => {
      if (multi) return nextMultiSortStates(prev, columnId);
      // 단일 토글: prev가 길이 1이고 같은 컬럼이면 그 안에서 토글, 아니면 새 단일 배열
      const single = prev.length === 1 ? prev[0]! : null;
      const next = nextSortState(single && single.columnId === columnId ? single : null, columnId);
      return next ? [next] : [];
    });
  }, []);
  const applyFilter = React.useCallback((columnId: string, excluded: Set<string>) => {
    setFilters((prev) => ({ ...prev, [columnId]: excluded }));
  }, []);

  // 1d-2. 컬럼 표시/숨김 — controlled (props) 또는 uncontrolled (내부 state).
  //   초기값: column.hidden=true인 컬럼은 false, 나머지는 true.
  const initialVisibility = React.useMemo<Record<string, boolean>>(() => {
    const v: Record<string, boolean> = {};
    columns.forEach((c) => {
      v[c.id] = !c.hidden;
    });
    return v;
  }, [columns]);
  const [internalVisibility, setInternalVisibility] =
    React.useState<Record<string, boolean>>(initialVisibility);
  const columnVisibility = visibilityProp ?? internalVisibility;
  const setVisibility = React.useCallback(
    (next: Record<string, boolean>) => {
      if (onColumnVisibilityChange) onColumnVisibilityChange(next);
      if (visibilityProp === undefined) setInternalVisibility(next);
    },
    [visibilityProp, onColumnVisibilityChange],
  );
  const toggleColumnVisibility = React.useCallback(
    (columnId: string) => {
      setVisibility({ ...columnVisibility, [columnId]: !(columnVisibility[columnId] !== false) });
    },
    [columnVisibility, setVisibility],
  );
  // 1d-3. 컬럼 순서 (drag&drop) — columnId 배열로 관리. columns props가 바뀌면 merge.
  const [columnOrder, setColumnOrder] = React.useState<string[]>(() => columns.map((c) => c.id));
  /**
   * 컬럼 순서 변경 적용 — source를 target 위치로 이동.
   * 같은 pin 그룹 안에서만 이동 가능 (서로 다른 pin이면 swap 안 됨 — pin 경계 유지).
   */
  const reorderColumn = React.useCallback(
    (sourceId: string, targetId: string) => {
      if (sourceId === targetId) return;
      const src = columns.find((c) => c.id === sourceId);
      const tgt = columns.find((c) => c.id === targetId);
      // 다른 pin 그룹이면 이동 차단
      if (!src || !tgt || (src.pin ?? null) !== (tgt.pin ?? null)) return;
      setColumnOrder((prev) => {
        const fromIdx = prev.indexOf(sourceId);
        const toIdx = prev.indexOf(targetId);
        if (fromIdx < 0 || toIdx < 0) return prev;
        const next = [...prev];
        next.splice(fromIdx, 1);
        next.splice(toIdx, 0, sourceId);
        onColumnReorder?.(next);
        return next;
      });
    },
    [columns, onColumnReorder],
  );
  React.useEffect(() => {
    // 새 columns prop과 sync — 기존 순서는 보존, 신규 컬럼은 끝에 append, 사라진 컬럼은 제거.
    setColumnOrder((prev) => {
      const knownPrev = new Set(prev);
      const newIds = columns.map((c) => c.id);
      const newSet = new Set(newIds);
      const filtered = prev.filter((id) => newSet.has(id));
      const appended = newIds.filter((id) => !knownPrev.has(id));
      if (filtered.length === prev.length && appended.length === 0) return prev;
      return [...filtered, ...appended];
    });
  }, [columns]);
  // 화면에 실제 렌더할 컬럼 — drag 순서 적용 → visibility 필터 → pin 그룹 정렬.
  //   순서: left-pinned → unpinned → right-pinned. 모든 컬럼 인덱스 비교는 이 순서 기준.
  const visibleColumns = React.useMemo(() => {
    const byId = new Map(columns.map((c) => [c.id, c]));
    const ordered = columnOrder
      .map((id) => byId.get(id))
      .filter((c): c is GridColumn<TRow> => c !== undefined);
    const filtered = ordered.filter((c) => columnVisibility[c.id] !== false);
    const left = filtered.filter((c) => c.pin === 'left');
    const middle = filtered.filter((c) => !c.pin);
    const right = filtered.filter((c) => c.pin === 'right');
    return [...left, ...middle, ...right];
  }, [columns, columnOrder, columnVisibility]);
  // 컬럼 메뉴 popover open/close
  const [columnMenuOpen, setColumnMenuOpen] = React.useState(false);

  // 1e. 컬럼 폭 — 리사이즈 결과를 저장. column.width를 override.
  const [columnWidths, setColumnWidths] = React.useState<Record<string, number>>({});
  // 1e-2. pin offsets — sticky 위치 누적 계산용. visibleColumns 또는 폭이 바뀌면 재계산.
  /**
   * 각 컬럼의 sticky 위치 (px). left/right 둘 중 하나만 채워짐.
   * - `isEdge`: pin 블록의 안쪽 경계 컬럼 (좌측 마지막 / 우측 첫번째) — 경계선 표시용
   * - 폭 미지정 시 fallback 120px (실제 측정값과 다를 수 있지만 sticky는 동작)
   */
  const pinOffsets = React.useMemo(() => {
    const map: Record<string, { left?: number; right?: number; isEdge?: boolean }> = {};
    const resolveWidth = (col: GridColumn<TRow>): number =>
      columnWidths[col.id] ?? (typeof col.width === 'number' ? col.width : 120);
    const leftCols = visibleColumns.filter((c) => c.pin === 'left');
    const rightCols = visibleColumns.filter((c) => c.pin === 'right');
    let cum = 0;
    leftCols.forEach((c, i) => {
      map[c.id] = { left: cum, isEdge: i === leftCols.length - 1 };
      cum += resolveWidth(c);
    });
    cum = 0;
    for (let i = rightCols.length - 1; i >= 0; i -= 1) {
      const c = rightCols[i]!;
      map[c.id] = { right: cum, isEdge: i === 0 };
      cum += resolveWidth(c);
    }
    return map;
  }, [visibleColumns, columnWidths]);
  // 드래그 중인 상태 — mousedown ~ mouseup 사이만 유효.
  const resizingRef = React.useRef<{
    columnId: string;
    startX: number;
    startWidth: number;
    minWidth: number;
    maxWidth: number | undefined;
  } | null>(null);
  /**
   * 리사이즈 핸들 mousedown — 드래그 시작.
   * - 시작 시점의 헤더 셀 폭을 측정 (column.width 또는 columnWidths 또는 실제 px)
   * - 전역 mousemove로 폭 갱신, mouseup으로 종료 + onColumnResize 콜백.
   */
  const handleResizeMouseDown = React.useCallback(
    (e: React.MouseEvent, col: GridColumn<TRow>) => {
      e.preventDefault();
      e.stopPropagation(); // sortable th onClick과 충돌 방지
      const th = (e.currentTarget as HTMLElement).closest('th') as HTMLTableCellElement | null;
      const rect = th?.getBoundingClientRect();
      const startWidth = columnWidths[col.id] ?? rect?.width ?? 100;
      resizingRef.current = {
        columnId: col.id,
        startX: e.clientX,
        startWidth,
        minWidth: col.minWidth ?? 60,
        maxWidth: col.maxWidth,
      };
    },
    [columnWidths],
  );
  React.useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const ctx = resizingRef.current;
      if (!ctx) return;
      const delta = e.clientX - ctx.startX;
      let next = ctx.startWidth + delta;
      if (next < ctx.minWidth) next = ctx.minWidth;
      if (ctx.maxWidth !== undefined && next > ctx.maxWidth) next = ctx.maxWidth;
      setColumnWidths((prev) =>
        prev[ctx.columnId] === next ? prev : { ...prev, [ctx.columnId]: Math.round(next) },
      );
    };
    const onUp = () => {
      const ctx = resizingRef.current;
      if (!ctx) return;
      resizingRef.current = null;
      // 외부 영속화 콜백 — 최종 폭만 알림.
      onColumnResize?.(ctx.columnId, columnWidths[ctx.columnId] ?? ctx.startWidth);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, [onColumnResize, columnWidths]);

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
    return applySortAndFilter(base, columns, filters, sortStates, tree, quickFilter);
  }, [
    tree,
    getChildren,
    data,
    expandedIds,
    state.rows,
    resolveRowId,
    columns,
    filters,
    sortStates,
    quickFilter,
  ]);

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

  // XLSX export — exceljs 동적 로드. Promise 반환.
  const exportXlsx = React.useCallback(
    async (options?: {
      filename?: string;
      sheetName?: string;
      rows?: TRow[];
      styledHeader?: boolean;
    }): Promise<void> => {
      const targetRows = options?.rows ?? state.getSavedData();
      await exportXlsxHelper(columns, targetRows, {
        filename: options?.filename,
        sheetName: options?.sheetName,
        styledHeader: options?.styledHeader,
      });
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
      exportXlsx,
      getColumnVisibility: () => columnVisibility,
      toggleColumnVisibility,
      getView: () => ({
        sortStates,
        columnWidths,
        columnVisibility: internalVisibility,
        columnOrder,
      }),
      setView: (view) => {
        if (view.sortStates !== undefined) setSortStates(view.sortStates);
        if (view.columnWidths !== undefined) setColumnWidths(view.columnWidths);
        if (view.columnVisibility !== undefined) setInternalVisibility(view.columnVisibility);
        if (view.columnOrder !== undefined) setColumnOrder(view.columnOrder);
      },
      clearView: () => {
        setSortStates([]);
        setColumnWidths({});
        setInternalVisibility(initialVisibility);
        setColumnOrder(columns.map((c) => c.id));
        if (viewKey) clearGridView(viewKey);
      },
    }),
    [
      state,
      addRow,
      removeSelectedRows,
      clearSelectedCells,
      exportCsv,
      exportXlsx,
      columnVisibility,
      toggleColumnVisibility,
      sortStates,
      columnWidths,
      internalVisibility,
      columnOrder,
      initialVisibility,
      columns,
      viewKey,
    ],
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
      const colIds = visibleColumns.map((c) => c.id);
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

  // 10-a. 선택된 셀 → TSV 직렬화 후 clipboard 쓰기 (Ctrl+C).
  //   selectedCells가 비어있으면 activeCell만. 사각형 bounding box 안의 모든 셀 값을 행렬로.
  const copySelectedCells = React.useCallback(async (): Promise<void> => {
    if (cellSelection === 'none') return;
    interface Pos {
      rowIdx: number;
      colIdx: number;
    }
    const positions: Pos[] = [];
    if (selectedCells.size > 0) {
      selectedCells.forEach((key) => {
        const sep = key.indexOf('\x1F');
        if (sep < 0) return;
        const rawId = key.slice(0, sep);
        const colId = key.slice(sep + 1);
        const asNum = Number(rawId);
        const rowId = Number.isFinite(asNum) && String(asNum) === rawId ? asNum : rawId;
        const rIdx = visibleFlatRows.findIndex((fr) => fr.id === rowId);
        const cIdx = visibleColumns.findIndex((c) => c.id === colId);
        if (rIdx >= 0 && cIdx >= 0) positions.push({ rowIdx: rIdx, colIdx: cIdx });
      });
    } else if (activeCell) {
      const rIdx = visibleFlatRows.findIndex((fr) => fr.id === activeCell.rowId);
      const cIdx = visibleColumns.findIndex((c) => c.id === activeCell.columnId);
      if (rIdx >= 0 && cIdx >= 0) positions.push({ rowIdx: rIdx, colIdx: cIdx });
    }
    if (positions.length === 0) return;
    // bounding rect 계산
    let minRow = Infinity;
    let maxRow = -Infinity;
    let minCol = Infinity;
    let maxCol = -Infinity;
    positions.forEach((p) => {
      if (p.rowIdx < minRow) minRow = p.rowIdx;
      if (p.rowIdx > maxRow) maxRow = p.rowIdx;
      if (p.colIdx < minCol) minCol = p.colIdx;
      if (p.colIdx > maxCol) maxCol = p.colIdx;
    });
    // bounding rect 전체 셀 값으로 matrix 생성 (사용자가 사각형 선택했을 때 자연스러움)
    const matrix: unknown[][] = [];
    for (let r = minRow; r <= maxRow; r += 1) {
      const flatRow = visibleFlatRows[r];
      if (!flatRow) continue;
      const row: unknown[] = [];
      for (let c = minCol; c <= maxCol; c += 1) {
        const col = visibleColumns[c];
        if (!col) continue;
        row.push(getCellValue(col, flatRow.row));
      }
      matrix.push(row);
    }
    const tsv = buildTsv(matrix);
    await writeClipboard(tsv);
  }, [cellSelection, selectedCells, activeCell, visibleFlatRows, visibleColumns]);

  // 10-c. 키보드 네비게이션 — 화살표/Tab/Enter/Home/End/Page로 active 셀 이동.
  //   visibleColumns / visibleFlatRows 인덱스 기반. 경계 도달 시 stop (wrap X).
  const navigateCell = React.useCallback(
    (
      dir:
        | 'up'
        | 'down'
        | 'left'
        | 'right'
        | 'home'
        | 'end'
        | 'rowStart'
        | 'rowEnd'
        | 'gridStart'
        | 'gridEnd',
    ) => {
      if (cellSelection === 'none') return;
      // activeCell 없으면 첫 셀로
      let rowIdx = activeCell ? visibleFlatRows.findIndex((fr) => fr.id === activeCell.rowId) : -1;
      let colIdx = activeCell ? visibleColumns.findIndex((c) => c.id === activeCell.columnId) : -1;
      if (rowIdx < 0) rowIdx = 0;
      if (colIdx < 0) colIdx = 0;
      const lastRow = visibleFlatRows.length - 1;
      const lastCol = visibleColumns.length - 1;
      switch (dir) {
        case 'up':
          rowIdx = Math.max(0, rowIdx - 1);
          break;
        case 'down':
          rowIdx = Math.min(lastRow, rowIdx + 1);
          break;
        case 'left':
          colIdx = Math.max(0, colIdx - 1);
          break;
        case 'right':
          colIdx = Math.min(lastCol, colIdx + 1);
          break;
        case 'home':
          colIdx = 0;
          break;
        case 'end':
          colIdx = lastCol;
          break;
        case 'rowStart':
          colIdx = 0;
          break;
        case 'rowEnd':
          colIdx = lastCol;
          break;
        case 'gridStart':
          rowIdx = 0;
          colIdx = 0;
          break;
        case 'gridEnd':
          rowIdx = lastRow;
          colIdx = lastCol;
          break;
      }
      const flatRow = visibleFlatRows[rowIdx];
      const col = visibleColumns[colIdx];
      if (!flatRow || !col) return;
      setActiveCell({ rowId: flatRow.id, columnId: col.id });
      setSelectedCells(new Set([cellKey(flatRow.id, col.id)]));
    },
    [cellSelection, activeCell, visibleFlatRows, visibleColumns],
  );

  // active 셀이 바뀌면 스크롤 영역 안으로 자동 스크롤 (가상화 모드 포함).
  React.useEffect(() => {
    if (!activeCell || !scrollRef.current) return;
    const scrollEl = scrollRef.current;
    // aria-selected="true"인 셀을 찾아 scrollIntoView. nearest로 최소 이동.
    // jsdom에는 scrollIntoView가 없을 수 있으므로 가드.
    const cellEl = scrollEl.querySelector('td[aria-selected="true"]');
    if (cellEl instanceof HTMLElement && typeof cellEl.scrollIntoView === 'function') {
      cellEl.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }, [activeCell]);

  // 10-b. clipboard TSV → activeCell 위치부터 셀에 일괄 입력 (Ctrl+V).
  //   accessor가 string key인 컬럼만 적용 (함수 accessor는 set 불가 → 스킵).
  const pasteFromClipboard = React.useCallback(async (): Promise<void> => {
    if (cellSelection === 'none' || !activeCell) return;
    const tsv = await readClipboard();
    if (!tsv) return;
    const matrix = parseTsv(tsv);
    if (matrix.length === 0) return;
    const startRow = visibleFlatRows.findIndex((fr) => fr.id === activeCell.rowId);
    const startCol = visibleColumns.findIndex((c) => c.id === activeCell.columnId);
    if (startRow < 0 || startCol < 0) return;
    matrix.forEach((rowValues, r) => {
      const targetIdx = startRow + r;
      if (targetIdx >= visibleFlatRows.length) return;
      const flatRow = visibleFlatRows[targetIdx];
      if (!flatRow) return;
      rowValues.forEach((value, c) => {
        const colIdx = startCol + c;
        if (colIdx >= visibleColumns.length) return;
        const col = visibleColumns[colIdx];
        if (!col || typeof col.accessor !== 'string') return;
        state.editCell(flatRow.id, col.accessor, value);
      });
    });
  }, [cellSelection, activeCell, visibleFlatRows, visibleColumns, state]);

  // 10-d. 컨텍스트 메뉴 — 우클릭 위치(x,y) + 셀 context 저장. 닫으면 null.
  const [ctxMenuState, setCtxMenuState] = React.useState<{
    x: number;
    y: number;
    ctx: GridContextMenuContext<TRow>;
  } | null>(null);
  /**
   * 셀 우클릭 핸들러 — `contextMenu` prop이 설정돼 있을 때만 동작.
   * 브라우저 기본 메뉴를 막고, 클릭한 셀 정보(rowId, columnId, row, selectedRowIds)를
   * 캡처해 상태에 저장 → ContextMenuPopover가 렌더됨.
   */
  const handleCellContextMenu = React.useCallback(
    (rowId: RowId, columnId: string, row: TRow, e: React.MouseEvent) => {
      if (!contextMenu) return;
      e.preventDefault();
      const ctx: GridContextMenuContext<TRow> = {
        rowId,
        columnId,
        row,
        selectedRowIds: Array.from(state.selectedIds),
      };
      setCtxMenuState({ x: e.clientX, y: e.clientY, ctx });
    },
    [contextMenu, state.selectedIds],
  );

  // 10-e. View 영속화 — viewKey 지정 시 첫 마운트에 load, 이후 변경 시 자동 save.
  //   초기 로드 완료 플래그 — 첫 save가 이전 load 직후 트리거되어 같은 값을 쓰는 것은 무해.
  React.useEffect(() => {
    if (!viewKey) return;
    const loaded = loadGridView(viewKey);
    if (!loaded) return;
    if (loaded.sortStates) setSortStates(loaded.sortStates);
    if (loaded.columnWidths) setColumnWidths(loaded.columnWidths);
    if (loaded.columnVisibility) setInternalVisibility(loaded.columnVisibility);
    if (loaded.columnOrder) setColumnOrder(loaded.columnOrder);
    // load는 mount 시 1회만. viewKey 변경에는 미반응 (그 경우 컴포넌트 재마운트가 일반적).
  }, []); // eslint-disable-line
  // 변경 감지 → save + onViewChange 콜백.
  React.useEffect(() => {
    const view: GridView = {
      sortStates,
      columnWidths,
      columnVisibility: internalVisibility,
      columnOrder,
    };
    if (viewKey) saveGridView(viewKey, view);
    onViewChange?.(view);
  }, [viewKey, onViewChange, sortStates, columnWidths, internalVisibility, columnOrder]);

  // 10. 키 입력 핸들러 — Delete/Backspace, Ctrl+C, Ctrl+V를 한 곳에서 처리.
  const handleContainerKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const inEditor =
        target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT';

      // Ctrl+C / Cmd+C — 선택된 셀 TSV 복사
      if (
        clipboard &&
        cellSelection !== 'none' &&
        !inEditor &&
        (e.ctrlKey || e.metaKey) &&
        (e.key === 'c' || e.key === 'C')
      ) {
        e.preventDefault();
        void copySelectedCells();
        return;
      }
      // Ctrl+V / Cmd+V — clipboard TSV 붙여넣기
      if (
        clipboard &&
        cellSelection !== 'none' &&
        !inEditor &&
        (e.ctrlKey || e.metaKey) &&
        (e.key === 'v' || e.key === 'V')
      ) {
        e.preventDefault();
        void pasteFromClipboard();
        return;
      }
      // Delete/Backspace — 선택된 셀 값 클리어 (clearOnDelete 옵션)
      if (
        clearOnDelete &&
        cellSelection !== 'none' &&
        (e.key === 'Delete' || e.key === 'Backspace')
      ) {
        if (inEditor) return;
        e.preventDefault();
        clearSelectedCells();
        return;
      }

      // 키보드 네비게이션 — cellSelection !== 'none'이면 항상 활성.
      //   편집 input 안에서는 입력 우선 (편집 input의 키 핸들러가 자체 처리).
      if (cellSelection === 'none' || inEditor) return;
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          navigateCell(e.ctrlKey || e.metaKey ? 'gridStart' : 'up');
          return;
        case 'ArrowDown':
          e.preventDefault();
          navigateCell(e.ctrlKey || e.metaKey ? 'gridEnd' : 'down');
          return;
        case 'ArrowLeft':
          e.preventDefault();
          navigateCell('left');
          return;
        case 'ArrowRight':
          e.preventDefault();
          navigateCell('right');
          return;
        case 'Tab':
          e.preventDefault();
          navigateCell(e.shiftKey ? 'left' : 'right');
          return;
        case 'Enter':
          e.preventDefault();
          navigateCell(e.shiftKey ? 'up' : 'down');
          return;
        case 'Home':
          e.preventDefault();
          navigateCell(e.ctrlKey || e.metaKey ? 'gridStart' : 'rowStart');
          return;
        case 'End':
          e.preventDefault();
          navigateCell(e.ctrlKey || e.metaKey ? 'gridEnd' : 'rowEnd');
          return;
      }
    },
    [
      clipboard,
      clearOnDelete,
      cellSelection,
      copySelectedCells,
      pasteFromClipboard,
      clearSelectedCells,
      navigateCell,
    ],
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
  const colSpan = visibleColumns.length + (selectable ? 1 : 0);

  return (
    <div
      ref={containerRef}
      tabIndex={cellSelection !== 'none' ? 0 : undefined}
      onKeyDown={handleContainerKeyDown}
      className={cn(
        'flex flex-col border border-border-default outline-none',
        // autoSize 시 부모 컨테이너에 꽉 맞춤 (caller 측이 부모 div에 명시적 height을 줘야 함)
        autoSize && 'h-full w-full',
        className,
      )}
      {...props}
    >
      {showColumnMenu && (
        // 툴바 — 우측 정렬, 그리드 외부의 간단한 영역. 우상단 ⚙️ 버튼만 표시.
        <div className="relative flex items-center justify-end border-b border-border-default bg-surface px-2 py-1">
          <button
            type="button"
            aria-label="컬럼 표시 메뉴"
            aria-haspopup="dialog"
            aria-expanded={columnMenuOpen}
            onClick={() => setColumnMenuOpen((v) => !v)}
            className="inline-flex h-7 items-center gap-1 rounded px-2 text-xs text-foreground hover:bg-surface-strong"
          >
            <span aria-hidden="true" className="text-sm leading-none">
              ⚙
            </span>
            컬럼
          </button>
          {columnMenuOpen && (
            <ColumnVisibilityMenu
              columns={columns}
              visibility={columnVisibility}
              onToggle={toggleColumnVisibility}
              onClose={() => setColumnMenuOpen(false)}
            />
          )}
        </div>
      )}
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
              {visibleColumns.map((col) => {
                const sortIdx = sortStates.findIndex((s) => s.columnId === col.id);
                const isSorted = sortIdx >= 0;
                const sortDir = isSorted ? sortStates[sortIdx]!.direction : null;
                const sortIcon = !col.sortable
                  ? null
                  : !isSorted
                    ? '↕'
                    : sortDir === 'asc'
                      ? '▲'
                      : '▼';
                const filterActive = (filters[col.id]?.size ?? 0) > 0;
                const isFilterOpen = openFilter?.colId === col.id;
                const isColResizable = resizable && col.resizable !== false;
                const effectiveWidth = columnWidths[col.id] ?? col.width;
                const pin = pinOffsets[col.id];
                return (
                  <th
                    key={col.id}
                    scope="col"
                    aria-sort={!isSorted ? 'none' : sortDir === 'asc' ? 'ascending' : 'descending'}
                    className={cn(
                      // relative — FilterPopover absolute 위치 기준점, resize 핸들 absolute 기준점.
                      'relative border-b border-border-default px-3 py-2 font-medium text-foreground',
                      col.sortable && 'cursor-pointer select-none hover:bg-surface-strong',
                      col.align === 'right' && 'text-right',
                      col.align === 'center' && 'text-center',
                      (!col.align || col.align === 'left') && 'text-left',
                      // pin 컬럼은 불투명 배경 필수 (sticky 시 뒤 콘텐츠가 비치지 않게)
                      pin && 'bg-surface',
                      // pin 블록 안쪽 경계에 강한 선 (시각적 구분)
                      pin?.left !== undefined && pin.isEdge && 'border-r border-border-strong',
                      pin?.right !== undefined && pin.isEdge && 'border-l border-border-strong',
                    )}
                    style={{
                      width: effectiveWidth,
                      minWidth: col.minWidth,
                      maxWidth: col.maxWidth,
                      // sticky pin — 헤더는 가로/세로 모두 sticky가 되도록 z-index 상승
                      position: pin ? 'sticky' : undefined,
                      left: pin?.left,
                      right: pin?.right,
                      zIndex: pin ? 11 : undefined,
                    }}
                    onClick={col.sortable ? (e) => toggleSort(col.id, e.shiftKey) : undefined}
                    // 컬럼 드래그&드롭 (reorderable) — 리사이즈 핸들 영역 제외.
                    draggable={reorderable && col.draggable !== false}
                    onDragStart={
                      reorderable && col.draggable !== false
                        ? (e) => {
                            // 리사이즈 핸들에서 시작된 mousedown은 drag로 이어지지 않게 차단
                            const target = e.target as HTMLElement;
                            if (target.getAttribute('role') === 'separator') {
                              e.preventDefault();
                              return;
                            }
                            e.dataTransfer.setData('text/plain', col.id);
                            e.dataTransfer.effectAllowed = 'move';
                          }
                        : undefined
                    }
                    onDragOver={
                      reorderable
                        ? (e) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = 'move';
                          }
                        : undefined
                    }
                    onDrop={
                      reorderable
                        ? (e) => {
                            e.preventDefault();
                            const sourceId = e.dataTransfer.getData('text/plain');
                            if (sourceId) reorderColumn(sourceId, col.id);
                          }
                        : undefined
                    }
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
                      {isSorted && sortStates.length > 1 && (
                        // 다중 정렬일 때만 순서 번호 표시
                        <span
                          aria-hidden="true"
                          className="text-[10px] leading-none text-foreground-subtle"
                        >
                          {sortIdx + 1}
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
                    {isColResizable && (
                      // 리사이즈 핸들 — 헤더 우측 4px 영역. cursor: col-resize.
                      <span
                        role="separator"
                        aria-orientation="vertical"
                        aria-label={`${typeof col.header === 'string' ? col.header : col.id} 컬럼 폭 조절`}
                        onMouseDown={(e) => handleResizeMouseDown(e, col)}
                        className="absolute right-0 top-0 z-10 h-full w-1 cursor-col-resize select-none hover:bg-border-strong active:bg-border-strong"
                      />
                    )}
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
              columns={visibleColumns}
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
              pinOffsets={pinOffsets}
              columnWidths={columnWidths}
              onCellContextMenu={contextMenu ? handleCellContextMenu : undefined}
            />
          ) : (
            <tbody>
              {visibleFlatRows.map((fr) => (
                <GridRow
                  key={fr.id}
                  flatRow={fr}
                  columns={visibleColumns}
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
                  pinOffsets={pinOffsets}
                  columnWidths={columnWidths}
                  onCellContextMenu={contextMenu ? handleCellContextMenu : undefined}
                />
              ))}
            </tbody>
          )}
          {showFooter && (
            // 집계 푸터 — visible 행 기준. 컬럼별 aggregate 결과를 td에 표시.
            //   sticky bottom: 가로 스크롤 시 푸터가 항상 보이도록.
            <tfoot className="sticky bottom-0 z-10 bg-surface">
              <tr>
                {selectable && <td className="w-10 border-t border-border-default px-3 py-2" />}
                {visibleColumns.map((col) => {
                  const result = computeAggregate(
                    col,
                    visibleFlatRows.map((fr) => fr.row),
                  );
                  const pin = pinOffsets[col.id];
                  return (
                    <td
                      key={col.id}
                      className={cn(
                        'border-t border-border-default px-3 py-2 font-medium text-foreground',
                        col.align === 'right' && 'text-right',
                        col.align === 'center' && 'text-center',
                        (!col.align || col.align === 'left') && 'text-left',
                        pin && 'bg-background',
                      )}
                      style={{
                        position: pin ? 'sticky' : undefined,
                        left: pin?.left,
                        right: pin?.right,
                        zIndex: pin ? 11 : undefined,
                      }}
                    >
                      {result == null
                        ? ''
                        : typeof result === 'number'
                          ? // 소수점 2자리까지만 표시 (avg 결과 등)
                            Number.isInteger(result)
                            ? result.toLocaleString()
                            : result.toLocaleString(undefined, { maximumFractionDigits: 2 })
                          : (result as React.ReactNode)}
                    </td>
                  );
                })}
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {pageSize > 0 && showPagination && (
        <GridPagination page={page} pageCount={pageCount} onPageChange={setPage} />
      )}

      {ctxMenuState &&
        (() => {
          // 기본 메뉴 빌더 — exportXlsx는 async라 wrapper로 감쌈.
          const defaultItems = buildDefaultContextMenuItems<TRow>({
            hasClipboard: clipboard,
            hasSelection: state.selectedIds.size > 0,
            copy: () => void copySelectedCells(),
            paste: () => void pasteFromClipboard(),
            clearCells: () => clearSelectedCells(),
            deleteRows: () => state.deleteSelected(),
            exportCsv: () => exportCsv(),
            exportXlsx: () => void exportXlsx(),
          });
          const items =
            typeof contextMenu === 'function' ? contextMenu(ctxMenuState.ctx) : defaultItems;
          if (items.length === 0) return null;
          return (
            <GridContextMenuPopover
              x={ctxMenuState.x}
              y={ctxMenuState.y}
              items={items}
              ctx={ctxMenuState.ctx}
              onClose={() => setCtxMenuState(null)}
            />
          );
        })()}

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

/**
 * 컨텍스트 메뉴 popover — 우클릭 위치(x,y)에 절대 위치로 표시.
 * 바깥 클릭 / Esc → 닫힘. 항목 클릭 시 onClick 실행 후 닫힘.
 */
function GridContextMenuPopover<TRow>({
  x,
  y,
  items,
  ctx,
  onClose,
}: {
  x: number;
  y: number;
  items: GridContextMenuItem<TRow>[];
  ctx: GridContextMenuContext<TRow>;
  onClose: () => void;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      role="menu"
      aria-label="셀 컨텍스트 메뉴"
      style={{ position: 'fixed', left: x, top: y, zIndex: 50 }}
      className="min-w-[180px] border border-border-default bg-background py-1 shadow-md"
    >
      {items.map((item, i) => {
        if (item.separator) {
          return (
            <div key={`sep-${i}`} role="separator" className="my-1 border-t border-border-subtle" />
          );
        }
        return (
          <button
            key={item.id ?? `item-${i}`}
            type="button"
            role="menuitem"
            disabled={item.disabled}
            onClick={() => {
              if (item.disabled) return;
              item.onClick?.(ctx);
              onClose();
            }}
            className={cn(
              'flex w-full items-center justify-between gap-4 px-3 py-1.5 text-left text-xs',
              item.disabled
                ? 'cursor-not-allowed text-foreground-subtle'
                : 'cursor-pointer text-foreground hover:bg-surface',
            )}
          >
            <span>{item.label}</span>
            {item.shortcut && <span className="text-foreground-subtle">{item.shortcut}</span>}
          </button>
        );
      })}
    </div>
  );
}

/**
 * 기본 컨텍스트 메뉴 항목 빌더 — contextMenu=true일 때 사용.
 * 활성/비활성은 호출자가 전달한 가용성 flag 기반.
 */
function buildDefaultContextMenuItems<TRow>(api: {
  hasClipboard: boolean;
  hasSelection: boolean;
  copy: () => void;
  paste: () => void;
  clearCells: () => void;
  deleteRows: () => void;
  exportCsv: () => void;
  exportXlsx: () => void;
}): GridContextMenuItem<TRow>[] {
  return [
    { id: 'copy', label: '복사', shortcut: 'Ctrl+C', onClick: api.copy },
    {
      id: 'paste',
      label: '붙여넣기',
      shortcut: 'Ctrl+V',
      onClick: api.paste,
      disabled: !api.hasClipboard,
    },
    { id: 'clear', label: '셀 클리어', shortcut: 'Delete', onClick: api.clearCells },
    { separator: true },
    {
      id: 'delete-row',
      label: '선택 행 삭제',
      onClick: api.deleteRows,
      disabled: !api.hasSelection,
    },
    { separator: true },
    { id: 'export-csv', label: 'CSV 내보내기', onClick: api.exportCsv },
    { id: 'export-xlsx', label: 'Excel 내보내기', onClick: api.exportXlsx },
  ];
}

/**
 * 컬럼 표시/숨김 popover — 우상단 ⚙️ 버튼에서 펼침.
 * column.hideable=false인 컬럼은 표시 안 됨.
 * 바깥 클릭 / Esc → onClose.
 */
function ColumnVisibilityMenu<TRow>({
  columns,
  visibility,
  onToggle,
  onClose,
}: {
  columns: GridColumn<TRow>[];
  visibility: Record<string, boolean>;
  onToggle: (columnId: string) => void;
  onClose: () => void;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const hideableCols = columns.filter((c) => c.hideable !== false);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="컬럼 표시 설정"
      className="absolute right-2 top-full z-20 mt-1 min-w-[180px] border border-border-default bg-background py-1 shadow-md"
    >
      {hideableCols.map((c) => {
        const visible = visibility[c.id] !== false;
        const label = typeof c.header === 'string' ? c.header : c.id;
        return (
          <label
            key={c.id}
            className="flex cursor-pointer items-center gap-2 px-3 py-1.5 text-xs text-foreground hover:bg-surface"
          >
            <input
              type="checkbox"
              checked={visible}
              onChange={() => onToggle(c.id)}
              className="h-3.5 w-3.5"
            />
            <span>{label}</span>
          </label>
        );
      })}
    </div>
  );
}

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
  /** pin 위치 맵 — columnId → { left|right offset, isEdge }. 없으면 모두 unpinned. */
  pinOffsets?: Record<string, { left?: number; right?: number; isEdge?: boolean }>;
  /** 리사이즈로 변경된 컬럼 폭 — cell width 적용용. */
  columnWidths?: Record<string, number>;
  /** 셀 우클릭 핸들러 — contextMenu가 활성일 때만 전달. */
  onCellContextMenu?: (rowId: RowId, columnId: string, row: TRow, e: React.MouseEvent) => void;
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
  pinOffsets,
  columnWidths,
  onCellContextMenu,
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
        const pin = pinOffsets?.[col.id];
        const userCellStyle = col.cellStyle?.(value, row);
        const userCellClass = col.cellClassName?.(value, row);
        const effectiveWidth = columnWidths?.[col.id] ?? col.width;

        return (
          <td
            key={col.id}
            aria-selected={isActive || isMultiSelected || undefined}
            onClick={() => onCellActivate(id, col.id)}
            onMouseDown={(e) => onCellMouseDown(id, col.id, e)}
            onMouseEnter={() => onCellMouseEnter(id, col.id)}
            onContextMenu={
              onCellContextMenu ? (e) => onCellContextMenu(id, col.id, row, e) : undefined
            }
            className={cn(
              'relative cursor-pointer select-none px-3 py-2 text-foreground',
              // active 셀: outline ring 강조 (단일 셀)
              isActive && 'z-[1] outline outline-2 -outline-offset-2 outline-ring',
              // multi-select 영역(active 제외): surface bg + 옅은 ring outline
              !isActive && isMultiSelected && 'bg-surface',
              align === 'right' && 'text-right',
              align === 'center' && 'text-center',
              (!align || align === 'left') && 'text-left',
              // pin: 불투명 배경 필수 (sticky 시 뒤 행이 비치지 않게) + 안쪽 경계선
              pin && 'bg-background',
              pin?.left !== undefined && pin.isEdge && 'border-r border-border-strong',
              pin?.right !== undefined && pin.isEdge && 'border-l border-border-strong',
              userCellClass,
            )}
            style={{
              width: effectiveWidth,
              position: pin ? 'sticky' : undefined,
              left: pin?.left,
              right: pin?.right,
              zIndex: pin ? 2 : undefined,
              ...userCellStyle,
            }}
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
  pinOffsets?: Record<string, { left?: number; right?: number; isEdge?: boolean }>;
  columnWidths?: Record<string, number>;
  onCellContextMenu?: (rowId: RowId, columnId: string, row: TRow, e: React.MouseEvent) => void;
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
  pinOffsets,
  columnWidths,
  onCellContextMenu,
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
            pinOffsets={pinOffsets}
            columnWidths={columnWidths}
            onCellContextMenu={onCellContextMenu}
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
