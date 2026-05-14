import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Grid } from './grid';

import type { GridColumn } from './types';

interface Row {
  id: number;
  name: string;
  price: number;
}

const columns: GridColumn<Row>[] = [
  { id: 'name', header: '이름', accessor: 'name' },
  { id: 'price', header: '가격', accessor: 'price', align: 'right' },
];

const sampleData: Row[] = [
  { id: 1, name: '사과', price: 1000 },
  { id: 2, name: '바나나', price: 2000 },
  { id: 3, name: '체리', price: 3000 },
];

describe('Grid', () => {
  it('renders columns and rows in non-virtualized mode', () => {
    render(<Grid columns={columns} data={sampleData} />);

    expect(screen.getByRole('columnheader', { name: '이름' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: '가격' })).toBeInTheDocument();
    expect(screen.getByText('사과')).toBeInTheDocument();
    expect(screen.getByText('바나나')).toBeInTheDocument();
    expect(screen.getByText('체리')).toBeInTheDocument();
  });

  it('applies custom renderer function', () => {
    const customColumns: GridColumn<Row>[] = [
      { id: 'name', header: '이름', accessor: 'name' },
      {
        id: 'price',
        header: '가격',
        accessor: 'price',
        renderer: (value) => `${(value as number).toLocaleString()}원`,
      },
    ];
    render(<Grid columns={customColumns} data={sampleData} />);

    // toLocaleString으로 콤마 + '원' 접미사 적용 검증
    expect(screen.getByText('1,000원')).toBeInTheDocument();
    expect(screen.getByText('2,000원')).toBeInTheDocument();
  });

  it('shows empty state when data is empty', () => {
    render(<Grid columns={columns} data={[]} emptyState="결과 없음" />);
    expect(screen.getByText('결과 없음')).toBeInTheDocument();
  });

  it('paginates with pageSize and navigates pages', async () => {
    const user = userEvent.setup();
    const data: Row[] = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `item-${i + 1}`,
      price: (i + 1) * 100,
    }));

    render(<Grid columns={columns} data={data} pageSize={10} />);

    // 첫 페이지에 1~10
    expect(screen.getByText('item-1')).toBeInTheDocument();
    expect(screen.getByText('item-10')).toBeInTheDocument();
    expect(screen.queryByText('item-11')).not.toBeInTheDocument();

    // 다음 페이지 버튼
    await user.click(screen.getByRole('button', { name: '다음 페이지' }));

    // 11~20 표시되고 1번은 사라짐
    expect(screen.getByText('item-11')).toBeInTheDocument();
    expect(screen.queryByText('item-1')).not.toBeInTheDocument();
  });

  it('hides pagination when showPagination=false', () => {
    const data: Row[] = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `item-${i + 1}`,
      price: (i + 1) * 100,
    }));

    render(<Grid columns={columns} data={data} pageSize={10} showPagination={false} />);

    expect(screen.queryByRole('navigation', { name: '페이지 이동' })).not.toBeInTheDocument();
    // 첫 페이지 데이터는 그대로 표시됨 (페이징 로직은 살아있음)
    expect(screen.getByText('item-1')).toBeInTheDocument();
  });

  it('supports controlled page mode', async () => {
    const user = userEvent.setup();
    const data: Row[] = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `item-${i + 1}`,
      price: (i + 1) * 100,
    }));

    let calledWith = -1;
    const handlePageChange = (next: number) => {
      calledWith = next;
    };

    render(
      <Grid columns={columns} data={data} pageSize={10} page={1} onPageChange={handlePageChange} />,
    );

    await user.click(screen.getByRole('button', { name: '다음 페이지' }));
    // controlled 모드: 부모에게만 통지, 내부 state는 안 바뀜
    expect(calledWith).toBe(2);
  });

  it('renders header sticky region (virtualized mode)', () => {
    const data: Row[] = Array.from({ length: 500 }, (_, i) => ({
      id: i + 1,
      name: `row-${i + 1}`,
      price: i * 10,
    }));

    render(<Grid columns={columns} data={data} virtualized height={200} rowHeight={32} />);

    // 헤더는 보임
    expect(screen.getByRole('columnheader', { name: '이름' })).toBeInTheDocument();

    // 가상화 컨테이너 region
    const region = screen.getByRole('region', { name: '데이터 그리드' });
    expect(region).toBeInTheDocument();

    // 보이는 행 일부만 렌더되었는지 (전체 500개가 다 렌더되면 가상화 실패)
    const tbodyRows = within(region).getAllByRole('row');
    // header + 가상화된 일부 행 (정확한 수는 환경에 따라 다르지만 500보다 훨씬 적어야 함)
    expect(tbodyRows.length).toBeLessThan(500);
  });

  it('uses getRowId for keying', () => {
    const data: Row[] = [
      { id: 100, name: 'A', price: 1 },
      { id: 200, name: 'B', price: 2 },
    ];
    const { container } = render(<Grid columns={columns} data={data} getRowId={(row) => row.id} />);

    // 단순 렌더 성공 검증 — key warning이 없으면 통과
    expect(container.querySelectorAll('tbody tr').length).toBe(2);
  });
});
