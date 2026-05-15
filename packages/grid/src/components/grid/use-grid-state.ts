import * as React from 'react';

type RowId = string | number;

/**
 * Grid의 편집·삭제·선택 상태를 한 곳에서 관리하는 hook.
 *
 * 외부에서 받는 `data`는 immutable로 취급하고, 내부에서는 편집된 사본을 유지한다.
 * `data` identity가 바뀌면 상태를 모두 리셋한다 (새 데이터셋으로 갈아끼우는 시나리오).
 *
 * # API
 * - `rows`: 현재 화면에 보여야 할 행 (편집 반영, 삭제 제외)
 * - `selectedIds`: Set<id>, 체크된 행
 * - `editCell(id, key, value)`: 셀 편집 — accessor key 기반으로 행을 갱신
 * - `toggleRow(id)` / `toggleAll()` / `clearSelection()`
 * - `deleteSelected()`: 선택된 행을 deleted bucket으로 이동
 * - `reset()`: 원본 data로 복원
 * - `getChangedData()` / `getDeletedData()` / `getSavedData()`: snapshot 조회
 */
export function useGridState<TRow>(
  data: TRow[],
  getRowId: (row: TRow, index: number) => RowId,
  onRowChange?: (row: TRow, id: RowId) => void,
) {
  // 1. 원본 스냅샷 — data가 새 identity로 바뀌면 갱신.
  const originals = React.useMemo(() => {
    const map = new Map<RowId, TRow>();
    data.forEach((row, idx) => {
      map.set(getRowId(row, idx), row);
    });
    return map;
  }, [data, getRowId]);

  // 2. 현재 행 (편집 반영, 삭제 제외).
  const [rows, setRows] = React.useState<TRow[]>(() => [...data]);
  // 3. 삭제된 행의 원본.
  const [deleted, setDeleted] = React.useState<TRow[]>([]);
  // 4. 편집된 행 ID 집합.
  const [editedIds, setEditedIds] = React.useState<Set<RowId>>(() => new Set());
  // 5. 선택된 행 ID 집합.
  const [selectedIds, setSelectedIds] = React.useState<Set<RowId>>(() => new Set());

  // 6. data identity 바뀌면 전체 리셋.
  React.useEffect(() => {
    setRows([...data]);
    setDeleted([]);
    setEditedIds(new Set());
    setSelectedIds(new Set());
  }, [data]);

  // 7. 편집된 행의 ID Map (id -> 현재 row) — getChangedData에서 활용.
  const rowById = React.useMemo(() => {
    const m = new Map<RowId, TRow>();
    rows.forEach((row, idx) => {
      m.set(getRowId(row, idx), row);
    });
    return m;
  }, [rows, getRowId]);

  /**
   * 셀 값 변경. accessor가 함수 컬럼은 set 방법을 모르므로 호출자 측 책임.
   * (호출자는 string key만 넘기도록 제한해야 한다.)
   *
   * 주의: onRowChange는 setState updater **밖에서** 호출해야 한다. updater 안에서
   * 부모 setState를 트리거하면 React가 "rendering 중 다른 컴포넌트 업데이트" 경고를
   * 발생시킨다 (특히 Strict Mode에서 updater가 두 번 실행되는 경우).
   */
  const editCell = React.useCallback(
    (id: RowId, columnKey: string, value: unknown) => {
      // 1. 미리 새 row를 계산 — onRowChange에 넘기기 위해 closure 밖에서 보관.
      const idx = rows.findIndex((row, i) => getRowId(row, i) === id);
      if (idx === -1) return;
      const target = rows[idx];
      if (target === undefined) return;
      const updated = { ...(target as Record<string, unknown>), [columnKey]: value } as TRow;

      // 2. state 업데이트 (updater 안에서는 외부 콜백 호출 금지)
      setRows((prev) => prev.map((row, i) => (getRowId(row, i) === id ? updated : row)));
      setEditedIds((prev) => {
        if (prev.has(id)) return prev;
        const next = new Set(prev);
        next.add(id);
        return next;
      });

      // 3. 외부 콜백은 state 업데이트 스케줄 후 호출 (setState는 비동기지만 같은 tick).
      onRowChange?.(updated, id);
    },
    [rows, getRowId, onRowChange],
  );

  const toggleRow = React.useCallback((id: RowId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  /**
   * 헤더 체크박스 토글 — 일부라도 선택돼 있으면 전체 해제, 아니면 전체 선택.
   * 검색/필터 등으로 "보이는 행"이 일부일 때를 위해 대상 행 배열을 받는다.
   */
  const toggleAll = React.useCallback(
    (visibleRows: TRow[]) => {
      setSelectedIds((prev) => {
        const visibleIds = visibleRows.map((row, idx) => getRowId(row, idx));
        const allSelected = visibleIds.every((id) => prev.has(id));
        const next = new Set(prev);
        if (allSelected) {
          visibleIds.forEach((id) => next.delete(id));
        } else {
          visibleIds.forEach((id) => next.add(id));
        }
        return next;
      });
    },
    [getRowId],
  );

  const clearSelection = React.useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const deleteSelected = React.useCallback(() => {
    if (selectedIds.size === 0) return;

    // 현재 rows를 순회해 삭제 대상(원본 스냅샷)과 유지 대상으로 분리.
    const toDelete: TRow[] = [];
    const kept: TRow[] = [];
    rows.forEach((row, idx) => {
      const id = getRowId(row, idx);
      if (selectedIds.has(id)) {
        toDelete.push(originals.get(id) ?? row);
      } else {
        kept.push(row);
      }
    });
    if (toDelete.length === 0) return;

    setRows(kept);
    setDeleted((d) => [...d, ...toDelete]);
    setEditedIds((prev) => {
      if (prev.size === 0) return prev;
      const next = new Set(prev);
      selectedIds.forEach((id) => next.delete(id));
      return next;
    });
    setSelectedIds(new Set());
  }, [selectedIds, rows, getRowId, originals]);

  const reset = React.useCallback(() => {
    setRows([...data]);
    setDeleted([]);
    setEditedIds(new Set());
    setSelectedIds(new Set());
  }, [data]);

  /**
   * 새 행을 지정 위치에 삽입. activeId가 필요한 위치(above/below)는 호출자가
   * 검증해야 한다 (없으면 함수가 no-op으로 처리).
   */
  const addRow = React.useCallback(
    (
      newRow: TRow,
      position: 'first' | 'last' | 'above-active' | 'below-active',
      activeId?: RowId,
    ) => {
      setRows((prev) => {
        if (position === 'first') return [newRow, ...prev];
        if (position === 'last') return [...prev, newRow];
        if (activeId === undefined) return prev;
        const idx = prev.findIndex((row, i) => getRowId(row, i) === activeId);
        if (idx === -1) return prev;
        if (position === 'above-active') return [...prev.slice(0, idx), newRow, ...prev.slice(idx)];
        return [...prev.slice(0, idx + 1), newRow, ...prev.slice(idx + 1)];
      });
    },
    [getRowId],
  );

  /** 특정 행 ID 집합을 일괄 삭제 (cell-selection 기반 삭제용). */
  const removeRowsByIds = React.useCallback(
    (ids: Set<RowId>) => {
      if (ids.size === 0) return;
      const toDelete: TRow[] = [];
      const kept: TRow[] = [];
      rows.forEach((row, idx) => {
        const id = getRowId(row, idx);
        if (ids.has(id)) {
          toDelete.push(originals.get(id) ?? row);
        } else {
          kept.push(row);
        }
      });
      if (toDelete.length === 0) return;
      setRows(kept);
      setDeleted((d) => [...d, ...toDelete]);
      setEditedIds((prev) => {
        if (prev.size === 0) return prev;
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      });
      setSelectedIds((prev) => {
        if (prev.size === 0) return prev;
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      });
    },
    [rows, getRowId, originals],
  );

  const getSavedData = React.useCallback((): TRow[] => rows, [rows]);

  const getChangedData = React.useCallback((): TRow[] => {
    const result: TRow[] = [];
    editedIds.forEach((id) => {
      const row = rowById.get(id);
      if (row !== undefined) result.push(row);
    });
    return result;
  }, [editedIds, rowById]);

  const getDeletedData = React.useCallback((): TRow[] => deleted, [deleted]);

  const getSelectedIds = React.useCallback((): RowId[] => Array.from(selectedIds), [selectedIds]);

  return {
    rows,
    selectedIds,
    editCell,
    toggleRow,
    toggleAll,
    clearSelection,
    deleteSelected,
    reset,
    addRow,
    removeRowsByIds,
    getSavedData,
    getChangedData,
    getDeletedData,
    getSelectedIds,
  };
}
