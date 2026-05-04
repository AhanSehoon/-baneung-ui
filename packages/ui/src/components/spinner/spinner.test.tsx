import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Spinner } from './spinner';
import { checkA11y } from '../../test-utils/axe';

describe('Spinner', () => {
  it('renders role="status" with default sr-only label', () => {
    render(<Spinner />);
    const status = screen.getByRole('status');
    expect(status).toBeInTheDocument();
    expect(status).toHaveTextContent('로딩 중');
  });

  it('respects custom label', () => {
    render(<Spinner label="Saving..." />);
    expect(screen.getByRole('status')).toHaveTextContent('Saving...');
  });

  it('size variant maps to className', () => {
    const { container, rerender } = render(<Spinner size="sm" />);
    expect(container.querySelector('svg')!.className.baseVal).toMatch(/size-4/);

    rerender(<Spinner size="lg" />);
    expect(container.querySelector('svg')!.className.baseVal).toMatch(/size-6/);
  });

  it('passes axe a11y scan', async () => {
    const { container } = render(<Spinner />);
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
