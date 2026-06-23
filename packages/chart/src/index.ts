/**
 * @baneung-pack/chart — Canvas(chart.js) 기반 차트 라이브러리 + 바능 디자인 시스템 통합.
 *
 * 10개 컴포넌트:
 *   - BarChart: 막대 (세로/가로/누적, 양수/음수 자동)
 *   - LineChart: 선 (직선/곡선)
 *   - AreaChart: 영역 (누적 옵션)
 *   - PieChart: 파이
 *   - DoughnutChart: 도넛 (PieChart wrapper)
 *   - MixedChart: 막대 + 선 혼합 (Pareto 등, 우측 보조 y축 옵션)
 *   - WaterfallChart: 누적 변화 시각화 (매출 → 비용 → 이익)
 *   - ScatterChart: 산점도 (두 변수 상관관계, groupKey로 시리즈 분리)
 *   - RadarChart: 레이더 (여러 축의 다차원 비교)
 *   - FlowChart: 노드-엣지 그래프 (커스텀 edge 지원, SVG 기반, chart.js 무관)
 *
 * 공통 props (ChartBaseProps):
 *   data / height / colors / showGrid / showLegend / showTooltip / emptyState / className /
 *   valueFormat (숫자 포맷, 한글 1.2만/1.5억 등) / a11yTable (sr-only data table)
 *
 * Peer dependencies: chart.js ^4.4.0, react-chartjs-2 ^5.2.0, chartjs-plugin-datalabels ^2.2.0
 */

export { AreaChart, type AreaChartProps } from './components/area-chart/area-chart';
export { BarChart, type BarChartProps } from './components/bar-chart/bar-chart';
export { DoughnutChart, type DoughnutChartProps } from './components/doughnut-chart/doughnut-chart';
export {
  FlowChart,
  type FlowChartProps,
  type FlowEdge,
  type FlowEdgeBuiltinType,
  type FlowEdgePathArgs,
  type FlowEdgePathFn,
  type FlowHandlePosition,
  type FlowNode,
} from './components/flow-chart/flow-chart';
export { LineChart, type LineChartProps } from './components/line-chart/line-chart';
export { MixedChart, type MixedChartProps } from './components/mixed-chart/mixed-chart';
export { PieChart, type PieChartProps } from './components/pie-chart/pie-chart';
export { RadarChart, type RadarChartProps } from './components/radar-chart/radar-chart';
export {
  ScatterChart,
  type ScatterChartProps,
  type ScatterPointStyle,
} from './components/scatter-chart/scatter-chart';
export {
  WaterfallChart,
  type WaterfallChartProps,
  type WaterfallStep,
} from './components/waterfall-chart/waterfall-chart';

export { DEFAULT_COLORS, getSeriesColor } from './lib/colors';
export { formatValue, type NumberFormat } from './lib/format';
export type { ChartBaseProps, ChartDatum } from './lib/types';
