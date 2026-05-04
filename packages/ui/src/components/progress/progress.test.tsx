import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Progress } from './progress';
import { checkA11y } from '../../test-utils/axe';

describe('Progress', () => {
  it('renders role="progressbar" with aria-valuenow', () => {
    render(<Progress value={40} aria-label="업로드" />);
    const bar = screen.getByRole('progressbar', { name: '업로드' });
    expect(bar).toHaveAttribute('aria-valuenow', '40');
  });

  it('clamps value to 0~100', () => {
    const { rerender } = render(<Progress value={-10} aria-label="x" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    rerender(<Progress value={150} aria-label="x" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });

  it('indeterminate mode (no value) omits aria-valuenow', () => {
    render(<Progress aria-label="loading" />);
    const bar = screen.getByRole('progressbar', { name: 'loading' });
    expect(bar).not.toHaveAttribute('aria-valuenow');
  });

  it('size variant applies height class', () => {
    const { rerender, container } = render(<Progress value={50} size="sm" aria-label="x" />);
    expect(container.querySelector('[role="progressbar"]')!.className).toMatch(/h-1/);
    rerender(<Progress value={50} size="lg" aria-label="x" />);
    expect(container.querySelector('[role="progressbar"]')!.className).toMatch(/h-3/);
  });

  it('passes axe a11y scan', async () => {
    const { container } = render(<Progress value={70} aria-label="진행률" />);
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
