import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Item } from './item';
import { checkA11y } from '../../test-utils/axe';

describe('Item', () => {
  it('renders <li> by default', () => {
    render(
      <ul>
        <Item>항목</Item>
      </ul>,
    );
    expect(screen.getByText('항목').closest('li')).not.toBeNull();
  });

  it('renders startSlot and endSlot', () => {
    render(
      <ul>
        <Item
          startSlot={<span data-testid="start">S</span>}
          endSlot={<span data-testid="end">E</span>}
        >
          본문
        </Item>
      </ul>,
    );
    expect(screen.getByTestId('start')).toBeInTheDocument();
    expect(screen.getByTestId('end')).toBeInTheDocument();
  });

  it('selected=true sets data-state and visual highlight', () => {
    render(
      <ul>
        <Item selected data-testid="i">
          선택됨
        </Item>
      </ul>,
    );
    const el = screen.getByTestId('i');
    expect(el).toHaveAttribute('data-state', 'selected');
    expect(el.className).toMatch(/bg-surface-strong/);
  });

  it('disabled=true sets data-disabled and dims', () => {
    render(
      <ul>
        <Item disabled data-testid="i">
          비활성
        </Item>
      </ul>,
    );
    const el = screen.getByTestId('i');
    expect(el).toHaveAttribute('data-disabled');
    expect(el.className).toMatch(/opacity-60/);
  });

  it('asChild composes via Slot to render <a> with single child', () => {
    render(
      <Item asChild>
        <a href="/x">링크 항목</a>
      </Item>,
    );
    const link = screen.getByRole('link', { name: '링크 항목' });
    expect(link.tagName).toBe('A');
  });

  it('passes axe a11y scan in a plain list', async () => {
    const { container } = render(
      <ul aria-label="목록">
        <Item>항목 1</Item>
        <Item>항목 2</Item>
      </ul>,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
