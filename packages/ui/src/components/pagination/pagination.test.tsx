import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Pagination, getPageRange } from './pagination';
import { checkA11y } from '../../test-utils/axe';

describe('getPageRange', () => {
  it('returns full range when total <= 7', () => {
    expect(getPageRange(3, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getPageRange(1, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('compresses with right ellipsis when current is near start', () => {
    expect(getPageRange(2, 100)).toEqual([1, 2, 3, 'ellipsis-right', 100]);
  });

  it('compresses with left ellipsis when current is near end', () => {
    expect(getPageRange(99, 100)).toEqual([1, 'ellipsis-left', 98, 99, 100]);
  });

  it('compresses both sides when current is in middle', () => {
    expect(getPageRange(50, 100)).toEqual([1, 'ellipsis-left', 49, 50, 51, 'ellipsis-right', 100]);
  });

  it('handles 1000+ total pages efficiently', () => {
    const range = getPageRange(500, 1000, 1);
    // 1, ..., 499, 500, 501, ..., 1000 — 7 entries
    expect(range).toEqual([1, 'ellipsis-left', 499, 500, 501, 'ellipsis-right', 1000]);
  });
});

describe('Pagination', () => {
  it('renders nav with prev/next + page buttons', () => {
    render(<Pagination page={1} total={5} onPageChange={vi.fn()} />);
    expect(screen.getByRole('navigation', { name: '페이지' })).toBeInTheDocument();
    expect(screen.getByLabelText('이전 페이지')).toBeInTheDocument();
    expect(screen.getByLabelText('다음 페이지')).toBeInTheDocument();
  });

  it('current page has aria-current=page', () => {
    render(<Pagination page={3} total={10} onPageChange={vi.fn()} />);
    expect(screen.getByLabelText('3페이지로 이동')).toHaveAttribute('aria-current', 'page');
  });

  it('clicking a page calls onPageChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Pagination page={1} total={5} onPageChange={onChange} />);
    await user.click(screen.getByLabelText('3페이지로 이동'));
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('prev/next buttons disabled at boundaries', () => {
    const { rerender } = render(<Pagination page={1} total={5} onPageChange={vi.fn()} />);
    expect(screen.getByLabelText('이전 페이지')).toBeDisabled();
    expect(screen.getByLabelText('다음 페이지')).not.toBeDisabled();
    rerender(<Pagination page={5} total={5} onPageChange={vi.fn()} />);
    expect(screen.getByLabelText('다음 페이지')).toBeDisabled();
  });

  it('renders ellipsis for very large total (1000+)', () => {
    render(<Pagination page={500} total={1000} onPageChange={vi.fn()} />);
    // 화면에 페이지 버튼이 합리적인 수만 보여야 함 (1, …, 499, 500, 501, …, 1000)
    expect(screen.getByLabelText('1페이지로 이동')).toBeInTheDocument();
    expect(screen.getByLabelText('1000페이지로 이동')).toBeInTheDocument();
    expect(screen.getByLabelText('500페이지로 이동')).toHaveAttribute('aria-current', 'page');
    // 998페이지 등은 표시되지 않아야 함 (ellipsis로 압축됨)
    expect(screen.queryByLabelText('998페이지로 이동')).not.toBeInTheDocument();
  });

  it('passes axe a11y scan', async () => {
    const { container } = render(<Pagination page={1} total={10} onPageChange={vi.fn()} />);
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
