import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Checkbox } from './checkbox';
import { checkA11y } from '../../test-utils/axe';

describe('Checkbox', () => {
  it('renders unchecked by default', () => {
    render(<Checkbox aria-label="동의" />);
    const el = screen.getByRole('checkbox', { name: '동의' });
    expect(el).toHaveAttribute('aria-checked', 'false');
    expect(el).toHaveAttribute('data-state', 'unchecked');
  });

  it('toggles on click (uncontrolled)', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox aria-label="t" onCheckedChange={onChange} />);
    const el = screen.getByRole('checkbox');
    await user.click(el);
    expect(el).toHaveAttribute('aria-checked', 'true');
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('toggles via Space key', async () => {
    const user = userEvent.setup();
    render(<Checkbox aria-label="kb" />);
    const el = screen.getByRole('checkbox');
    el.focus();
    await user.keyboard(' ');
    expect(el).toHaveAttribute('aria-checked', 'true');
  });

  it('respects controlled `checked`', () => {
    const { rerender } = render(<Checkbox aria-label="c" checked={false} />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'false');
    rerender(<Checkbox aria-label="c" checked />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
  });

  it('renders indeterminate state', () => {
    render(<Checkbox aria-label="i" checked="indeterminate" />);
    const el = screen.getByRole('checkbox');
    expect(el).toHaveAttribute('aria-checked', 'mixed');
    expect(el).toHaveAttribute('data-state', 'indeterminate');
  });

  it('passes axe a11y scan', async () => {
    const { container } = render(
      <label>
        <Checkbox /> 약관에 동의합니다
      </label>,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
