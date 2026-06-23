import { Bar } from 'react-chartjs-2';

import { ChartA11yTable } from '../../lib/a11y-table';
import { ensureChartJsRegistered } from '../../lib/chartjs-setup';
import { cn } from '../../lib/cn';
import { DEFAULT_COLORS, getSeriesColor } from '../../lib/colors';
import { formatValue } from '../../lib/format';

import type { ChartBaseProps } from '../../lib/types';

ensureChartJsRegistered();

export interface BarChartProps extends ChartBaseProps {
  /** X축으로 쓸 키. (예: 'month') */
  xKey: string;
  /** Y축으로 쓸 키들 — 시리즈가 됨. (예: ['revenue', 'profit']) */
  yKeys: string[];
  /** 시리즈 라벨 (범례·툴팁 표시명). 미지정 시 yKeys 그대로. */
  labels?: Record<string, string>;
  /** 가로 막대 모드. 기본 false (세로). */
  horizontal?: boolean;
  /** 막대 누적 표시. 기본 false. */
  stacked?: boolean;
  /** 각 막대 위/안에 값 표시. 기본 false. */
  showValues?: boolean;
}

/**
 * 막대 차트 — Canvas(chart.js) 기반 + 바능 디자인 토큰.
 *
 * # 추가 기능
 * - `valueFormat`: tooltip / 라벨 / y축 tick에 한글 단위(만/억) 또는 콤마 일관 적용
 * - `a11yTable`: 스크린리더용 sr-only data table 자동 렌더 (기본 true)
 *
 * @example
 *   <BarChart
 *     data={[{ month: '1월', revenue: 12000000 }, ...]}
 *     xKey="month"
 *     yKeys={['revenue']}
 *     labels={{ revenue: '매출' }}
 *     valueFormat="korean"        // tooltip/축에 "1.2천만" 형식
 *     a11yCaption="월별 매출"
 *   />
 */
export function BarChart({
  data,
  xKey,
  yKeys,
  labels,
  height = 300,
  colors = DEFAULT_COLORS,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  horizontal = false,
  stacked = false,
  showValues = false,
  valueFormat = 'plain',
  a11yTable = true,
  a11yCaption,
  className,
  emptyState,
}: BarChartProps) {
  if (data.length === 0 && emptyState) {
    return <div className={cn('flex items-center justify-center', className)}>{emptyState}</div>;
  }

  // chart.js는 { labels, datasets } 형태를 요구. data 행 배열에서 변환.
  const chartData = {
    labels: data.map((row) => String(row[xKey] ?? '')),
    datasets: yKeys.map((key, i) => {
      const color = getSeriesColor(i, colors);
      return {
        label: labels?.[key] ?? key,
        data: data.map((row) => Number(row[key] ?? 0)),
        backgroundColor: color,
        borderColor: color,
        borderWidth: 0,
      };
    }),
  };

  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: horizontal ? 'y' : 'x',
          plugins: {
            legend: { display: showLegend, position: 'bottom', labels: { font: { size: 12 } } },
            tooltip: {
              enabled: showTooltip,
              callbacks: {
                // valueFormat 적용 — 한글 단위/콤마 등.
                label: (ctx) =>
                  `${ctx.dataset.label}: ${formatValue(ctx.parsed[horizontal ? 'x' : 'y'], valueFormat)}`,
              },
            },
            // showValues=true → 각 막대(또는 누적 segment) 중앙에 값 표시 (흰 텍스트).
            datalabels: {
              display: showValues,
              color: '#fff',
              font: { size: 11, weight: 500 },
              anchor: 'center',
              align: 'center',
              formatter: (value: number) => formatValue(value, valueFormat),
            },
          },
          scales: {
            x: {
              stacked,
              grid: { display: showGrid },
              ticks: {
                font: { size: 11 },
                // 가로 막대 모드는 x축이 값 축이라 포맷 적용.
                callback: horizontal ? (val) => formatValue(val, valueFormat) : undefined,
              },
            },
            y: {
              stacked,
              grid: { display: showGrid },
              ticks: {
                font: { size: 11 },
                callback: horizontal ? undefined : (val) => formatValue(val, valueFormat),
              },
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
