/**
 * 차트 공통 타입 정의.
 *
 * 모든 차트는 같은 형태의 data 배열 (Record<string, unknown>[])을 받고,
 * `xKey`/`yKeys` 등 키 prop으로 어느 필드를 어떻게 그릴지 지정.
 */

import type { NumberFormat } from './format';
import type { ReactNode } from 'react';

/** 차트가 받는 데이터 행. 각 키는 컬럼명, 값은 숫자/문자열/Date 등. */
export type ChartDatum = Record<string, unknown>;

/** 모든 차트 컴포넌트가 공유하는 기본 props. */
export interface ChartBaseProps {
  /** 차트 데이터 배열. */
  data: ChartDatum[];
  /** 차트 높이 (px). 기본 300. width는 부모 100%로 자동 채움. */
  height?: number;
  /** 시리즈 컬러 팔레트. 미지정 시 DEFAULT_COLORS (navy/teal 기반). */
  colors?: readonly string[];
  /** 그리드 표시 여부. 기본 true. */
  showGrid?: boolean;
  /** 범례 표시 여부. 기본 true. */
  showLegend?: boolean;
  /** 툴팁 표시 여부. 기본 true. */
  showTooltip?: boolean;
  /** 추가 className (외부 wrapper용). */
  className?: string;
  /** 빈 데이터일 때 표시할 노드. */
  emptyState?: ReactNode;
  /**
   * 숫자 값 포맷 — tooltip / 라벨 / y축 tick에 일관 적용.
   * - `'plain'` (기본): 변환 없음
   * - `'comma'`: 1,250,000 — 천 단위 콤마
   * - `'korean'`: 125만, 1.2억 — 한글 단위
   * - `(value) => string`: 사용자 정의 (단위 suffix 등)
   */
  valueFormat?: NumberFormat;
  /**
   * 접근성용 sr-only `<table>` 자동 렌더 여부. 기본 true.
   * 스크린리더 사용자가 canvas 차트의 데이터를 텍스트 테이블로 읽을 수 있게 함.
   * 시각적으로는 sr-only로 숨겨지지만 DOM에는 존재.
   */
  a11yTable?: boolean;
  /** 접근성 테이블의 caption (스크린리더가 읽음). 미지정 시 비표시. */
  a11yCaption?: string;
}
