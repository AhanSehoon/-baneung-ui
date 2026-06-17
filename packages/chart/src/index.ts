/**
 * @baneung-pack/chart — public exports.
 *
 * 핵심 차트 컴포넌트 + 데이터 유틸 + 타입.
 */

// 메인 차트 컴포넌트
export { BarChart3D, type BarChart3DProps } from './components/bar-chart-3d';
export { ChartCanvas, type ChartCanvasProps } from './components/chart-canvas';

// 데이터 / 스케일 유틸 (server 안전 — React/Three 의존성 없음)
export { scaleHeight, computeBarXPositions } from './lib/scale';
export { CHART_COLORS } from './lib/colors';

// 타입
export type { BarChartDatum, ScaleHeightOptions } from './lib/types';
