import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Switch } from './switch';
import { checkA11y } from '../../test-utils/axe';

describe('Switch', () => {
  it('renders role="switch" with aria-checked=false by default', () => {
    render(<Switch aria-label="알림" />);
    const el = screen.getByRole('switch', { name: '알림' });
    expect(el).toHaveAttribute('aria-checked', 'false');
  });

  it('toggles on click (uncontrolled)', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch aria-label="t" onCheckedChange={onChange} />);
    const el = screen.getByRole('switch');
    await user.click(el);
    expect(el).toHaveAttribute('aria-checked', 'true');
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('toggles via Space and Enter', async () => {
    const user = userEvent.setup();
    render(<Switch aria-label="kb" />);
    const el = screen.getByRole('switch');
    el.focus();
    await user.keyboard(' ');
    expect(el).toHaveAttribute('aria-checked', 'true');
    await user.keyboard('{Enter}');
    expect(el).toHaveAttribute('aria-checked', 'false');
  });

  it('respects controlled `checked`', () => {
    const { rerender } = render(<Switch aria-label="c" checked={false} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
    rerender(<Switch aria-label="c" checked />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('passes axe a11y scan', async () => {
    const { container } = render(
      <label>
        <Switch /> 알림 받기
      </label>,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
