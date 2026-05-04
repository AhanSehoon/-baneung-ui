import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Empty, EmptyActions, EmptyDescription, EmptyIcon, EmptyTitle } from './empty';
import { checkA11y } from '../../test-utils/axe';

describe('Empty', () => {
  it('composes title + description with semantic heading', () => {
    render(
      <Empty>
        <EmptyTitle>비어있음</EmptyTitle>
        <EmptyDescription>아직 데이터가 없습니다.</EmptyDescription>
      </Empty>,
    );
    expect(screen.getByRole('heading', { level: 3, name: '비어있음' })).toBeInTheDocument();
    expect(screen.getByText('아직 데이터가 없습니다.')).toBeInTheDocument();
  });

  it('renders icon container as aria-hidden', () => {
    render(
      <Empty>
        <EmptyIcon data-testid="i">
          <svg viewBox="0 0 24 24" />
        </EmptyIcon>
        <EmptyTitle>없음</EmptyTitle>
      </Empty>,
    );
    expect(screen.getByTestId('i')).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders actions slot', () => {
    render(
      <Empty>
        <EmptyTitle>비어있음</EmptyTitle>
        <EmptyActions>
          <button type="button">추가</button>
        </EmptyActions>
      </Empty>,
    );
    expect(screen.getByRole('button', { name: '추가' })).toBeInTheDocument();
  });

  it('passes axe a11y scan with full composition', async () => {
    const { container } = render(
      <Empty>
        <EmptyIcon>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
          </svg>
        </EmptyIcon>
        <EmptyTitle>주문 내역이 없습니다</EmptyTitle>
        <EmptyDescription>주문하신 후 여기서 내역을 확인하실 수 있습니다.</EmptyDescription>
        <EmptyActions>
          <button type="button">홈으로</button>
        </EmptyActions>
      </Empty>,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
