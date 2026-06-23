import { Pie } from 'react-chartjs-2';

import { ChartA11yCategoryTable } from '../../lib/a11y-table';
import { ensureChartJsRegistered } from '../../lib/chartjs-setup';
import { cn } from '../../lib/cn';
import { DEFAULT_COLORS, getSeriesColor } from '../../lib/colors';
import { formatValue } from '../../lib/format';

import type { ChartBaseProps } from '../../lib/types';

ensureChartJsRegistered();

export interface PieChartProps extends Omit<ChartBaseProps, 'showGrid'> {
  /** 카테고리 이름 키. (예: 'name') */
  nameKey: string;
  /** 값 키. (예: 'value') */
  valueKey: string;
  /**
   * 도넛으로 만들 안쪽 비율(0~1). 0이면 정통 파이.
   * chart.js의 `cutout: '60%'`와 매핑됨. recharts와 다르게 px 대신 비율 사용.
   * 기본 0.
   */
  innerRadius?: number;
  /**
   * @deprecated chart.js는 반응형이라 px 단위 외부 반지름을 지원하지 않음.
   * 차트 크기는 부모 컨테이너 + height로 조절.
   */
  outerRadius?: number;
  /**
   * @deprecated `showValues`를 사용. (구버전 props 호환을 위해 남겨둠)
   */
  showLabels?: boolean;
  /**
   * 각 조각 내부에 퍼센트 라벨 표시 (예: "32.6%"). 기본 false.
   * chartjs-plugin-datalabels로 렌더링.
   */
  showValues?: boolean;
}

/**
 * 파이 차트 — Canvas(chart.js) 기반. 부분/전체 비율 표시.
 *
 * `innerRadius`를 0보다 크게 주면 도넛이 됨 (DoughnutChart는 그 편의 wrapper).
 *
 * @example
 *   <PieChart
 *     data={[
 *       { name: '검색', value: 400 },
 *       { name: '직접', value: 300 },
 *       { name: '소셜', value: 200 },
 *     ]}
 *     nameKey="name"
 *     valueKey="value"
 *   />
 */
export function PieChart({
  data,
  nameKey,
  valueKey,
  height = 300,
  colors = DEFAULT_COLORS,
  showLegend = true,
  showTooltip = true,
  innerRadius = 0,
  showValues = false,
  valueFormat = 'plain',
  a11yTable = true,
  a11yCaption,
  className,
  emptyState,
}: PieChartProps) {
  if (data.length === 0 && emptyState) {
    return <div className={cn('flex items-center justify-center', className)}>{emptyState}</div>;
  }

  const chartData = {
    labels: data.map((row) => String(row[nameKey] ?? '')),
    datasets: [
      {
        data: data.map((row) => Number(row[valueKey] ?? 0)),
        backgroundColor: data.map((_, i) => getSeriesColor(i, colors)),
        // 테두리 없음 — 조각 사이 흰색 분리선 제거.
        borderWidth: 0,
        // hover 시 조각이 중심에서 바깥으로 튀어나오는 거리(px).
        hoverOffset: 15,
      },
    ],
  };

  // 전체 합계 — tooltip에서 퍼센트 계산에 사용. 0 division 방지.
  const total = chartData.datasets[0]!.data.reduce((sum, v) => sum + v, 0) || 1;

  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <Pie
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          // innerRadius (0~1) → chart.js cutout 비율 문자열.
          cutout: innerRadius > 0 ? `${Math.round(innerRadius * 100)}%` : 0,
          plugins: {
            legend: { display: showLegend, position: 'bottom', labels: { font: { size: 12 } } },
            tooltip: {
              enabled: showTooltip,
              callbacks: {
                // "Lithuania: 32.6% (125만)" 형식 — 퍼센트 + valueFormat 적용된 raw value.
                label: (ctx) => {
                  const value = Number(ctx.parsed) || 0;
                  const pct = ((value / total) * 100).toFixed(2);
                  const formatted = formatValue(value, valueFormat);
                  return valueFormat === 'plain'
                    ? `${ctx.label}: ${pct}%`
                    : `${ctx.label}: ${pct}% (${formatted})`;
                },
              },
            },
            // 조각 내부에 퍼센트 라벨 (showValues=true 일 때만).
            // display: true → 모든 조각에 라벨 표시 (작은 조각도 포함).
            // clip: false → 라벨이 조각 경계 넘어가도 잘리지 않음.
            datalabels: {
              display: showValues,
              clip: false,
              color: '#fff',
              font: { size: 12, weight: 500 },
              formatter: (value: number) => {
                const pct = ((value / total) * 100).toFixed(1);
                return `${pct}%`;
              },
            },
          },
        }}
      />
      {a11yTable && (
        <ChartA11yCategoryTable
          data={data}
          nameKey={nameKey}
          valueKey={valueKey}
          caption={a11yCaption}
          valueFormat={valueFormat}
        />
      )}
    </div>
  );
}
