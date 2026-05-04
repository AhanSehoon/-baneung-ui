import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Code, Heading, Lead, Muted, Text } from './typography';
import { checkA11y } from '../../test-utils/axe';

describe('Heading', () => {
  it('renders semantic <h1> by default', () => {
    render(<Heading>Title</Heading>);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
  });

  it('respects level prop (h3)', () => {
    render(<Heading level={3}>Sub</Heading>);
    expect(screen.getByRole('heading', { level: 3 }).tagName).toBe('H3');
  });

  it('asChild composes via Slot', () => {
    render(
      <Heading asChild level={2}>
        <a href="#x">Link heading</a>
      </Heading>,
    );
    const link = screen.getByRole('link', { name: 'Link heading' });
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe('A');
  });

  it('passes axe a11y scan', async () => {
    const { container } = render(<Heading level={2}>접근성 헤딩</Heading>);
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});

describe('Text / Lead / Muted / Code', () => {
  it('Text renders <p> with default tone', () => {
    render(<Text>본문</Text>);
    expect(screen.getByText('본문').tagName).toBe('P');
  });

  it('Text variants (size + weight + tone) apply classes', () => {
    render(
      <Text size="lg" weight="bold" tone="muted" data-testid="t">
        강조
      </Text>,
    );
    const el = screen.getByTestId('t');
    expect(el.className).toMatch(/text-lg/);
    expect(el.className).toMatch(/font-bold/);
    expect(el.className).toMatch(/text-foreground-muted/);
  });

  it('Lead and Muted render <p>', () => {
    render(
      <>
        <Lead>도입부</Lead>
        <Muted>메타</Muted>
      </>,
    );
    expect(screen.getByText('도입부').tagName).toBe('P');
    expect(screen.getByText('메타').tagName).toBe('P');
  });

  it('Code renders <code>', () => {
    render(<Code>npm install</Code>);
    expect(screen.getByText('npm install').tagName).toBe('CODE');
  });

  it('passes axe a11y scan (composite)', async () => {
    const { container } = render(
      <article>
        <Heading level={2}>접근성</Heading>
        <Lead>도입부 텍스트</Lead>
        <Text>
          본문 단락. <Code>cn()</Code>은 유틸 함수입니다.
        </Text>
        <Muted>마지막 수정: 2026-04-29</Muted>
      </article>,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
