import { Line } from 'react-chartjs-2';

import { ChartA11yTable } from '../../lib/a11y-table';
import { ensureChartJsRegistered } from '../../lib/chartjs-setup';
import { cn } from '../../lib/cn';
import { DEFAULT_COLORS, getSeriesColor } from '../../lib/colors';
import { formatValue } from '../../lib/format';

import type { ChartBaseProps } from '../../lib/types';

ensureChartJsRegistered();

export interface AreaChartProps extends ChartBaseProps {
  /** X축 키. */
  xKey: string;
  /** Y축 키들. */
  yKeys: string[];
  /** 시리즈 라벨. */
  labels?: Record<string, string>;
  /** 곡선 보간. 기본 true (영역 차트는 부드러운 게 일반적). */
  smooth?: boolean;
  /** 누적 영역. 기본 false. */
  stacked?: boolean;
  /** 채움 투명도 (0~1). 기본 0.3. */
  fillOpacity?: number;
}

/**
 * 영역 차트 — Canvas(chart.js) 기반. 누적 추세, 시장 점유율 추이 등에 적합.
 * 내부적으로 chart.js Line + fill 옵션으로 구현.
 *
 * @example
 *   <AreaChart
 *     data={data}
 *     xKey="month"
 *     yKeys={['organic', 'paid']}
 *     stacked
 *   />
 */
export function AreaChart({
  data,
  xKey,
  yKeys,
  labels,
  height = 300,
  colors = DEFAULT_COLORS,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  smooth = true,
  stacked = false,
  fillOpacity = 0.3,
  valueFormat = 'plain',
  a11yTable = true,
  a11yCaption,
  className,
  emptyState,
}: AreaChartProps) {
  if (data.length === 0 && emptyState) {
    return <div className={cn('flex items-center justify-center', className)}>{emptyState}</div>;
  }

  /** #RRGGBB 컬러를 rgba(...,opacity)로 변환. 6자리 hex만 지원. */
  const hexToRgba = (hex: string, alpha: number): string => {
    const m = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex);
    if (!m) return hex;
    const r = parseInt(m[1]!, 16);
    const g = parseInt(m[2]!, 16);
    const b = parseInt(m[3]!, 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const chartData = {
    labels: data.map((row) => String(row[xKey] ?? '')),
    datasets: yKeys.map((key, i) => {
      const color = getSeriesColor(i, colors);
      return {
        label: labels?.[key] ?? key,
        data: data.map((row) => Number(row[key] ?? 0)),
        borderColor: color,
        backgroundColor: hexToRgba(color, fillOpacity),
        tension: smooth ? 0.4 : 0,
        // fill=origin: 단일, fill=true: 누적(이전 데이터셋 위로)
        fill: stacked ? true : 'origin',
        pointRadius: 0,
        pointHoverRadius: 5,
        borderWidth: 2,
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
              stacked,
              grid: { display: showGrid },
              ticks: { font: { size: 11 }, callback: (v) => formatValue(v, valueFormat) },
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
