import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './button';
import { checkA11y } from '../../test-utils/axe';

describe('Button — rendering & variants', () => {
  it('renders <button type="button"> by default', () => {
    render(<Button>저장</Button>);
    const btn = screen.getByRole('button', { name: '저장' });
    expect(btn.tagName).toBe('BUTTON');
    expect(btn).toHaveAttribute('type', 'button');
  });

  it('applies variant + size classes', () => {
    render(
      <Button variant="destructive" size="lg">
        삭제
      </Button>,
    );
    const btn = screen.getByRole('button', { name: '삭제' });
    expect(btn.className).toMatch(/bg-danger/);
    expect(btn.className).toMatch(/h-12/);
  });

  it('asChild composes via Slot to render an <a>', () => {
    render(
      <Button asChild variant="outline">
        <a href="/x">링크</a>
      </Button>,
    );
    const link = screen.getByRole('link', { name: '링크' });
    expect(link.tagName).toBe('A');
    expect(link.className).toMatch(/border/);
  });
});

describe('Button — interaction', () => {
  it('fires onClick on mouse click', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>클릭</Button>);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('triggers click on Space and Enter (native <button> semantic)', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>키보드</Button>);

    const btn = screen.getByRole('button');
    btn.focus();
    expect(btn).toHaveFocus();

    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(1);

    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('loading=true sets disabled, aria-busy, and renders Spinner', () => {
    render(<Button loading>저장 중</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
    // Spinner는 role="status"의 일부 — 같은 트리에 존재해야 함
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('disabled prevents onClick', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        비활성
      </Button>,
    );
    await user.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe('Button — a11y', () => {
  it('passes axe scan across variants', async () => {
    const { container } = render(
      <div>
        <Button variant="primary">P</Button>
        <Button variant="secondary">S</Button>
        <Button variant="outline">O</Button>
        <Button variant="ghost">G</Button>
        <Button variant="destructive">D</Button>
      </div>,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
