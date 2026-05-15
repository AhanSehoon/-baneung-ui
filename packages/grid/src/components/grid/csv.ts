import type { GridColumn } from './types';

/**
 * CSV 셀 값을 escape — `,`, `"`, `\n`, `\r`가 포함되면 `""`로 감싸고 내부 `"`는 두 번.
 */
function escapeCsvCell(value: unknown): string {
  if (value == null) return '';
  const str = value instanceof Date ? value.toISOString() : String(value);
  if (/[,"\n\r]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

/** 컬럼에서 row 값 추출. */
function getValue<TRow>(column: GridColumn<TRow>, row: TRow): unknown {
  return typeof column.accessor === 'function'
    ? column.accessor(row)
    : (row as Record<string, unknown>)[column.accessor as string];
}

/**
 * 컬럼 정의 + 데이터로부터 CSV 텍스트 생성.
 *
 * - 헤더 행: `column.header`가 문자열이면 그 값, 아니면 `column.id`.
 * - 데이터 행: accessor로 원본 값 추출 후 escape. renderer는 시각용이라 적용 X
 *   (포맷팅된 표시 텍스트가 아닌 raw 값을 CSV에 담는 것이 일반 사용자 기대).
 * - 줄 구분자: CRLF (Excel/Windows 호환).
 */
export function buildCsv<TRow>(columns: GridColumn<TRow>[], rows: TRow[]): string {
  const headerLine = columns
    .map((c) => escapeCsvCell(typeof c.header === 'string' ? c.header : c.id))
    .join(',');
  const dataLines = rows.map((row) =>
    columns.map((c) => escapeCsvCell(getValue(c, row))).join(','),
  );
  return [headerLine, ...dataLines].join('\r\n');
}

/**
 * 브라우저에서 CSV 텍스트를 파일로 다운로드.
 * Excel UTF-8 호환을 위해 BOM(\\ufeff)을 prefix로 붙인다.
 */
export function downloadCsv(content: string, filename: string): void {
  // SSR 안전 가드
  if (typeof document === 'undefined' || typeof URL === 'undefined') return;
  const blob = new Blob(['﻿' + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
