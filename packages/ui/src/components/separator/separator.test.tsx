import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Separator } from './separator';
import { checkA11y } from '../../test-utils/axe';

describe('Separator', () => {
  it('renders with default horizontal orientation (role=separator, aria-orientation omitted by ARIA spec default)', () => {
    render(<Separator data-testid="s" />);
    const el = screen.getByTestId('s');
    expect(el).toHaveAttribute('role', 'separator');
    // ARIA: horizontal은 separator role의 기본값이라 Radix가 속성을 생략
    expect(el).not.toHaveAttribute('aria-orientation');
    expect(el.className).toMatch(/h-px/);
    expect(el.className).toMatch(/w-full/);
  });

  it('respects vertical orientation', () => {
    render(<Separator orientation="vertical" data-testid="s" />);
    const el = screen.getByTestId('s');
    expect(el).toHaveAttribute('aria-orientation', 'vertical');
    expect(el.className).toMatch(/h-full/);
    expect(el.className).toMatch(/w-px/);
  });

  it('decorative=true sets role="none"', () => {
    render(<Separator decorative data-testid="s" />);
    const el = screen.getByTestId('s');
    expect(el).toHaveAttribute('role', 'none');
  });

  it('passes axe a11y scan', async () => {
    const { container } = render(<Separator />);
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
