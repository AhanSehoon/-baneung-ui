import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { checkA11y } from '../../test-utils/axe';

describe('Avatar', () => {
  it('renders the Radix root', () => {
    render(
      <Avatar data-testid="a">
        <AvatarFallback>홍</AvatarFallback>
      </Avatar>,
    );
    expect(screen.getByTestId('a')).toBeInTheDocument();
  });

  it('shows fallback initially (image still loading in jsdom)', () => {
    render(
      <Avatar>
        <AvatarImage src="/me.jpg" alt="홍길동" />
        <AvatarFallback>홍</AvatarFallback>
      </Avatar>,
    );
    expect(screen.getByText('홍')).toBeInTheDocument();
  });

  it('forwards className to root', () => {
    render(
      <Avatar className="size-16" data-testid="a">
        <AvatarFallback>S</AvatarFallback>
      </Avatar>,
    );
    expect(screen.getByTestId('a').className).toMatch(/size-16/);
  });

  it('passes axe a11y scan', async () => {
    const { container } = render(
      <Avatar>
        <AvatarImage src="/me.jpg" alt="홍길동" />
        <AvatarFallback>홍</AvatarFallback>
      </Avatar>,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
