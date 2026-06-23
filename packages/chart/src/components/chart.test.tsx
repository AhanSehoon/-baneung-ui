import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AreaChart } from './area-chart/area-chart';
import { BarChart } from './bar-chart/bar-chart';
import { DoughnutChart } from './doughnut-chart/doughnut-chart';
import { FlowChart } from './flow-chart/flow-chart';
import { LineChart } from './line-chart/line-chart';
import { MixedChart } from './mixed-chart/mixed-chart';
import { PieChart } from './pie-chart/pie-chart';
import { RadarChart } from './radar-chart/radar-chart';
import { ScatterChart } from './scatter-chart/scatter-chart';
import { WaterfallChart } from './waterfall-chart/waterfall-chart';

const xyData = [
  { month: '1월', a: 100, b: 50 },
  { month: '2월', a: 200, b: 80 },
  { month: '3월', a: 150, b: 60 },
];

const categoryData = [
  { name: 'A', value: 30 },
  { name: 'B', value: 40 },
  { name: 'C', value: 30 },
];

describe('chart smoke tests (canvas)', () => {
  it('BarChart renders a canvas element', () => {
    const { container } = render(
      <div style={{ width: 400 }}>
        <BarChart data={xyData} xKey="month" yKeys={['a', 'b']} height={200} />
      </div>,
    );
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });

  it('LineChart renders a canvas element', () => {
    const { container } = render(
      <div style={{ width: 400 }}>
        <LineChart data={xyData} xKey="month" yKeys={['a']} height={200} smooth />
      </div>,
    );
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });

  it('AreaChart renders a canvas element', () => {
    const { container } = render(
      <div style={{ width: 400 }}>
        <AreaChart data={xyData} xKey="month" yKeys={['a', 'b']} height={200} stacked />
      </div>,
    );
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });

  it('PieChart renders a canvas element', () => {
    const { container } = render(
      <div style={{ width: 400 }}>
        <PieChart data={categoryData} nameKey="name" valueKey="value" height={200} />
      </div>,
    );
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });

  it('DoughnutChart renders a canvas element', () => {
    const { container } = render(
      <div style={{ width: 400 }}>
        <DoughnutChart data={categoryData} nameKey="name" valueKey="value" height={200} />
      </div>,
    );
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });

  it('RadarChart renders a canvas element with multiple series', () => {
    const { container } = render(
      <div style={{ width: 400 }}>
        <RadarChart
          data={[
            { role: 'A', a: 80, b: 60, c: 70 },
            { role: 'B', a: 50, b: 90, c: 60 },
          ]}
          labelKey="role"
          axes={['a', 'b', 'c']}
          height={200}
        />
      </div>,
    );
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });

  it('ScatterChart renders a canvas element with grouped series', () => {
    const { container } = render(
      <div style={{ width: 400 }}>
        <ScatterChart
          data={[
            { dept: 'A', career: 1, salary: 3500 },
            { dept: 'A', career: 5, salary: 5800 },
            { dept: 'B', career: 3, salary: 4200 },
            { dept: 'B', career: 8, salary: 6500 },
          ]}
          xKey="career"
          yKey="salary"
          groupKey="dept"
          height={200}
        />
      </div>,
    );
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });

  it('WaterfallChart renders a canvas element', () => {
    const { container } = render(
      <div style={{ width: 400 }}>
        <WaterfallChart
          data={[
            { label: 'Start', value: 100, total: true },
            { label: 'A', value: 50 },
            { label: 'B', value: -30 },
            { label: 'End', total: true },
          ]}
          height={200}
        />
      </div>,
    );
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });

  it('MixedChart renders a canvas element with right axis', () => {
    const { container } = render(
      <div style={{ width: 400 }}>
        <MixedChart
          data={xyData}
          xKey="month"
          barKeys={['a']}
          lineKeys={['b']}
          rightAxisKeys={['b']}
          rightAxisPercent
          height={200}
        />
      </div>,
    );
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });

  it('FlowChart renders nodes and edges as SVG', () => {
    const { container } = render(
      <div style={{ width: 600 }}>
        <FlowChart
          nodes={[
            { id: 'a', label: 'Start', x: 40, y: 40 },
            { id: 'b', label: 'End', x: 280, y: 40 },
          ]}
          edges={[{ source: 'a', target: 'b', type: 'bezier', label: 'go' }]}
          height={200}
        />
      </div>,
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
    // 2 nodes + 1 edge → 2 rect + 1 path with arrow marker
    expect(container.querySelectorAll('rect').length).toBeGreaterThanOrEqual(2);
    expect(container.querySelector('path')).toBeInTheDocument();
  });

  it('shows emptyState when data is empty', () => {
    const { getByText } = render(
      <BarChart data={[]} xKey="x" yKeys={['y']} emptyState={<span>데이터 없음</span>} />,
    );
    expect(getByText('데이터 없음')).toBeInTheDocument();
  });
});
