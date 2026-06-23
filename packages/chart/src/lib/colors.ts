/**
 * 바능 차트 컬러 팔레트.
 *
 * 디자인 토큰의 baneung-navy / teal 계열을 차트 시리즈 컬러로 사용.
 * 다크 모드는 CSS 변수로 자동 cascade.
 *
 * 사용:
 *   <BarChart colors={DEFAULT_COLORS} ... />
 *   <BarChart colors={['#1F2937', '#5BA8A0']} ... />  // 직접 지정
 */

/** 시리즈 N개에 자동 사이클로 적용되는 기본 팔레트 (10개). */
export const DEFAULT_COLORS = [
  '#1F2937', // navy-900 (메인)
  '#5BA8A0', // teal-500 (액센트)
  '#3B4B63', // navy-700
  '#6B7280', // navy-500
  '#8B5CF6', // violet
  '#F59E0B', // amber
  '#EF4444', // red
  '#10B981', // emerald
  '#3B82F6', // blue
  '#EC4899', // pink
] as const;

/**
 * 시리즈 인덱스 → 컬러 매핑. 팔레트 길이를 초과하면 자동으로 처음으로 wrap.
 *
 * @param index - 0-based 시리즈 인덱스
 * @param palette - 사용할 팔레트 (기본 DEFAULT_COLORS)
 */
export function getSeriesColor(index: number, palette: readonly string[] = DEFAULT_COLORS): string {
  return palette[index % palette.length] ?? DEFAULT_COLORS[0]!;
}
