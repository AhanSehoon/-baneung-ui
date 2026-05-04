import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Toggle } from './toggle';
import { checkA11y } from '../../test-utils/axe';

describe('Toggle', () => {
  it('renders with aria-pressed=false by default', () => {
    render(<Toggle aria-label="bold">B</Toggle>);
    const btn = screen.getByRole('button', { name: 'bold' });
    expect(btn).toHaveAttribute('aria-pressed', 'false');
    expect(btn).toHaveAttribute('data-state', 'off');
  });

  it('toggles aria-pressed on click (uncontrolled)', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Toggle aria-label="t" onPressedChange={onChange}>
        T
      </Toggle>,
    );
    const btn = screen.getByRole('button');
    await user.click(btn);
    expect(btn).toHaveAttribute('aria-pressed', 'true');
    expect(btn).toHaveAttribute('data-state', 'on');
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('toggles via Space/Enter', async () => {
    const user = userEvent.setup();
    render(<Toggle aria-label="kb">K</Toggle>);
    const btn = screen.getByRole('button');
    btn.focus();
    await user.keyboard(' ');
    expect(btn).toHaveAttribute('aria-pressed', 'true');
    await user.keyboard('{Enter}');
    expect(btn).toHaveAttribute('aria-pressed', 'false');
  });

  it('respects controlled `pressed` prop', () => {
    const { rerender } = render(
      <Toggle aria-label="c" pressed={false}>
        C
      </Toggle>,
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
    rerender(
      <Toggle aria-label="c" pressed>
        C
      </Toggle>,
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('passes axe a11y scan', async () => {
    const { container } = render(
      <Toggle aria-label="굵게" defaultPressed>
        B
      </Toggle>,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
