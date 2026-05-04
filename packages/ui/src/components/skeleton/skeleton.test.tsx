import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Skeleton } from './skeleton';
import { checkA11y } from '../../test-utils/axe';

describe('Skeleton', () => {
  it('renders a div with aria-hidden', () => {
    render(<Skeleton data-testid="sk" />);
    const el = screen.getByTestId('sk');
    expect(el).toHaveAttribute('aria-hidden', 'true');
  });

  it('forwards className', () => {
    render(<Skeleton data-testid="sk" className="h-8 w-32" />);
    expect(screen.getByTestId('sk').className).toMatch(/h-8/);
    expect(screen.getByTestId('sk').className).toMatch(/w-32/);
  });

  it('passes axe a11y scan inside an aria-busy container', async () => {
    const { container } = render(
      <div aria-busy="true" aria-live="polite">
        <Skeleton className="h-4 w-48" />
      </div>,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
