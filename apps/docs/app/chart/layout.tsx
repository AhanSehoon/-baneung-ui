import { buildPageMetadata } from '@/lib/page-metadata';

import type { Metadata } from 'next';

/**
 * /chart/* 섹션 기본 메타데이터.
 * 개별 차트(bar/line/area/pie/...) 페이지가 자체 metadata를 export하면 override.
 */
export const metadata: Metadata = buildPageMetadata({
  title: 'Chart — 차트 라이브러리',
  description:
    '@baneung-pack/chart — Chart.js 기반 React 차트 라이브러리. 한글 숫자 포맷, sr-only 접근성 표, BarChart · LineChart · AreaChart · PieChart · RadarChart · FlowChart 지원.',
  path: '/chart/bar',
});

export default function ChartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
