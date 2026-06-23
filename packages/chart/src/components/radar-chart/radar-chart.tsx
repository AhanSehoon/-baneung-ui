import { Radar } from 'react-chartjs-2';

import { ChartA11yTable } from '../../lib/a11y-table';
import { ensureChartJsRegistered } from '../../lib/chartjs-setup';
import { cn } from '../../lib/cn';
import { DEFAULT_COLORS, getSeriesColor } from '../../lib/colors';
import { formatValue } from '../../lib/format';

import type { ChartBaseProps } from '../../lib/types';

ensureChartJsRegistered();

export interface RadarChartProps extends ChartBaseProps {
  /**
   * 축으로 사용할 키 목록. 각 데이터 행에서 이 키들의 값을 추출해 방사형으로 표시.
   * 예: `['frontend', 'backend', 'devops']`
   */
  axes: string[];
  /** 시리즈 이름이 들어있는 키 (각 데이터 행 = 하나의 radar 모양). */
  labelKey: string;
  /** 축 라벨 매핑 (키 → 표시명). 미지정 시 키 그대로. */
  axisLabels?: Record<string, string>;
  /** 최대값 (방사형 스케일 외곽). 미지정 시 자동. */
  max?: number;
  /** 채움 투명도 (0~1). 기본 0.25. `0`이면 채움 없이 외곽선만. */
  fillOpacity?: number;
  /**
   * radar 외곽선(border) 표시 여부. 기본 true.
   * `false`면 선 두께 0 → 채움 영역만 보임 (`fillOpacity > 0`과 함께 사용 권장).
   */
  showLine?: boolean;
}

/**
 * 레이더 차트 — Canvas(chart.js) 기반. 여러 축의 값을 방사형으로 비교.
 * 각 데이터 행이 하나의 radar 모양(시리즈)이 됨.
 *
 * @example 개발자 역량 평가 — 시니어 vs 주니어 비교
 *   <RadarChart
 *     data={[
 *       { role: '시니어', frontend: 90, backend: 85, devops: 75, ... },
 *       { role: '주니어', frontend: 65, backend: 60, devops: 50, ... },
 *     ]}
 *     labelKey="role"
 *     axes={['frontend', 'backend', 'devops', 'database', 'testing', 'communication']}
 *     axisLabels={{ frontend: 'Frontend', backend: 'Backend', ... }}
 *     max={100}
 *   />
 */
export function RadarChart({
  data,
  axes,
  labelKey,
  axisLabels,
  height = 360,
  colors = DEFAULT_COLORS,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  max,
  fillOpacity = 0.25,
  showLine = true,
  valueFormat = 'plain',
  a11yTable = true,
  a11yCaption,
  className,
  emptyState,
}: RadarChartProps) {
  if (data.length === 0 && emptyState) {
    return <div className={cn('flex items-center justify-center', className)}>{emptyState}</div>;
  }

  /** #RRGGBB → rgba(R,G,B,opacity). 6자리 hex만 지원. */
  const hexToRgba = (hex: string, alpha: number): string => {
    const m = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex);
    if (!m) return hex;
    const r = parseInt(m[1]!, 16);
    const g = parseInt(m[2]!, 16);
    const b = parseInt(m[3]!, 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const chartData = {
    // 축 라벨 — axisLabels 매핑이 있으면 표시명, 없으면 원본 키.
    labels: axes.map((a) => axisLabels?.[a] ?? a),
    datasets: data.map((row, i) => {
      const color = getSeriesColor(i, colors);
      return {
        label: String(row[labelKey] ?? `Series ${i + 1}`),
        data: axes.map((a) => Number(row[a] ?? 0)),
        borderColor: color,
        backgroundColor: hexToRgba(color, fillOpacity),
        pointBackgroundColor: color,
        pointRadius: 3,
        pointHoverRadius: 5,
        // showLine=false → 외곽선 제거 (채움 영역만 표시).
        borderWidth: showLine ? 2 : 0,
      };
    }),
  };

  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <Radar
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: showLegend, position: 'bottom', labels: { font: { size: 12 } } },
            tooltip: {
              enabled: showTooltip,
              callbacks: {
                label: (ctx) => `${ctx.dataset.label}: ${formatValue(ctx.parsed.r, valueFormat)}`,
              },
            },
          },
          scales: {
            r: {
              suggestedMin: 0,
              suggestedMax: max,
              grid: { display: showGrid },
              angleLines: { display: showGrid },
              ticks: {
                font: { size: 10 },
                backdropColor: 'transparent',
                callback: (v) => formatValue(v, valueFormat),
              },
              pointLabels: { font: { size: 12 } },
            },
          },
        }}
      />
      {a11yTable && (
        <ChartA11yTable
          data={data}
          xKey={labelKey}
          yKeys={axes}
          labels={axisLabels}
          caption={a11yCaption}
          valueFormat={valueFormat}
        />
      )}
    </div>
  );
}
