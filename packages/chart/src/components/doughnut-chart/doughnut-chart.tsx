import { PieChart, type PieChartProps } from '../pie-chart/pie-chart';

export type DoughnutChartProps = Omit<PieChartProps, 'innerRadius' | 'outerRadius'> & {
  /**
   * 도넛 안쪽 빈 비율 (0~1). 0.6이면 가운데 60%가 비어있음. 기본 0.6.
   * 내부적으로 PieChart의 innerRadius(같은 의미)로 전달됨.
   */
  thickness?: number;
};

/**
 * 도넛 차트 — PieChart에 innerRadius를 자동 적용한 편의 wrapper.
 * Canvas(chart.js) 기반.
 *
 * @example
 *   <DoughnutChart
 *     data={[{ name: 'A', value: 30 }, { name: 'B', value: 70 }]}
 *     nameKey="name"
 *     valueKey="value"
 *   />
 */
export function DoughnutChart({ thickness = 0.6, ...rest }: DoughnutChartProps) {
  return <PieChart {...rest} innerRadius={thickness} />;
}
