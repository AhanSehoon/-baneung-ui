import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ChartContainer, ChartLegend, ChartTooltip, DEFAULT_CHART_COLORS } from './chart';
import { checkA11y } from '../../test-utils/axe';

describe('ChartContainer', () => {
  it('renders children', () => {
    render(
      <ChartContainer responsive={false} height={200}>
        <div data-testid="content">차트</div>
      </ChartContainer>,
    );
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('exposes default token-based colors', () => {
    expect(DEFAULT_CHART_COLORS.length).toBeGreaterThanOrEqual(6);
    expect(DEFAULT_CHART_COLORS[0]).toMatch(/var\(--/);
  });
});

describe('ChartTooltip', () => {
  it('renders nothing when not active', () => {
    const { container } = render(<ChartTooltip active={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders payload when active', () => {
    render(
      <ChartTooltip
        active
        label="1월"
        payload={[
          { name: '매출', value: 1200, color: '#5BA8A0' },
          { name: '비용', value: 800, color: '#3B4B63' },
        ]}
      />,
    );
    expect(screen.getByText('1월')).toBeInTheDocument();
    expect(screen.getByText('매출')).toBeInTheDocument();
    expect(screen.getByText('1200')).toBeInTheDocument();
    expect(screen.getByText('비용')).toBeInTheDocument();
  });

  it('applies value/label formatters', () => {
    render(
      <ChartTooltip
        active
        label="1"
        labelFormatter={(l): string => `${l}월`}
        valueFormatter={(v): string => `₩${String(v)}`}
        payload={[{ name: '매출', value: 1200, color: '#5BA8A0' }]}
      />,
    );
    expect(screen.getByText('1월')).toBeInTheDocument();
    expect(screen.getByText('₩1200')).toBeInTheDocument();
  });
});

describe('ChartLegend', () => {
  it('renders payload entries', async () => {
    const { container } = render(
      <ChartLegend
        payload={[
          { value: '매출', color: '#5BA8A0' },
          { value: '비용', color: '#3B4B63' },
        ]}
      />,
    );
    expect(screen.getByText('매출')).toBeInTheDocument();
    expect(screen.getByText('비용')).toBeInTheDocument();
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
