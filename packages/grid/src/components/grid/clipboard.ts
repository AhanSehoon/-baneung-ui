/**
 * 그리드의 다중 셀 선택을 Excel과 호환되는 TSV(탭 구분) 포맷으로 변환.
 *
 * Excel/Sheets에서 셀 범위를 복사하면 clipboard에 TSV로 들어가고,
 * 다른 곳(Excel/Sheets/우리 그리드)에 붙여넣으면 동일 TSV로 받게 됨.
 * 행 구분자는 `\n`, 셀 구분자는 `\t`. 셀 안에 탭/줄바꿈/따옴표가 있으면 `""`로 감싸고
 * 내부 `"`는 두 번으로 escape (Excel 호환).
 */

/** TSV 셀 값 escape — `\t`, `\n`, `\r`, `"`가 포함되면 `""`로 감싸고 내부 `"`는 두 번. */
function escapeTsvCell(value: unknown): string {
  if (value == null) return '';
  const str = value instanceof Date ? value.toISOString() : String(value);
  if (/[\t\n\r"]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

/**
 * 2D 셀 배열을 TSV 문자열로 변환.
 *
 * @param matrix - `matrix[row][col]` 형태. row/col 인덱스는 화면 표시 순서와 동일.
 * @returns Excel 호환 TSV (`\t` 구분, `\n` 줄바꿈)
 */
export function buildTsv(matrix: unknown[][]): string {
  return matrix.map((row) => row.map(escapeTsvCell).join('\t')).join('\n');
}

/**
 * TSV 문자열을 2D 셀 배열로 파싱.
 *
 * Excel·Sheets에서 복사한 TSV를 받아 셀 단위로 분해.
 * 따옴표로 감싸진 셀(내부에 탭·줄바꿈 포함) 처리.
 *
 * @param tsv - clipboard에서 읽은 텍스트
 * @returns `result[row][col]` 형태의 2D 문자열 배열
 */
export function parseTsv(tsv: string): string[][] {
  if (!tsv) return [];
  // Excel은 마지막 줄에 \r\n을 자주 붙임 → 끝의 줄바꿈 trim
  let i = 0;
  const matrix: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;

  while (i < tsv.length) {
    const ch = tsv[i]!;
    if (inQuotes) {
      if (ch === '"') {
        if (tsv[i + 1] === '"') {
          // escape된 따옴표
          cell += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      cell += ch;
      i += 1;
      continue;
    }
    // not in quotes
    if (ch === '"' && cell === '') {
      inQuotes = true;
      i += 1;
      continue;
    }
    if (ch === '\t') {
      row.push(cell);
      cell = '';
      i += 1;
      continue;
    }
    if (ch === '\n' || ch === '\r') {
      // 마지막 셀 push
      row.push(cell);
      matrix.push(row);
      row = [];
      cell = '';
      // \r\n 처리
      if (ch === '\r' && tsv[i + 1] === '\n') i += 2;
      else i += 1;
      continue;
    }
    cell += ch;
    i += 1;
  }
  // 끝에 남은 셀/행 처리
  if (cell !== '' || row.length > 0) {
    row.push(cell);
    matrix.push(row);
  }
  // 마지막이 빈 줄이면 제거 (Excel TSV 흔한 패턴)
  if (
    matrix.length > 0 &&
    matrix[matrix.length - 1]!.length === 1 &&
    matrix[matrix.length - 1]![0] === ''
  ) {
    matrix.pop();
  }
  return matrix;
}

/**
 * 브라우저 clipboard에 텍스트 쓰기.
 * navigator.clipboard.writeText가 표준이지만 권한 거부될 수 있어 fallback 포함.
 */
export async function writeClipboard(text: string): Promise<void> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // permission 거부 — fallback
    }
  }
  // Legacy fallback: textarea + execCommand
  if (typeof document === 'undefined') return;
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
  } finally {
    document.body.removeChild(ta);
  }
}

/**
 * 브라우저 clipboard에서 텍스트 읽기.
 * navigator.clipboard.readText는 권한 필요. 권한 없으면 빈 문자열.
 */
export async function readClipboard(): Promise<string> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.readText) {
    try {
      return await navigator.clipboard.readText();
    } catch {
      return '';
    }
  }
  return '';
}
