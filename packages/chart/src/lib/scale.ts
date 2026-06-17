import { scaleLinear, type ScaleLinear } from 'd3-scale';

import type { BarChartDatum, ScaleHeightOptions } from './types';

/**
 * 데이터 배열에서 최댓값을 maxHeight로 매핑하는 d3-scale linear scale 생성.
 *
 * 직접 `value / max * maxHeight`로 계산하지 않고 d3-scale을 쓰는 이유:
 * 1. d3-scale은 `nice()`/`clamp()` 같은 보정을 함께 제공해 차트 품질 향상
 * 2. 추후 log/pow scale로 전환할 때 같은 호출부를 유지
 * 3. 도메인/레인지 inversion(scale.invert) 같은 추가 기능을 무료로 얻음
 *
 * @param data - 막대 데이터 배열. 빈 배열도 안전(scale(0)=0 반환).
 * @param options.maxHeight - 가장 큰 값에 대응할 막대 높이. 기본 5.
 * @returns d3 ScaleLinear<number, number>. `scale(value)`로 호출.
 *
 * @example
 *   const scale = scaleHeight([{label:'a', value:100}, {label:'b', value:50}]);
 *   scale(100); // → 5  (maxHeight)
 *   scale(50);  // → 2.5
 *   scale(0);   // → 0
 */
export function scaleHeight(
  data: BarChartDatum[],
  options: ScaleHeightOptions = {},
): ScaleLinear<number, number> {
  // 1. 옵션 기본값
  const maxHeight = options.maxHeight ?? 5;

  // 2. 데이터 최댓값. 음수는 절댓값으로(높이는 양수만).
  //    빈 배열이거나 모든 값이 0이면 max=1로 fallback (divide-by-zero 방지)
  const max = data.reduce((acc, d) => Math.max(acc, Math.abs(d.value)), 0) || 1;

  // 3. linear scale: [0, max] → [0, maxHeight]
  return scaleLinear().domain([0, max]).range([0, maxHeight]);
}

/**
 * N개의 막대를 X축으로 균등 배치할 때 각 막대의 X 좌표를 계산.
 *
 * 전체 그룹을 원점(x=0) 기준으로 중앙 정렬하므로 막대 개수가 바뀌어도
 * 카메라 시점이 유지된다.
 *
 * @param count - 막대 개수
 * @param barWidth - 막대 가로 크기 (Three.js 단위)
 * @param gap - 막대 간 간격
 * @returns 길이 `count`인 X 좌표 배열
 *
 * @example
 *   computeBarXPositions(3, 1, 0.5);
 *   // → [-1.5, 0, 1.5]  (3개 막대, 너비 1, 간격 0.5)
 */
export function computeBarXPositions(count: number, barWidth: number, gap: number): number[] {
  if (count <= 0) return [];
  // 막대 사이 거리(중심-중심) = barWidth + gap
  const step = barWidth + gap;
  // 그룹 전체 너비 = step * count - gap (마지막 막대 뒤 간격은 빼야 함)
  const totalWidth = step * count - gap;
  // 가장 왼쪽 막대 중심 = -전체 너비/2 + 첫 막대 절반
  const startX = -totalWidth / 2 + barWidth / 2;
  return Array.from({ length: count }, (_, i) => startX + step * i);
}
