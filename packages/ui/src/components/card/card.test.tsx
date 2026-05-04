import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';
import { checkA11y } from '../../test-utils/axe';

describe('Card', () => {
  it('renders default variant (no border)', () => {
    render(<Card data-testid="c">content</Card>);
    expect(screen.getByTestId('c').className).not.toMatch(/border-/);
  });

  it('outlined variant adds border', () => {
    render(
      <Card variant="outlined" data-testid="c">
        x
      </Card>,
    );
    expect(screen.getByTestId('c').className).toMatch(/border/);
  });

  it('elevated variant adds shadow', () => {
    render(
      <Card variant="elevated" data-testid="c">
        x
      </Card>,
    );
    expect(screen.getByTestId('c').className).toMatch(/shadow-sm/);
  });

  it('composes Header / Title / Description / Content / Footer', () => {
    render(
      <Card variant="outlined">
        <CardHeader>
          <CardTitle>제목</CardTitle>
          <CardDescription>설명</CardDescription>
        </CardHeader>
        <CardContent>본문</CardContent>
        <CardFooter>푸터</CardFooter>
      </Card>,
    );
    expect(screen.getByRole('heading', { level: 3, name: '제목' })).toBeInTheDocument();
    expect(screen.getByText('설명')).toBeInTheDocument();
    expect(screen.getByText('본문')).toBeInTheDocument();
    expect(screen.getByText('푸터')).toBeInTheDocument();
  });

  it('passes axe a11y scan', async () => {
    const { container } = render(
      <Card variant="outlined">
        <CardHeader>
          <CardTitle>제목</CardTitle>
          <CardDescription>설명</CardDescription>
        </CardHeader>
        <CardContent>본문</CardContent>
      </Card>,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
