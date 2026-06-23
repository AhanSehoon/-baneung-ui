import { Bar } from 'react-chartjs-2';

import { ensureChartJsRegistered } from '../../lib/chartjs-setup';
import { cn } from '../../lib/cn';
import { formatValue, type NumberFormat } from '../../lib/format';

import type { ReactNode } from 'react';

ensureChartJsRegistered();

/** Waterfall 차트의 한 스텝. */
export interface WaterfallStep {
  /** X축에 표시할 라벨. */
  label: string;
  /**
   * 이 스텝의 기여 값.
   * - 양수: 누적 총계가 증가 (예: 매출 +210)
   * - 음수: 누적 총계가 감소 (예: 비용 -170)
   * - `total: true`인 경우 절대값(시작/끝 합계). 마지막 total은 생략 시 현재 누적값으로 자동 채움.
   */
  value?: number;
  /**
   * 시작/끝/소계 표시. true면 0부터 절대 위치까지 풀바로 그려짐 (다른 색).
   * 예: 시작 'Revenue'와 끝 'Profit'은 total=true.
   */
  total?: boolean;
}

export interface WaterfallChartProps {
  /** 스텝 배열 — 좌→우 순서대로 누적 흐름 표현. */
  data: WaterfallStep[];
  /** 차트 높이 (px). 기본 320. */
  height?: number;
  /** 양수 기여 색상. 기본 emerald (DEFAULT_COLORS의 #10B981 — 다른 차트와 동일 팔레트). */
  positiveColor?: string;
  /** 음수 기여 색상. 기본 red (DEFAULT_COLORS의 #EF4444). */
  negativeColor?: string;
  /** 시작/끝/소계(`total:true`) 색상. 기본 바능 navy-900 (#1F2937 — 브랜드 메인). */
  totalColor?: string;
  /** 그리드 표시 여부. 기본 true. */
  showGrid?: boolean;
  /** 범례 표시 (단일 시리즈라 기본 false). */
  showLegend?: boolean;
  /** 툴팁 표시. 기본 true. 라벨 + 부호 있는 값. */
  showTooltip?: boolean;
  /** 각 막대 위/안에 변화량 표시 (예: "+210", "-170"). 기본 false. */
  showValues?: boolean;
  /** 값 포맷 — tooltip / 라벨 / y축 tick에 적용 (예: 'korean' → +210만, -170만). */
  valueFormat?: NumberFormat;
  /** 접근성 sr-only 데이터 테이블 자동 렌더 여부. 기본 true. */
  a11yTable?: boolean;
  /** a11y 테이블 caption. */
  a11yCaption?: string;
  /** 외부 wrapper className. */
  className?: string;
  /** 빈 데이터일 때 표시할 노드. */
  emptyState?: ReactNode;
}

/**
 * Waterfall 차트 — 누적 변화(매출 → 비용 → 이익 등)를 시각화.
 * 각 막대는 이전 누적값에서 시작해 변화량만큼 위/아래로 이동.
 * 내부적으로 chart.js Floating Bar(`[low, high]` range data)로 구현.
 *
 * @example 매출 → 비용 → 이익
 *   <WaterfallChart
 *     data={[
 *       { label: 'Revenue', value: 420, total: true },
 *       { label: 'Services', value: 210 },
 *       { label: 'Fixed costs', value: -170 },
 *       { label: 'Variable costs', value: -110 },
 *       { label: 'Taxes', value: -70 },
 *       { label: 'Profit', total: true },           // 자동으로 누적값 사용
 *     ]}
 *   />
 */
export function WaterfallChart({
  data,
  height = 320,
  // 기본 색상 — DEFAULT_COLORS 팔레트와 같은 톤으로 다른 차트와 깔맞춤.
  // positive: emerald, negative: red (둘 다 DEFAULT_COLORS에 존재)
  // total: 바능 navy-900 (브랜드 메인 컬러)
  positiveColor = '#10B981',
  negativeColor = '#EF4444',
  totalColor = '#1F2937',
  showGrid = true,
  showLegend = false,
  showTooltip = true,
  showValues = false,
  valueFormat = 'plain',
  a11yTable = true,
  a11yCaption,
  className,
  emptyState,
}: WaterfallChartProps) {
  if (data.length === 0 && emptyState) {
    return <div className={cn('flex items-center justify-center', className)}>{emptyState}</div>;
  }

  /**
   * 각 스텝을 floating bar 범위로 변환.
   * - total=true: [0, 절대값] 풀바
   * - 양수 기여: [현재누적, 현재누적+v] 위로
   * - 음수 기여: [현재누적+v, 현재누적] 아래로 (low < high 유지)
   */
  let running = 0;
  const bars = data.map((step) => {
    if (step.total) {
      const total = step.value ?? running;
      const range: [number, number] = [0, total];
      running = total;
      return { label: step.label, range, kind: 'total' as const, delta: total };
    }
    const v = step.value ?? 0;
    const range: [number, number] = v >= 0 ? [running, running + v] : [running + v, running];
    running += v;
    return {
      label: step.label,
      range,
      kind: (v >= 0 ? 'positive' : 'negative') as 'positive' | 'negative',
      delta: v,
    };
  });

  const chartData = {
    labels: bars.map((b) => b.label),
    datasets: [
      {
        label: 'Waterfall',
        data: bars.map((b) => b.range),
        backgroundColor: bars.map((b) =>
          b.kind === 'total' ? totalColor : b.kind === 'positive' ? positiveColor : negativeColor,
        ),
        borderWidth: 0,
      },
    ],
  };

  /** "+210만", "-170만", "420만" 형태의 라벨. total은 부호 없이 절대값. valueFormat 적용. */
  const formatDelta = (i: number): string => {
    const b = bars[i];
    if (!b) return '';
    const formatted = formatValue(Math.abs(b.delta), valueFormat);
    if (b.kind === 'total') return formatted;
    return b.delta >= 0 ? `+${formatted}` : `-${formatted}`;
  };

  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: showLegend },
            tooltip: {
              enabled: showTooltip,
              callbacks: {
                label: (ctx) => `${bars[ctx.dataIndex]?.label}: ${formatDelta(ctx.dataIndex)}`,
              },
            },
            datalabels: {
              display: showValues,
              color: '#fff',
              font: { size: 11, weight: 500 },
              formatter: (_v, ctx) => formatDelta(ctx.dataIndex),
            },
          },
          scales: {
            x: { grid: { display: showGrid }, ticks: { font: { size: 11 } } },
            y: {
              beginAtZero: true,
              grid: { display: showGrid },
              ticks: { font: { size: 11 }, callback: (v) => formatValue(v, valueFormat) },
            },
          },
        }}
      />
      {a11yTable && data.length > 0 && (
        <table
          style={{
            position: 'absolute',
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            border: 0,
          }}
          aria-hidden={false}
        >
          {a11yCaption && <caption>{a11yCaption}</caption>}
          <thead>
            <tr>
              <th scope="col">단계</th>
              <th scope="col">변화량</th>
              <th scope="col">누적 합계</th>
            </tr>
          </thead>
          <tbody>
            {bars.map((b, i) => {
              const runningTotal = b.range[1];
              return (
                <tr key={i}>
                  <th scope="row">{b.label}</th>
                  <td>{formatDelta(i)}</td>
                  <td>{formatValue(runningTotal, valueFormat)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
