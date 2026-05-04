import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ToggleGroup, ToggleGroupItem } from './toggle-group';
import { checkA11y } from '../../test-utils/axe';

describe('ToggleGroup — single mode', () => {
  it('only one item can be selected at a time', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ToggleGroup type="single" aria-label="align" onValueChange={onChange}>
        <ToggleGroupItem value="left">L</ToggleGroupItem>
        <ToggleGroupItem value="center">C</ToggleGroupItem>
        <ToggleGroupItem value="right">R</ToggleGroupItem>
      </ToggleGroup>,
    );

    const left = screen.getByRole('radio', { name: 'L' });
    const center = screen.getByRole('radio', { name: 'C' });

    await user.click(left);
    expect(left).toHaveAttribute('data-state', 'on');
    expect(onChange).toHaveBeenLastCalledWith('left');

    await user.click(center);
    expect(center).toHaveAttribute('data-state', 'on');
    expect(left).toHaveAttribute('data-state', 'off');
    expect(onChange).toHaveBeenLastCalledWith('center');
  });
});

describe('ToggleGroup — multiple mode', () => {
  it('multiple items can be selected', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ToggleGroup type="multiple" aria-label="format" onValueChange={onChange}>
        <ToggleGroupItem value="bold">B</ToggleGroupItem>
        <ToggleGroupItem value="italic">I</ToggleGroupItem>
        <ToggleGroupItem value="under">U</ToggleGroupItem>
      </ToggleGroup>,
    );

    const bold = screen.getByRole('button', { name: 'B' });
    const italic = screen.getByRole('button', { name: 'I' });

    await user.click(bold);
    await user.click(italic);

    expect(bold).toHaveAttribute('data-state', 'on');
    expect(italic).toHaveAttribute('data-state', 'on');
    expect(onChange).toHaveBeenLastCalledWith(['bold', 'italic']);
  });
});

describe('ToggleGroup — keyboard navigation', () => {
  it('arrow keys move focus across items (single mode)', async () => {
    const user = userEvent.setup();
    render(
      <ToggleGroup type="single" aria-label="nav">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
        <ToggleGroupItem value="c">C</ToggleGroupItem>
      </ToggleGroup>,
    );

    const a = screen.getByRole('radio', { name: 'A' });
    const b = screen.getByRole('radio', { name: 'B' });
    a.focus();
    await user.keyboard('{ArrowRight}');
    expect(b).toHaveFocus();
  });
});

describe('ToggleGroup — a11y', () => {
  it('passes axe scan in both modes', async () => {
    const { container } = render(
      <div>
        <ToggleGroup type="single" aria-label="size">
          <ToggleGroupItem value="s">S</ToggleGroupItem>
          <ToggleGroupItem value="m">M</ToggleGroupItem>
          <ToggleGroupItem value="l">L</ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup type="multiple" aria-label="format">
          <ToggleGroupItem value="b">B</ToggleGroupItem>
          <ToggleGroupItem value="i">I</ToggleGroupItem>
        </ToggleGroup>
      </div>,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
