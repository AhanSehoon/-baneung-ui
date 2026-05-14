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
   * - function: `(value, row) => ReactNode` 임의 렌더
   *
   * v0.1.0은 text + 커스텀 함수만 지원. dropdown/icon/date/number-comma 등의
   * built-in renderer는 후속 버전에서 추가.
   */
  renderer?: 'text' | ((value: unknown, row: TRow) => React.ReactNode);
}

/**
 * Grid 컴포넌트 props.
 */
export interface GridProps<TRow = Record<string, unknown>> extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
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
  /** 가상화 컨테이너 높이(px 또는 CSS string). 기본 400. */
  height?: number | string;
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
  /** 각 행의 고유 키 추출 함수. 미지정 시 인덱스 사용 (재정렬 비권장). */
  getRowId?: (row: TRow, index: number) => string | number;
}
