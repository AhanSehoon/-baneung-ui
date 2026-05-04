import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Direction } from './direction';
import { checkA11y } from '../../test-utils/axe';

describe('Direction', () => {
  it('provides RTL context to children', () => {
    render(
      <Direction dir="rtl">
        <div data-testid="c">콘텐츠</div>
      </Direction>,
    );
    expect(screen.getByTestId('c')).toBeInTheDocument();
  });

  it('provides LTR context (default)', () => {
    render(
      <Direction dir="ltr">
        <div data-testid="c">x</div>
      </Direction>,
    );
    expect(screen.getByTestId('c')).toBeInTheDocument();
  });

  it('passes axe a11y scan', async () => {
    const { container } = render(
      <Direction dir="rtl">
        <div>콘텐츠</div>
      </Direction>,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
