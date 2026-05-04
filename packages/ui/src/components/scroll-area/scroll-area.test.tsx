import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ScrollArea } from './scroll-area';
import { checkA11y } from '../../test-utils/axe';

describe('ScrollArea', () => {
  it('renders children inside viewport', () => {
    render(
      <ScrollArea className="h-32 w-32" data-testid="sa">
        <div>스크롤 콘텐츠</div>
      </ScrollArea>,
    );
    expect(screen.getByTestId('sa')).toBeInTheDocument();
    expect(screen.getByText('스크롤 콘텐츠')).toBeInTheDocument();
  });

  it('forwards className to root', () => {
    render(
      <ScrollArea className="h-40" data-testid="sa">
        <div>x</div>
      </ScrollArea>,
    );
    expect(screen.getByTestId('sa').className).toMatch(/h-40/);
  });

  it('passes axe a11y scan', async () => {
    const { container } = render(
      <ScrollArea className="h-32 w-32">
        <div>본문 1</div>
        <div>본문 2</div>
      </ScrollArea>,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
