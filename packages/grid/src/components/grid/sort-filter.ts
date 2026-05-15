import type { FlatRow } from './tree-utils';
import type { GridColumn, GridSortState } from './types';

/**
 * 값 비교 — null/undefined은 끝으로, Date는 timestamp, number는 산술,
 * 그 외는 localeCompare(numeric=true)로 비교.
 */
function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true });
}

/** 컬럼에서 row 값 추출 (accessor 함수/key 모두 지원). */
function getValue<TRow>(column: GridColumn<TRow>, row: TRow): unknown {
  return typeof column.accessor === 'function'
    ? column.accessor(row)
    : (row as Record<string, unknown>)[column.accessor as string];
}

/**
 * filter + sort를 차례로 적용해 최종 FlatRow 배열을 반환.
 *
 * - filter: 각 활성 필터에 대해 컬럼 값을 부분 일치(case-insensitive) 검사
 * - sort: 트리 모드면 skip (부모-자식 구조 보존). 아니면 accessor 값 기준 정렬
 */
export function applySortAndFilter<TRow>(
  rows: FlatRow<TRow>[],
  columns: GridColumn<TRow>[],
  filters: Record<string, string>,
  sort: GridSortState | null,
  tree: boolean,
): FlatRow<TRow>[] {
  let result = rows;

  // 1. filter
  const activeFilters = Object.entries(filters).filter(([, v]) => v.trim() !== '');
  if (activeFilters.length > 0) {
    result = result.filter((fr) =>
      activeFilters.every(([colId, query]) => {
        const col = columns.find((c) => c.id === colId);
        if (!col) return true;
        const v = getValue(col, fr.row);
        if (v == null) return false;
        return String(v).toLowerCase().includes(query.toLowerCase());
      }),
    );
  }

  // 2. sort — 트리 모드에서는 hierarchy 보존을 위해 무시
  if (sort && !tree) {
    const col = columns.find((c) => c.id === sort.columnId);
    if (col) {
      const dir = sort.direction === 'asc' ? 1 : -1;
      result = [...result].sort(
        (a, b) => compareValues(getValue(col, a.row), getValue(col, b.row)) * dir,
      );
    }
  }

  return result;
}

/**
 * sort 3-state 토글: 없음 → asc → desc → 없음.
 */
export function nextSortState(
  current: GridSortState | null,
  columnId: string,
): GridSortState | null {
  if (!current || current.columnId !== columnId) return { columnId, direction: 'asc' };
  if (current.direction === 'asc') return { columnId, direction: 'desc' };
  return null;
}
