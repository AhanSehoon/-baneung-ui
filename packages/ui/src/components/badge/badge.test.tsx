import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Badge } from './badge';
import { checkA11y } from '../../test-utils/axe';

describe('Badge', () => {
  it('renders a span with default variant', () => {
    render(<Badge>NEW</Badge>);
    const el = screen.getByText('NEW');
    expect(el.tagName).toBe('SPAN');
    expect(el.className).toMatch(/bg-foreground/);
  });

  it('applies secondary variant classes', () => {
    render(<Badge variant="secondary">v2</Badge>);
    expect(screen.getByText('v2').className).toMatch(/bg-surface-strong/);
  });

  it('outline variant has border', () => {
    render(<Badge variant="outline">out</Badge>);
    expect(screen.getByText('out').className).toMatch(/border/);
  });

  it.each(['success', 'warning', 'danger'] as const)(
    'status variant %s applies tone classes',
    (v) => {
      render(<Badge variant={v}>{v}</Badge>);
      expect(screen.getByText(v).className).toMatch(new RegExp(`text-${v}`));
    },
  );

  it('passes axe a11y scan', async () => {
    const { container } = render(
      <p>
        새로운 기능 <Badge variant="success">출시</Badge>
      </p>,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
