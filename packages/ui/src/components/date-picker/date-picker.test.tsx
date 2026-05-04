import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { DatePicker } from './date-picker';
import { checkA11y } from '../../test-utils/axe';

describe('DatePicker', () => {
  it('renders trigger with placeholder', () => {
    render(<DatePicker aria-label="날짜" placeholder="날짜 선택" />);
    expect(screen.getByRole('button', { name: '날짜' })).toHaveTextContent('날짜 선택');
  });

  it('shows formatted value when set', () => {
    render(
      <DatePicker
        aria-label="날짜"
        defaultValue={new Date(2026, 3, 28)}
        formatDate={(d): string => `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`}
      />,
    );
    expect(screen.getByRole('button', { name: '날짜' })).toHaveTextContent('2026/4/28');
  });

  it('opens popover on click and selects a date', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DatePicker aria-label="날짜" defaultValue={new Date(2026, 4, 1)} onValueChange={onChange} />,
    );
    await user.click(screen.getByRole('button', { name: '날짜' }));
    const grid = await screen.findByRole('grid');
    expect(grid).toBeInTheDocument();
    const cell = screen.getByRole('gridcell', { name: /^15/ });
    const dayBtn = cell.querySelector('button');
    expect(dayBtn).toBeTruthy();
    await user.click(dayBtn!);
    expect(onChange).toHaveBeenCalled();
  });

  it('passes axe a11y scan (closed)', async () => {
    const { container } = render(<DatePicker aria-label="날짜" placeholder="날짜 선택" />);
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
