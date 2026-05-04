import * as React from 'react';
import { ResponsiveContainer } from 'recharts';

import { cn } from '../../lib/cn';

/**
 * 차트에서 사용하는 색상 시리즈. 토큰 기반.
 * 시리즈가 더 많으면 `colors` prop으로 직접 제공하세요.
 */
export const DEFAULT_CHART_COLORS = [
  'var(--color-text-link)', // 시그니처 청록 (변형)
  'var(--color-foreground)',
  'var(--color-info)',
  'var(--color-success)',
  'var(--color-warning)',
  'var(--color-danger)',
  'var(--color-foreground-muted)',
] as const;

export interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 차트 시리즈에 적용될 색상 (CSS 색상값 배열). 기본 토큰 기반 6+1 색. */
  colors?: readonly string[];
  /** 컨테이너의 고정 height(px). 미지정 시 부모 height 100%. */
  height?: number;
  /** ResponsiveContainer 사용 여부. 기본 true. false면 자식이 직접 차트를 렌더. */
  responsive?: boolean;
}

/**
 * ChartContainer — recharts 차트의 토큰 색상 / 반응형 컨테이너.
 *
 * @example
 *   <ChartContainer height={240}>
 *     <LineChart data={data}>
 *       <XAxis dataKey="month" />
 *       <YAxis />
 *       <Tooltip content={<ChartTooltip />} />
 *       <Line dataKey="sales" stroke="var(--color-text-link)" />
 *     </LineChart>
 *   </ChartContainer>
 */
export const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  function ChartContainer(
    {
      className,
      colors: _colors = DEFAULT_CHART_COLORS,
      height,
      responsive = true,
      children,
      style,
      ...props
    },
    ref,
  ) {
    const content = responsive ? (
      <ResponsiveContainer width="100%" height="100%">
        {children as React.ReactElement}
      </ResponsiveContainer>
    ) : (
      children
    );

    return (
      <div
        ref={ref}
        className={cn('w-full text-foreground', className)}
        style={{ height: height ?? '100%', ...style }}
        {...props}
      >
        {content}
      </div>
    );
  },
);
ChartContainer.displayName = 'ChartContainer';

export interface ChartTooltipPayload {
  name?: string;
  value?: number | string;
  color?: string;
  dataKey?: string;
}

export interface ChartTooltipProps {
  active?: boolean;
  payload?: ChartTooltipPayload[];
  label?: string | number;
  /** 라벨 포맷터. */
  labelFormatter?: (label: string | number) => React.ReactNode;
  /** 값 포맷터. */
  valueFormatter?: (value: number | string) => React.ReactNode;
}

/**
 * ChartTooltip — recharts Tooltip의 `content` prop으로 전달.
 * 토큰 기반 보더/배경/그림자 적용.
 */
export function ChartTooltip({
  active,
  payload,
  label,
  labelFormatter,
  valueFormatter,
}: ChartTooltipProps): React.ReactElement | null {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div
      className={cn(
        'min-w-32 px-3 py-2 text-xs',
        'bg-canvas text-foreground border border-border-default rounded-none shadow-md',
      )}
    >
      {label !== undefined ? (
        <div className="mb-1 font-medium text-foreground">
          {labelFormatter ? labelFormatter(label) : label}
        </div>
      ) : null}
      <ul className="flex flex-col gap-0.5">
        {payload.map((entry, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="size-2 shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-foreground-muted">{entry.name ?? entry.dataKey}</span>
            <span className="ml-auto font-medium text-foreground">
              {valueFormatter && entry.value !== undefined
                ? valueFormatter(entry.value)
                : (entry.value ?? '')}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export interface ChartLegendProps extends React.HTMLAttributes<HTMLUListElement> {
  /** recharts Legend가 전달하는 payload 또는 직접 시리즈 배열. */
  payload?: { value?: string; color?: string }[];
}

/**
 * ChartLegend — recharts Legend의 `content` prop으로 전달 가능.
 */
export function ChartLegend({
  className,
  payload,
  ...props
}: ChartLegendProps): React.ReactElement {
  return (
    <ul className={cn('flex flex-wrap items-center gap-x-4 gap-y-1 text-xs', className)} {...props}>
      {(payload ?? []).map((entry, idx) => (
        <li key={idx} className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="size-2 shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-foreground-muted">{entry.value}</span>
        </li>
      ))}
    </ul>
  );
}
