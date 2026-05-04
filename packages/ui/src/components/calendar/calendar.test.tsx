import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Calendar } from './calendar';
import { checkA11y } from '../../test-utils/axe';

describe('Calendar', () => {
  it('renders month grid', () => {
    render(<Calendar mode="single" />);
    // react-day-picker는 grid role을 사용
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('selects a day on click (single mode)', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Calendar mode="single" onSelect={onSelect} month={new Date(2026, 4, 1)} />);
    // gridcell은 wrapper, 실제 인터랙션은 안쪽 button
    const cell = screen.getByRole('gridcell', { name: /15/ });
    const dayBtn = cell.querySelector('button');
    expect(dayBtn).toBeTruthy();
    await user.click(dayBtn!);
    expect(onSelect).toHaveBeenCalled();
  });

  it('respects disabled dates', () => {
    const disabled = new Date(2026, 4, 10);
    render(<Calendar mode="single" month={new Date(2026, 4, 1)} disabled={[disabled]} />);
    const cell = screen.getByRole('gridcell', { name: /^10/ });
    const btn = cell.querySelector('button');
    expect(btn?.hasAttribute('disabled') || btn?.getAttribute('aria-disabled') === 'true').toBe(
      true,
    );
  });

  it('passes axe a11y scan', async () => {
    const { container } = render(<Calendar mode="single" />);
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
