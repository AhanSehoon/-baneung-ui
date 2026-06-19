import type { GridColumn } from './types';
import type ExcelJSModule from 'exceljs';

/**
 * 컬럼에서 row 값 추출 (csv.ts와 동일 로직 — 의존성 분리 위해 복제).
 */
function getValue<TRow>(column: GridColumn<TRow>, row: TRow): unknown {
  return typeof column.accessor === 'function'
    ? column.accessor(row)
    : (row as Record<string, unknown>)[column.accessor as string];
}

/** Excel 열 너비 단위 변환 — column.width (px) → Excel character width (대략 px/7). */
function pxToExcelWidth(px: number | string | undefined): number | undefined {
  if (px === undefined) return undefined;
  if (typeof px === 'number') return Math.max(8, Math.round(px / 7));
  // string인 경우 (e.g., '150px', '20%') 단순화 — px 만 파싱, 그 외 무시
  const m = /^(\d+(?:\.\d+)?)px$/.exec(px);
  if (m) return Math.max(8, Math.round(parseFloat(m[1]!) / 7));
  return undefined;
}

export interface ExportXlsxOptions<TRow = Record<string, unknown>> {
  /** 파일명. 기본 'grid.xlsx'. */
  filename?: string;
  /** 시트 이름. 기본 'Sheet1'. */
  sheetName?: string;
  /** 내보낼 행. 미지정 시 getSavedData() 사용. */
  rows?: TRow[];
  /**
   * 헤더 행 스타일 적용. 기본 true — 굵게 + 옅은 배경.
   * 단순 데이터만 받고 싶으면 false.
   */
  styledHeader?: boolean;
}

/**
 * 컬럼 + 데이터를 Excel 파일(.xlsx)로 변환해 브라우저 다운로드.
 *
 * # exceljs lazy import
 * exceljs는 ~600KB로 작지 않으므로 정적 import하지 않고 동적 로드.
 * → 그리드의 일반 번들에 포함되지 않음. exportXlsx() 호출 시점에만 받아옴.
 *
 * # 컬럼 매핑
 * - 헤더 행: column.header (string이면 그 값) 또는 column.id
 * - 데이터: accessor가 반환한 raw 값. 값 타입 보존 (number/Date/boolean)
 * - 컬럼 폭: column.width(px)를 Excel character width로 환산
 *
 * # 스타일 (styledHeader=true)
 * - 헤더 행 굵게 + 옅은 회색 배경 + 가운데 정렬
 * - 헤더 행 freeze (스크롤해도 헤더는 고정)
 *
 * # 설치 안 됐을 때
 * exceljs가 peer-optional이라 미설치 가능 → 동적 import 실패 시 명확한 에러로 안내.
 */
export async function exportXlsx<TRow>(
  columns: GridColumn<TRow>[],
  rows: TRow[],
  options: { filename?: string; sheetName?: string; styledHeader?: boolean } = {},
): Promise<void> {
  if (typeof document === 'undefined' || typeof URL === 'undefined') return;

  const { filename = 'grid.xlsx', sheetName = 'Sheet1', styledHeader = true } = options;

  // Lazy load — 호출 시점에만 모듈 받아옴 (~600KB)
  let ExcelJS: typeof ExcelJSModule;
  try {
    ExcelJS = await import('exceljs');
  } catch {
    throw new Error(
      "exceljs 패키지가 설치되어 있지 않습니다. 'pnpm add exceljs' (또는 npm install exceljs)로 설치해주세요.",
    );
  }

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(sheetName);

  // 1. 컬럼 정의 — header / width / key
  sheet.columns = columns.map((c) => ({
    header: typeof c.header === 'string' ? c.header : c.id,
    key: c.id,
    width: pxToExcelWidth(c.width) ?? 14,
  }));

  // 2. 헤더 스타일
  if (styledHeader) {
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE5E7EB' }, // 옅은 회색 (디자인 토큰의 ground 색과 동일)
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    // 헤더 행 freeze
    sheet.views = [{ state: 'frozen', ySplit: 1 }];
  }

  // 3. 데이터 행 추가 — accessor로 raw 값 추출
  rows.forEach((row) => {
    const rowData: Record<string, unknown> = {};
    columns.forEach((c) => {
      rowData[c.id] = getValue(c, row);
    });
    sheet.addRow(rowData);
  });

  // 4. 데이터 행 정렬 (column.align)
  columns.forEach((c, i) => {
    if (!c.align) return;
    const excelCol = sheet.getColumn(i + 1);
    excelCol.alignment = { horizontal: c.align };
  });

  // 5. Blob → 다운로드
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
