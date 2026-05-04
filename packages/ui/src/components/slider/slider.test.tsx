import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Slider } from './slider';
import { checkA11y } from '../../test-utils/axe';

describe('Slider — single', () => {
  it('renders one thumb with role="slider" and current value', () => {
    render(<Slider defaultValue={[40]} aria-label="볼륨" />);
    const thumb = screen.getByRole('slider', { name: '볼륨' });
    expect(thumb).toHaveAttribute('aria-valuenow', '40');
  });

  it('arrow keys change value by step', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Slider
        defaultValue={[10]}
        min={0}
        max={100}
        step={5}
        aria-label="vol"
        onValueChange={onChange}
      />,
    );
    const thumb = screen.getByRole('slider');
    thumb.focus();
    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenLastCalledWith([15]);
    await user.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(onChange).toHaveBeenLastCalledWith([5]);
  });

  it('Home/End jump to min/max', async () => {
    const user = userEvent.setup();
    render(<Slider defaultValue={[50]} min={0} max={100} aria-label="vol" />);
    const thumb = screen.getByRole('slider');
    thumb.focus();
    await user.keyboard('{Home}');
    expect(thumb).toHaveAttribute('aria-valuenow', '0');
    await user.keyboard('{End}');
    expect(thumb).toHaveAttribute('aria-valuenow', '100');
  });
});

describe('Slider — range (two thumbs)', () => {
  it('renders two thumbs with respective values', () => {
    render(<Slider defaultValue={[20, 80]} aria-label="범위" />);
    const thumbs = screen.getAllByRole('slider');
    expect(thumbs).toHaveLength(2);
    expect(thumbs[0]).toHaveAttribute('aria-valuenow', '20');
    expect(thumbs[1]).toHaveAttribute('aria-valuenow', '80');
  });
});

describe('Slider — a11y', () => {
  it('passes axe scan with aria-label', async () => {
    const { container } = render(
      <Slider defaultValue={[25]} min={0} max={100} aria-label="볼륨" />,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
