import type * as React from 'react';

/**
 * Grid 컬럼 정의.
 *
 * `accessor`는 행 객체에서 값을 추출. key 문자열이면 `row[key]`, 함수면 호출 결과.
 * `renderer`는 셀 표시 방식. 미지정 시 'text' (값을 그대로 문자열로 표시).
 */
export interface GridColumn<TRow = Record<string, unknown>> {
  /** 컬럼 고유 식별자 (key prop·정렬·테스트에 사용). */
  id: string;
  /** 헤더에 표시될 노드. */
  header: React.ReactNode;
  /** 행에서 값을 꺼내는 방법. */
  accessor: keyof TRow | ((row: TRow) => unknown);
  /** 셀 너비. 숫자면 px, 문자열이면 CSS 그대로 전달. */
  width?: number | string;
  /** 컬럼 정렬 (left | center | right). 숫자 컬럼은 보통 right 권장. */
  align?: 'left' | 'center' | 'right';
  /**
   * 셀 렌더링 방식.
   * - 'text' (기본): 값을 String()으로 변환 후 표시
   * - 'progress': 진행률 바 + 숫자. `min`/`max`로 범위 설정 (기본 0 ~ 100).
   * - 'date': 날짜 포맷팅. `dateFormat`으로 형식 지정 (기본 'YYYY-MM-DD').
   * - function: `(value, row) => ReactNode` 임의 렌더
   */
  renderer?: 'text' | 'progress' | 'date' | ((value: unknown, row: TRow) => React.ReactNode);
  /**
   * 편집 가능 여부 (기본 false). true면 셀 더블클릭 시 editor로 전환되어
   * Enter/blur로 commit, Escape로 cancel. `accessor`는 key 문자열인 경우만
   * 편집 결과를 행에 반영 가능하다 (함수 accessor는 set 방법을 알 수 없음).
   */
  editable?: boolean;
  /**
   * 편집 모드에서 사용할 에디터. `editable: true`일 때만 의미 있다.
   * - 'text' (기본): 일반 텍스트 input
   * - 'number': 숫자 input (type=number)
   * - 'date': 날짜 input (type=date, 브라우저 네이티브 달력 popup)
   * - 'dropdown': `options` 배열로부터 select. `options` 필수.
   */
  editor?: 'text' | 'number' | 'date' | 'dropdown';
  /**
   * `editor: 'dropdown'` 또는 `renderer: 'dropdown-label'`을 쓸 때 선택지.
   */
  options?: { value: string | number; label: string }[];
  /** `renderer: 'progress'`의 최소값 (기본 0). */
  min?: number;
  /** `renderer: 'progress'`의 최대값 (기본 100). */
  max?: number;
  /**
   * `renderer: 'date'`의 출력 포맷. 토큰: YYYY, MM, DD, HH, mm, ss.
   * 기본 'YYYY-MM-DD'.
   */
  dateFormat?: string;
  /**
   * 헤더 클릭으로 정렬 활성. 3-state 토글 (없음 → asc → desc → 없음).
   * 정렬은 accessor 값으로 수행. 트리 모드(`tree=true`)에서는 부모-자식 구조가
   * 깨지므로 무시된다.
   */
  sortable?: boolean;
  /**
   * 헤더 아래 두 번째 행에 필터 input 표시. 입력 문자열을 컬럼 값(String 변환)
   * 의 부분 일치(case-insensitive)로 필터링.
   */
  filterable?: boolean;
}

/** Sort 상태 — 한 번에 한 컬럼만 (multi-column sort는 후속 버전). */
export interface GridSortState {
  columnId: string;
  direction: 'asc' | 'desc';
}

/**
 * Grid 컴포넌트 props.
 */
export interface GridProps<TRow = Record<string, unknown>> extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children' | 'onChange'
> {
  /** 컬럼 정의 배열. */
  columns: GridColumn<TRow>[];
  /** 표시할 데이터 배열. */
  data: TRow[];
  /**
   * 가상화 활성. 큰 데이터셋(1000행+)에서 활성 권장. 활성 시 보이는 행만
   * 렌더해 DOM 노드 수가 일정하게 유지된다.
   */
  virtualized?: boolean;
  /** 행 높이(px). 가상화 모드에서 정확한 스크롤 계산을 위해 사용. 기본 36. */
  rowHeight?: number;
  /** 가상화 컨테이너 높이(px 또는 CSS string). 기본 400. `autoSize=true`면 무시. */
  height?: number | string;
  /**
   * 부모 컨테이너에 꽉 맞춰 자동 리사이즈. 기본 false.
   *
   * 활성 시:
   * - outer가 `h-full w-full` → 부모 div 크기 100% 채움
   * - 스크롤 영역이 `flex: 1` → 남는 세로 공간 모두 차지 (페이지네이션 푸터는 자동으로 바닥)
   * - 부모 크기가 변하면 자동 반영 (ResizeObserver는 가상화 라이브러리가 내장 처리)
   * - `height` prop은 무시됨
   *
   * 사용 예:
   * ```jsx
   * <div style={{ height: 'calc(100vh - 80px)' }}>
   *   <Grid autoSize columns={...} data={...} />
   * </div>
   * ```
   */
  autoSize?: boolean;
  /** 페이지당 행 수. `pageSize > 0` 이면 페이지네이션 활성. 기본 0 (비활성). */
  pageSize?: number;
  /** 내장 페이지네이션 UI 표시 여부. 외부 페이징 사용 시 false. 기본 true. */
  showPagination?: boolean;
  /** 현재 페이지 (1-based, controlled). 미지정 시 uncontrolled. */
  page?: number;
  /** 페이지 변경 콜백. controlled 모드에서 필수. */
  onPageChange?: (page: number) => void;
  /** 데이터 비어있을 때 표시할 노드. */
  emptyState?: React.ReactNode;
  /**
   * 각 행의 고유 키 추출 함수. 미지정 시 인덱스 사용 (재정렬 시 추적이 깨질 수 있음).
   * `selectable` 또는 편집 가능 컬럼을 쓰는 경우 안정적인 ID를 반환하는 함수를
   * 반드시 전달하는 것이 권장된다.
   */
  getRowId?: (row: TRow, index: number) => string | number;
  /** 행 선택(체크박스) 활성. true면 첫 컬럼으로 체크박스 컬럼 자동 추가. */
  selectable?: boolean;
  /**
   * 셀이 편집되어 행 값이 변경됐을 때 호출되는 콜백. 변경된 행 객체와 그 행의 id.
   * 내부 상태도 자동 업데이트되므로 외부에 별도로 동기화할 필요는 없지만
   * 디버깅/로깅 또는 자동 저장 트리거 용도로 유용.
   */
  onRowChange?: (row: TRow, id: string | number) => void;
  /**
   * 셀 선택 모드.
   * - `'none'`: 비활성 (셀 클릭/드래그로 selection 안 됨)
   * - `'single'` (기본): 클릭으로 한 셀 active. outline 강조.
   * - `'multi'`: 클릭으로 단일 + 마우스 누른 채 드래그로 사각형 영역 다중 선택.
   *
   * `selectable`(체크박스 행 선택)과는 별개의 축이다. 둘 다 활성 가능.
   */
  cellSelection?: 'none' | 'single' | 'multi';
  /**
   * Delete 키를 누르면 선택된 셀의 값을 빈 문자열로 설정. accessor가 string key인
   * 컬럼에만 적용. `cellSelection`이 `'none'`이 아닐 때만 의미 있다.
   * 그리드 컨테이너에 포커스가 있는 동안만 작동 (`tabIndex={0}`).
   */
  clearOnDelete?: boolean;
  /**
   * Tree(계층) 모드. 첫 컬럼에 caret + 들여쓰기를 자동 삽입해 펼침/접힘 가능한
   * 트리뷰로 렌더한다. `getChildren`이 함께 필요.
   *
   * # 제약
   * - 인라인 편집은 최상위 행만 정상 반영됨 (중첩 행은 편집 시 UI 갱신은 되지만
   *   getSavedData / getChangedData에 반영되지 않음 — 후속 버전 개선).
   * - 삭제(deleteSelected)도 최상위 행만 안전. 중첩 행 삭제는 동작 보장 X.
   */
  tree?: boolean;
  /**
   * 행에서 자식 배열을 추출하는 함수. tree=true일 때만 사용된다.
   * undefined / 빈 배열을 반환하면 leaf 노드로 간주.
   */
  getChildren?: (row: TRow) => TRow[] | undefined;
  /**
   * 기본 펼침 상태.
   * - `'none'` (기본): 모두 접힘
   * - `'all'`: 자식이 있는 모든 노드 펼침
   * - `(string | number)[]`: 지정한 id의 노드만 펼침
   */
  defaultExpandedIds?: (string | number)[] | 'all' | 'none';
}

/**
 * Grid의 imperative API.
 *
 * `useRef<GridHandle<TRow>>()`를 만들어 `<Grid ref={ref} ... />`로 전달하면
 * `ref.current?.deleteSelected()` 같은 메서드로 외부에서 그리드 상태를
 * 조회/조작할 수 있다.
 */
export interface GridHandle<TRow = Record<string, unknown>> {
  /**
   * 현재 그리드의 데이터 상태 — 편집된 값이 반영되고 삭제된 행은 제외된
   * 전체 행 배열. 서버에 "저장" 보낼 때 주로 사용.
   */
  getSavedData(): TRow[];
  /**
   * 편집된 행만 (현재 값 포함). 부분 업데이트(PATCH) API에 적합.
   * 행 ID 추출이 안정적이지 않으면 정확도가 떨어질 수 있다.
   */
  getChangedData(): TRow[];
  /**
   * 삭제된 행의 원본 스냅샷 배열. 서버에 "삭제" 알릴 때 사용.
   * (편집 후 삭제된 경우에도 편집 전의 원본 값이 반환됨.)
   */
  getDeletedData(): TRow[];
  /** 현재 선택된 행 ID 배열. */
  getSelectedIds(): (string | number)[];
  /** 선택된 행을 모두 삭제 처리 (UI에서 사라지고 getDeletedData에 누적). */
  deleteSelected(): void;
  /** 모든 행의 선택 상태 해제. */
  clearSelection(): void;
  /** 모든 편집/삭제 내역 폐기하고 원본 data prop으로 복원. */
  reset(): void;
  /**
   * 새 행을 지정 위치에 추가.
   * - `'first'`: 최상위 (배열의 맨 앞)
   * - `'last'`: 최하위 (배열의 맨 끝)
   * - `'above-active'`: 현재 active 셀의 행 위
   * - `'below-active'`: 현재 active 셀의 행 아래
   *
   * active 셀이 없는 상태에서 `'above-active'` / `'below-active'`를 호출하면
   * 무시된다 (no-op).
   */
  addRow(row: TRow, position: 'first' | 'last' | 'above-active' | 'below-active'): void;
  /**
   * 현재 셀 선택(active 셀 또는 multi-select된 셀들)에 포함된 행을 모두 삭제로 이동.
   * `cellSelection`이 `'none'`이면 no-op.
   */
  removeSelectedRows(): void;
  /**
   * 현재 선택된 셀들(active 또는 multi)의 값을 빈 문자열로 클리어.
   * accessor가 string key인 컬럼만 적용. 함수 accessor 컬럼은 무시.
   */
  clearSelectedCells(): void;
  /**
   * 현재 그리드 데이터를 CSV로 다운로드.
   *
   * - 헤더 행은 `column.header` (문자열인 경우) 또는 `column.id`.
   * - 데이터 행은 accessor가 반환한 raw 값 (renderer 시각 출력 X).
   * - UTF-8 BOM 포함 → Excel에서 한글 깨짐 없이 열림.
   * - 기본 파일명은 `'grid.csv'`.
   *
   * 옵션:
   * - `rows`: 명시한 행만 export. 미지정 시 `getSavedData()` 사용 (편집 반영, 삭제 제외).
   */
  exportCsv(filename?: string, options?: { rows?: TRow[] }): void;
}
