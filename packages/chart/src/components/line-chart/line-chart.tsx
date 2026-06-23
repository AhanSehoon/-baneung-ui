import { Line } from 'react-chartjs-2';

import { ChartA11yTable } from '../../lib/a11y-table';
import { ensureChartJsRegistered } from '../../lib/chartjs-setup';
import { cn } from '../../lib/cn';
import { DEFAULT_COLORS, getSeriesColor } from '../../lib/colors';
import { formatValue } from '../../lib/format';

import type { ChartBaseProps } from '../../lib/types';

ensureChartJsRegistered();

export interface LineChartProps extends ChartBaseProps {
  /** X축 키. */
  xKey: string;
  /** Y축 키들 — 시리즈가 됨. */
  yKeys: string[];
  /** 시리즈 라벨. */
  labels?: Record<string, string>;
  /** 곡선 보간 (smooth) 사용 여부. 기본 false (직선 연결). */
  smooth?: boolean;
  /** 데이터 포인트(dot) 표시 여부. 기본 true. */
  showDots?: boolean;
}

/**
 * 선 차트 — Canvas(chart.js) 기반. 시계열 등 연속 데이터 표시에 적합.
 * `valueFormat`로 한글 단위 적용, `a11yTable`로 스크린리더 데이터 테이블 자동 제공.
 *
 * @example
 *   <LineChart
 *     data={[{ date: '01', v1: 10, v2: 20 }, ...]}
 *     xKey="date"
 *     yKeys={['v1', 'v2']}
 *     labels={{ v1: '서울', v2: '부산' }}
 *     smooth
 *   />
 */
export function LineChart({
  data,
  xKey,
  yKeys,
  labels,
  height = 300,
  colors = DEFAULT_COLORS,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  smooth = false,
  showDots = true,
  valueFormat = 'plain',
  a11yTable = true,
  a11yCaption,
  className,
  emptyState,
}: LineChartProps) {
  if (data.length === 0 && emptyState) {
    return <div className={cn('flex items-center justify-center', className)}>{emptyState}</div>;
  }

  const chartData = {
    labels: data.map((row) => String(row[xKey] ?? '')),
    datasets: yKeys.map((key, i) => {
      const color = getSeriesColor(i, colors);
      return {
        label: labels?.[key] ?? key,
        data: data.map((row) => Number(row[key] ?? 0)),
        borderColor: color,
        backgroundColor: color,
        // smooth=true → tension 0.4 (자연스러운 곡선)
        tension: smooth ? 0.4 : 0,
        // showDots=false → 평소엔 숨기고 hover에서만 표시
        pointRadius: showDots ? 3 : 0,
        pointHoverRadius: 5,
        borderWidth: 2,
        fill: false,
      };
    }),
  };

  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <Line
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: showLegend, position: 'bottom', labels: { font: { size: 12 } } },
            tooltip: {
              enabled: showTooltip,
              callbacks: {
                label: (ctx) => `${ctx.dataset.label}: ${formatValue(ctx.parsed.y, valueFormat)}`,
              },
            },
          },
          scales: {
            x: { grid: { display: showGrid }, ticks: { font: { size: 11 } } },
            y: {
              grid: { display: showGrid },
              ticks: { font: { size: 11 }, callback: (val) => formatValue(val, valueFormat) },
            },
          },
        }}
      />
      {a11yTable && (
        <ChartA11yTable
          data={data}
          xKey={xKey}
          yKeys={yKeys}
          labels={labels}
          caption={a11yCaption}
          valueFormat={valueFormat}
        />
      )}
    </div>
  );
}
