/**
 * 차트 값 포맷 유틸 — 한글 단위(만/억) + 천 단위 콤마 + 사용자 정의 함수 지원.
 *
 * # 왜 필요한가
 * chart.js 기본 출력은 항상 `String(value)` → 한국 사용자에겐 "1250000"보다
 * "125만" 또는 "1,250,000"이 즉시 가독. 모든 차트의 tooltip / datalabel /
 * y축 tick에 일관 적용 가능한 단일 포맷 prop을 제공.
 *
 * # 사용
 *   <BarChart valueFormat="korean" ... />        // 125만, 12.5억
 *   <BarChart valueFormat="comma" ... />         // 1,250,000
 *   <BarChart valueFormat={(n) => `${n}원`} />   // 1250000원
 */

/**
 * 값 포맷 옵션.
 * - `'plain'` (기본): 변환 없음 — chart.js 기본 동작
 * - `'comma'`: 천 단위 콤마 — 1,250,000
 * - `'korean'`: 한글 단위 — 12.3만, 1.2억, 1조
 * - `(value: number) => string`: 사용자 정의 함수 (단위 suffix 등)
 */
export type NumberFormat = 'plain' | 'comma' | 'korean' | ((value: number) => string);

/**
 * 숫자를 한글 단위(만/억/조)로 포맷.
 *
 * - 1만 미만: 천 단위 콤마
 * - 1만 ~ 1억: `N.N만`
 * - 1억 ~ 1조: `N.N억`
 * - 1조 이상: `N.N조`
 *
 * 소수 첫째 자리까지 표시하되 `.0`은 제거. 음수 부호 유지.
 *
 * @example
 *   formatKorean(1250000)    // "125만"
 *   formatKorean(98765432)   // "9874.5만" → "9874.5만" (1억 미만)
 *   formatKorean(123456789)  // "1.2억"
 *   formatKorean(-5000)      // "-5,000"
 */
export function formatKorean(value: number): string {
  if (!Number.isFinite(value)) return String(value);
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  const trim = (s: string) => s.replace(/\.0$/, '');
  if (abs >= 1e12) return `${sign}${trim((abs / 1e12).toFixed(1))}조`;
  if (abs >= 1e8) return `${sign}${trim((abs / 1e8).toFixed(1))}억`;
  if (abs >= 1e4) return `${sign}${trim((abs / 1e4).toFixed(1))}만`;
  return value.toLocaleString('ko-KR');
}

/**
 * NumberFormat에 따라 값을 문자열로 변환.
 * 차트 내부(tooltip/datalabel/tick callback)에서 호출.
 */
export function formatValue(value: unknown, fmt: NumberFormat = 'plain'): string {
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n)) return String(value ?? '');
  if (typeof fmt === 'function') return fmt(n);
  if (fmt === 'comma') return n.toLocaleString('ko-KR');
  if (fmt === 'korean') return formatKorean(n);
  return String(n);
}
