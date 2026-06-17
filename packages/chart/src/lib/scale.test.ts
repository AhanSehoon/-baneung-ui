import { describe, expect, it } from 'vitest';

import { computeBarXPositions, scaleHeight } from './scale';

import type { BarChartDatum } from './types';

describe('scaleHeight', () => {
  it('maps the maximum value to maxHeight', () => {
    const data: BarChartDatum[] = [
      { label: 'a', value: 100 },
      { label: 'b', value: 50 },
    ];
    const scale = scaleHeight(data, { maxHeight: 5 });
    expect(scale(100)).toBe(5);
    expect(scale(50)).toBe(2.5);
    expect(scale(0)).toBe(0);
  });

  it('uses default maxHeight=5 when option omitted', () => {
    const data: BarChartDatum[] = [{ label: 'a', value: 10 }];
    expect(scaleHeight(data)(10)).toBe(5);
  });

  it('handles empty data without divide-by-zero', () => {
    const scale = scaleHeight([], { maxHeight: 5 });
    // 빈 데이터는 max=1로 처리 → scale(1) = maxHeight
    expect(scale(1)).toBe(5);
    expect(scale(0)).toBe(0);
  });

  it('handles all-zero data without divide-by-zero', () => {
    const data: BarChartDatum[] = [{ label: 'a', value: 0 }];
    const scale = scaleHeight(data, { maxHeight: 5 });
    expect(scale(0)).toBe(0);
    // max=0 → fallback to 1
    expect(scale(1)).toBe(5);
  });

  it('treats negative values by absolute magnitude', () => {
    const data: BarChartDatum[] = [
      { label: 'a', value: -100 },
      { label: 'b', value: 50 },
    ];
    // max(|−100|, |50|) = 100 → scale 도메인 [0, 100]
    expect(scaleHeight(data, { maxHeight: 5 })(100)).toBe(5);
  });
});

describe('computeBarXPositions', () => {
  it('returns empty array for zero count', () => {
    expect(computeBarXPositions(0, 1, 0.5)).toEqual([]);
  });

  it('centers a single bar at origin', () => {
    expect(computeBarXPositions(1, 1, 0.5)).toEqual([0]);
  });

  it('centers two bars symmetrically around origin', () => {
    // step = 1 + 0.5 = 1.5, totalWidth = 1.5*2 - 0.5 = 2.5, startX = -1.25 + 0.5 = -0.75
    const result = computeBarXPositions(2, 1, 0.5);
    expect(result).toHaveLength(2);
    expect(result[0]).toBeCloseTo(-0.75);
    expect(result[1]).toBeCloseTo(0.75);
  });

  it('places three bars with middle at origin', () => {
    const result = computeBarXPositions(3, 1, 0.5);
    expect(result).toHaveLength(3);
    expect(result[1]).toBeCloseTo(0); // 중앙 막대는 정확히 원점
    expect(result[0]).toBeCloseTo(-1.5);
    expect(result[2]).toBeCloseTo(1.5);
  });
});
