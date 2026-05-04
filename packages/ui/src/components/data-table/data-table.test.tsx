import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { DataTable, type ColumnDef } from './data-table';
import { checkA11y } from '../../test-utils/axe';

interface Row {
  id: string;
  name: string;
  age: number;
}

const columns: ColumnDef<Row, unknown>[] = [
  { accessorKey: 'name', header: '이름' },
  { accessorKey: 'age', header: '나이' },
];

const data: Row[] = [
  { id: '1', name: '홍길동', age: 30 },
  { id: '2', name: '김철수', age: 25 },
  { id: '3', name: '이영희', age: 28 },
];

describe('DataTable', () => {
  it('renders rows + columns', () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('홍길동')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  it('shows Empty when data is empty', () => {
    render(
      <DataTable columns={columns} data={[]} emptyTitle="없음" emptyDescription="추가하세요" />,
    );
    expect(screen.getByRole('heading', { name: '없음' })).toBeInTheDocument();
    expect(screen.getByText('추가하세요')).toBeInTheDocument();
  });

  it('clicking a sortable header sets aria-sort', async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={data} defaultSorting={[]} />);
    const ageHeader = screen.getByRole('columnheader', { name: /나이/ });
    expect(ageHeader).toHaveAttribute('aria-sort', 'none');
    await user.click(screen.getByRole('button', { name: /나이/ }));
    // tanstack table은 숫자형 컬럼의 첫 클릭을 descending으로 시작합니다
    expect(['ascending', 'descending']).toContain(ageHeader.getAttribute('aria-sort'));
  });

  it('renders Pagination when total pages > 1', () => {
    const many = Array.from({ length: 25 }, (_, i) => ({
      id: String(i),
      name: `사용자 ${i}`,
      age: 20 + i,
    }));
    render(<DataTable columns={columns} data={many} />);
    expect(screen.getByRole('navigation', { name: '페이지' })).toBeInTheDocument();
  });

  it('passes axe a11y scan', async () => {
    const { container } = render(<DataTable columns={columns} data={data} />);
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
