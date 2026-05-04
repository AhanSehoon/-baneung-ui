import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { RadioGroup, RadioGroupItem } from './radio-group';
import { checkA11y } from '../../test-utils/axe';

describe('RadioGroup', () => {
  it('renders role="radiogroup" with role="radio" items', () => {
    render(
      <RadioGroup defaultValue="a" aria-label="opt">
        <RadioGroupItem value="a" />
        <RadioGroupItem value="b" />
      </RadioGroup>,
    );
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(2);
  });

  it('only one selected at a time', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <RadioGroup onValueChange={onChange} aria-label="opt">
        <RadioGroupItem value="a" aria-label="A" />
        <RadioGroupItem value="b" aria-label="B" />
      </RadioGroup>,
    );
    const a = screen.getByRole('radio', { name: 'A' });
    const b = screen.getByRole('radio', { name: 'B' });
    await user.click(a);
    expect(a).toHaveAttribute('data-state', 'checked');
    await user.click(b);
    expect(b).toHaveAttribute('data-state', 'checked');
    expect(a).toHaveAttribute('data-state', 'unchecked');
    expect(onChange).toHaveBeenLastCalledWith('b');
  });

  it('arrow keys navigate between items', async () => {
    const user = userEvent.setup();
    render(
      <RadioGroup defaultValue="a" aria-label="opt">
        <RadioGroupItem value="a" aria-label="A" />
        <RadioGroupItem value="b" aria-label="B" />
        <RadioGroupItem value="c" aria-label="C" />
      </RadioGroup>,
    );
    const a = screen.getByRole('radio', { name: 'A' });
    a.focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('radio', { name: 'B' })).toHaveFocus();
  });

  it('respects controlled `value`', () => {
    const { rerender } = render(
      <RadioGroup value="a" aria-label="c">
        <RadioGroupItem value="a" aria-label="A" />
        <RadioGroupItem value="b" aria-label="B" />
      </RadioGroup>,
    );
    expect(screen.getByRole('radio', { name: 'A' })).toHaveAttribute('data-state', 'checked');
    rerender(
      <RadioGroup value="b" aria-label="c">
        <RadioGroupItem value="a" aria-label="A" />
        <RadioGroupItem value="b" aria-label="B" />
      </RadioGroup>,
    );
    expect(screen.getByRole('radio', { name: 'B' })).toHaveAttribute('data-state', 'checked');
  });

  it('passes axe a11y scan', async () => {
    const { container } = render(
      <RadioGroup aria-label="플랜 선택" defaultValue="basic">
        <label>
          <RadioGroupItem value="basic" /> 기본
        </label>
        <label>
          <RadioGroupItem value="pro" /> 프로
        </label>
      </RadioGroup>,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
