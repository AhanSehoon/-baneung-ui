import { Chart } from 'react-chartjs-2';

import { ChartA11yTable } from '../../lib/a11y-table';
import { ensureChartJsRegistered } from '../../lib/chartjs-setup';
import { cn } from '../../lib/cn';
import { DEFAULT_COLORS, getSeriesColor } from '../../lib/colors';
import { formatValue } from '../../lib/format';

import type { ChartBaseProps } from '../../lib/types';

ensureChartJsRegistered();

export interface MixedChartProps extends ChartBaseProps {
  /** X축 키. */
  xKey: string;
  /** 막대로 표시할 시리즈 키들. */
  barKeys: string[];
  /** 선으로 표시할 시리즈 키들. */
  lineKeys: string[];
  /** 시리즈 라벨 (범례/툴팁 표시명). 미지정 시 키 그대로. */
  labels?: Record<string, string>;
  /**
   * 우측 보조 y축에 매핑할 시리즈 키 목록 (bar/line 어느 쪽이든 가능).
   * 예: Pareto 차트 → `rightAxisKeys={['cumulative']}` + `rightAxisPercent`
   */
  rightAxisKeys?: string[];
  /** 우측 y축을 0~100% 범위로 고정. 기본 false. */
  rightAxisPercent?: boolean;
  /** 선의 곡선 보간(monotone). 기본 false. */
  smooth?: boolean;
  /** 막대 누적 표시 (barKeys끼리). 기본 false. */
  stacked?: boolean;
  /** 막대/선 위에 값 라벨 표시. 기본 false. */
  showValues?: boolean;
}

/**
 * 막대 + 선 혼합 차트 — Canvas(chart.js) 기반.
 * 우측 보조 y축 옵션으로 Pareto, 매출 + 누적 비율 등 듀얼 스케일 표현 가능.
 *
 * @example Pareto 차트 (매출 막대 + 누적% 선, 우측 % 축)
 *   <MixedChart
 *     data={[{ country: 'US', sales: 720, cum: 20 }, ...]}
 *     xKey="country"
 *     barKeys={['sales']}
 *     lineKeys={['cum']}
 *     labels={{ sales: '매출', cum: '누적 비율' }}
 *     rightAxisKeys={['cum']}
 *     rightAxisPercent
 *   />
 */
export function MixedChart({
  data,
  xKey,
  barKeys,
  lineKeys,
  labels,
  height = 300,
  colors = DEFAULT_COLORS,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  rightAxisKeys = [],
  rightAxisPercent = false,
  smooth = false,
  stacked = false,
  showValues = false,
  valueFormat = 'plain',
  a11yTable = true,
  a11yCaption,
  className,
  emptyState,
}: MixedChartProps) {
  if (data.length === 0 && emptyState) {
    return <div className={cn('flex items-center justify-center', className)}>{emptyState}</div>;
  }

  const rightSet = new Set(rightAxisKeys);
  const hasRightAxis = rightAxisKeys.length > 0;

  // bar + line 데이터셋 — chart.js는 datasets에 type을 명시하면 mixed 차트로 동작.
  // colors 팔레트는 barKeys → lineKeys 순으로 사이클.
  const chartData = {
    labels: data.map((row) => String(row[xKey] ?? '')),
    datasets: [
      ...barKeys.map((key, i) => {
        const color = getSeriesColor(i, colors);
        return {
          type: 'bar' as const,
          label: labels?.[key] ?? key,
          data: data.map((row) => Number(row[key] ?? 0)),
          backgroundColor: color,
          borderColor: color,
          borderWidth: 0,
          yAxisID: rightSet.has(key) ? 'y1' : 'y',
          stack: stacked ? 'stack' : undefined,
          // chart.js: 낮은 order가 위로 그려짐 → bars는 높은 order로 뒤에 배치.
          order: 2,
        };
      }),
      ...lineKeys.map((key, i) => {
        const color = getSeriesColor(barKeys.length + i, colors);
        return {
          type: 'line' as const,
          label: labels?.[key] ?? key,
          data: data.map((row) => Number(row[key] ?? 0)),
          borderColor: color,
          backgroundColor: color,
          tension: smooth ? 0.4 : 0,
          pointRadius: 3,
          pointHoverRadius: 5,
          borderWidth: 2,
          fill: false,
          yAxisID: rightSet.has(key) ? 'y1' : 'y',
          // 라인은 낮은 order로 막대 위에 오버레이.
          order: 1,
        };
      }),
    ],
  };

  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <Chart
        type="bar"
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          // 마우스 호버 시 같은 x값의 모든 시리즈 툴팁 동시 표시.
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { display: showLegend, position: 'bottom', labels: { font: { size: 12 } } },
            tooltip: {
              enabled: showTooltip,
              callbacks: {
                label: (ctx) => `${ctx.dataset.label}: ${formatValue(ctx.parsed.y, valueFormat)}`,
              },
            },
            datalabels: {
              display: showValues,
              color: '#fff',
              font: { size: 11, weight: 500 },
              formatter: (value: number) => formatValue(value, valueFormat),
            },
          },
          scales: {
            x: { stacked, grid: { display: showGrid }, ticks: { font: { size: 11 } } },
            y: {
              type: 'linear',
              position: 'left',
              stacked,
              grid: { display: showGrid },
              ticks: { font: { size: 11 }, callback: (v) => formatValue(v, valueFormat) },
            },
            // 우측 y축은 rightAxisKeys가 비어있지 않을 때만 추가.
            ...(hasRightAxis && {
              y1: {
                type: 'linear',
                position: 'right',
                min: rightAxisPercent ? 0 : undefined,
                max: rightAxisPercent ? 100 : undefined,
                // 좌측 그리드와 시각적으로 충돌 방지 — 우측 그리드는 안 그림.
                grid: { drawOnChartArea: false },
                ticks: {
                  font: { size: 11 },
                  callback: rightAxisPercent ? (value) => `${value}%` : undefined,
                },
              },
            }),
          },
        }}
      />
      {a11yTable && (
        <ChartA11yTable
          data={data}
          xKey={xKey}
          yKeys={[...barKeys, ...lineKeys]}
          labels={labels}
          caption={a11yCaption}
          valueFormat={valueFormat}
        />
      )}
    </div>
  );
}
