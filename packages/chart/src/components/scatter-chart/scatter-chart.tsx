import { Scatter } from 'react-chartjs-2';

import { ensureChartJsRegistered } from '../../lib/chartjs-setup';
import { cn } from '../../lib/cn';
import { DEFAULT_COLORS, getSeriesColor } from '../../lib/colors';
import { formatValue } from '../../lib/format';

import type { ChartBaseProps } from '../../lib/types';

ensureChartJsRegistered();

/**
 * 산점도 점 모양 — chart.js의 `pointStyle`과 1:1 매핑.
 * - circle (기본 원)
 * - cross / crossRot (십자)
 * - rect / rectRounded / rectRot (사각형/둥근 사각형/회전 사각형 = 다이아몬드)
 * - star (별)
 * - triangle (삼각형)
 * - dash / line (가로/세로 선)
 */
export type ScatterPointStyle =
  | 'circle'
  | 'cross'
  | 'crossRot'
  | 'dash'
  | 'line'
  | 'rect'
  | 'rectRounded'
  | 'rectRot'
  | 'star'
  | 'triangle';

export interface ScatterChartProps extends ChartBaseProps {
  /** X 좌표 키 (예: 'height'). */
  xKey: string;
  /** Y 좌표 키 (예: 'weight'). */
  yKey: string;
  /**
   * 시리즈 그룹 키. 지정 시 같은 값을 가진 행끼리 묶여 한 시리즈로 렌더 (다른 색).
   * 미지정 시 단일 시리즈.
   * 예: groupKey="school" → 'A school' / 'B school'
   */
  groupKey?: string;
  /** groupKey 값 → 표시명 매핑 (범례·툴팁). 미지정 시 키 그대로. */
  labels?: Record<string, string>;
  /** 점 반지름 (px). 기본 5. */
  pointRadius?: number;
  /**
   * 점 모양. 기본 'circle'.
   * - 단일 값: 모든 시리즈가 같은 모양
   * - 배열: 시리즈 인덱스로 순환 (colors 팔레트와 동일 패턴)
   *
   * @example
   *   pointStyle="triangle"                          // 전체 삼각형
   *   pointStyle={['circle', 'triangle', 'rectRot']} // 시리즈별 다른 모양
   */
  pointStyle?: ScatterPointStyle | ScatterPointStyle[];
  /** X축 ticks suffix (예: 'cm'). 미지정 시 숫자만. */
  xUnit?: string;
  /** Y축 ticks suffix (예: 'kg'). */
  yUnit?: string;
}

/**
 * 산점도 — Canvas(chart.js) 기반. 두 변수의 상관관계 시각화.
 * groupKey로 데이터 행을 자동 그룹핑해 시리즈별 다른 색 점으로 렌더.
 *
 * @example 두 부서 직원의 (경력 년, 연봉 만원)
 *   <ScatterChart
 *     data={[
 *       { dept: '개발팀', career: 1, salary: 3500 },
 *       { dept: '디자인팀', career: 2, salary: 3800 },
 *       // ...
 *     ]}
 *     xKey="career"
 *     yKey="salary"
 *     groupKey="dept"
 *     xUnit="년"
 *     yUnit="만원"
 *   />
 */
export function ScatterChart({
  data,
  xKey,
  yKey,
  groupKey,
  labels,
  height = 300,
  colors = DEFAULT_COLORS,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  pointRadius = 5,
  pointStyle = 'circle',
  xUnit,
  yUnit,
  valueFormat = 'plain',
  a11yTable = true,
  a11yCaption,
  className,
  emptyState,
}: ScatterChartProps) {
  if (data.length === 0 && emptyState) {
    return <div className={cn('flex items-center justify-center', className)}>{emptyState}</div>;
  }

  // groupKey가 있으면 행을 그룹별로 분리. 없으면 단일 시리즈.
  // Map의 삽입 순서 보존 → 데이터에 처음 등장한 그룹이 색상 인덱스 0.
  const groups = new Map<string, { x: number; y: number }[]>();
  if (groupKey) {
    for (const row of data) {
      const group = String(row[groupKey] ?? '');
      const point = { x: Number(row[xKey] ?? 0), y: Number(row[yKey] ?? 0) };
      const bucket = groups.get(group);
      if (bucket) bucket.push(point);
      else groups.set(group, [point]);
    }
  } else {
    groups.set(
      '',
      data.map((row) => ({ x: Number(row[xKey] ?? 0), y: Number(row[yKey] ?? 0) })),
    );
  }

  const datasets = Array.from(groups.entries()).map(([name, points], i) => {
    const color = getSeriesColor(i, colors);
    // pointStyle이 배열이면 시리즈 인덱스로 순환, 단일이면 그대로.
    const style = Array.isArray(pointStyle)
      ? (pointStyle[i % pointStyle.length] ?? 'circle')
      : pointStyle;
    return {
      label: labels?.[name] ?? name,
      data: points,
      backgroundColor: color,
      borderColor: color,
      pointStyle: style,
      pointRadius,
      pointHoverRadius: pointRadius + 2,
    };
  });

  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <Scatter
        data={{ datasets }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: showLegend, position: 'bottom', labels: { font: { size: 12 } } },
            tooltip: {
              enabled: showTooltip,
              callbacks: {
                // "(career=5년, salary=5800만원)" 형식 — xUnit/yUnit 우선, 없으면 valueFormat.
                label: (ctx) => {
                  const p = ctx.parsed;
                  const x = xUnit ? `${p.x}${xUnit}` : formatValue(p.x, valueFormat);
                  const y = yUnit ? `${p.y}${yUnit}` : formatValue(p.y, valueFormat);
                  return `${ctx.dataset.label}: (${x}, ${y})`;
                },
              },
            },
          },
          scales: {
            x: {
              type: 'linear',
              grid: { display: showGrid },
              ticks: {
                font: { size: 11 },
                callback: xUnit
                  ? (value) => `${value}${xUnit}`
                  : (value) => formatValue(value, valueFormat),
              },
            },
            y: {
              type: 'linear',
              grid: { display: showGrid },
              ticks: {
                font: { size: 11 },
                callback: yUnit
                  ? (value) => `${value}${yUnit}`
                  : (value) => formatValue(value, valueFormat),
              },
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
              {groupKey && <th scope="col">{groupKey}</th>}
              <th scope="col">{xKey}</th>
              <th scope="col">{yKey}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {groupKey && <td>{String(row[groupKey] ?? '')}</td>}
                <td>{xUnit ? `${row[xKey]}${xUnit}` : formatValue(row[xKey], valueFormat)}</td>
                <td>{yUnit ? `${row[yKey]}${yUnit}` : formatValue(row[yKey], valueFormat)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
