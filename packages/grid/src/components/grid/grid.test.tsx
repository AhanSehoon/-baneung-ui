import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it } from 'vitest';

import { Grid } from './grid';

import type { GridColumn, GridHandle } from './types';

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

  // ───────────────────────────────────────────────────────────────────────────
  // selection + ref API
  // ───────────────────────────────────────────────────────────────────────────

  it('renders selection checkboxes when selectable=true', () => {
    render(<Grid columns={columns} data={sampleData} selectable getRowId={(r) => r.id} />);
    // 헤더 체크박스 + 행 3개 체크박스 = 4개
    expect(screen.getAllByRole('checkbox').length).toBe(4);
    expect(screen.getByRole('checkbox', { name: '모두 선택' })).toBeInTheDocument();
  });

  it('toggle individual row selection', async () => {
    const user = userEvent.setup();
    render(<Grid columns={columns} data={sampleData} selectable getRowId={(r) => r.id} />);
    const row1Checkbox = screen.getByRole('checkbox', { name: '행 1 선택' });
    expect(row1Checkbox).not.toBeChecked();
    await user.click(row1Checkbox);
    expect(row1Checkbox).toBeChecked();
    await user.click(row1Checkbox);
    expect(row1Checkbox).not.toBeChecked();
  });

  it('header checkbox toggles all rows', async () => {
    const user = userEvent.setup();
    render(<Grid columns={columns} data={sampleData} selectable getRowId={(r) => r.id} />);

    const header = screen.getByRole('checkbox', { name: '모두 선택' });
    await user.click(header);

    // 모든 행 체크됨
    expect(screen.getByRole('checkbox', { name: '행 1 선택' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: '행 2 선택' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: '행 3 선택' })).toBeChecked();

    await user.click(header);
    expect(screen.getByRole('checkbox', { name: '행 1 선택' })).not.toBeChecked();
  });

  it('exposes imperative API via ref — deleteSelected + getDeletedData', async () => {
    const user = userEvent.setup();
    const ref = React.createRef<GridHandle<Row>>();
    render(
      <Grid ref={ref} columns={columns} data={sampleData} selectable getRowId={(r) => r.id} />,
    );

    // 1, 2번 선택 후 deleteSelected
    await user.click(screen.getByRole('checkbox', { name: '행 1 선택' }));
    await user.click(screen.getByRole('checkbox', { name: '행 2 선택' }));
    expect(ref.current?.getSelectedIds()).toEqual([1, 2]);

    // 외부에서 imperative API 호출 — React state flush를 위해 act로 감싼다.
    act(() => {
      ref.current?.deleteSelected();
    });

    // 화면에서 사라지고 deleted bucket으로 이동
    expect(screen.queryByText('사과')).not.toBeInTheDocument();
    expect(screen.queryByText('바나나')).not.toBeInTheDocument();
    expect(screen.getByText('체리')).toBeInTheDocument();

    const deleted = ref.current?.getDeletedData() ?? [];
    expect(deleted.map((r) => r.name).sort()).toEqual(['바나나', '사과']);

    // 삭제 후 selection은 비어있어야 함
    expect(ref.current?.getSelectedIds()).toEqual([]);
  });

  it('exposes imperative API — reset() restores original data', async () => {
    const user = userEvent.setup();
    const ref = React.createRef<GridHandle<Row>>();
    render(
      <Grid ref={ref} columns={columns} data={sampleData} selectable getRowId={(r) => r.id} />,
    );

    await user.click(screen.getByRole('checkbox', { name: '행 1 선택' }));
    act(() => {
      ref.current?.deleteSelected();
    });
    expect(screen.queryByText('사과')).not.toBeInTheDocument();

    act(() => {
      ref.current?.reset();
    });
    expect(screen.getByText('사과')).toBeInTheDocument();
    expect(ref.current?.getDeletedData()).toEqual([]);
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 인라인 편집
  // ───────────────────────────────────────────────────────────────────────────

  it('enters edit mode on double-click and commits with Enter', async () => {
    const user = userEvent.setup();
    const ref = React.createRef<GridHandle<Row>>();
    const editableColumns: GridColumn<Row>[] = [
      { id: 'name', header: '이름', accessor: 'name', editable: true },
      { id: 'price', header: '가격', accessor: 'price', align: 'right' },
    ];
    render(<Grid ref={ref} columns={editableColumns} data={sampleData} getRowId={(r) => r.id} />);

    // 더블클릭으로 편집 진입
    const cell = screen.getByText('사과');
    await user.dblClick(cell);
    const input = screen.getByRole('textbox', { name: '셀 편집' });
    expect(input).toBeInTheDocument();

    // 값 변경 후 Enter
    await user.clear(input);
    await user.type(input, '딸기{Enter}');

    // 편집 반영됨
    expect(screen.getByText('딸기')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();

    // getChangedData에 포함
    const changed = ref.current?.getChangedData() ?? [];
    expect(changed.length).toBe(1);
    expect(changed[0]?.name).toBe('딸기');
    expect(changed[0]?.id).toBe(1);
  });

  it('cancels edit on Escape', async () => {
    const user = userEvent.setup();
    const editableColumns: GridColumn<Row>[] = [
      { id: 'name', header: '이름', accessor: 'name', editable: true },
    ];
    render(<Grid columns={editableColumns} data={sampleData} getRowId={(r) => r.id} />);

    await user.dblClick(screen.getByText('사과'));
    const input = screen.getByRole('textbox', { name: '셀 편집' });
    await user.clear(input);
    await user.type(input, '딸기{Escape}');

    // 원래 값 유지
    expect(screen.getByText('사과')).toBeInTheDocument();
    expect(screen.queryByText('딸기')).not.toBeInTheDocument();
  });

  it('does not edit non-editable columns on double-click', async () => {
    const user = userEvent.setup();
    // editable: false (기본) → 더블클릭 무시
    render(<Grid columns={columns} data={sampleData} getRowId={(r) => r.id} />);
    await user.dblClick(screen.getByText('사과'));
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  // ───────────────────────────────────────────────────────────────────────────
  // sort / filter
  // ───────────────────────────────────────────────────────────────────────────

  it('sortable: 헤더 클릭으로 asc → desc → none 3-state', async () => {
    const user = userEvent.setup();
    const cols: GridColumn<Row>[] = [
      { id: 'price', header: '가격', accessor: 'price', sortable: true },
    ];
    const { container } = render(<Grid columns={cols} data={sampleData} getRowId={(r) => r.id} />);

    const header = screen.getByRole('columnheader', { name: /가격/ });
    // 1차 클릭 — asc (price 작은순)
    await user.click(header);
    expect(header).toHaveAttribute('aria-sort', 'ascending');
    let cells = container.querySelectorAll('tbody td');
    expect(cells[0]?.textContent).toBe('1000');

    // 2차 클릭 — desc (price 큰순)
    await user.click(header);
    expect(header).toHaveAttribute('aria-sort', 'descending');
    cells = container.querySelectorAll('tbody td');
    expect(cells[0]?.textContent).toBe('3000');

    // 3차 클릭 — 정렬 해제 (원래 순서)
    await user.click(header);
    expect(header).toHaveAttribute('aria-sort', 'none');
    cells = container.querySelectorAll('tbody td');
    expect(cells[0]?.textContent).toBe('1000');
  });

  it('filterable: 필터 input에 텍스트 입력하면 행이 좁혀짐', async () => {
    const user = userEvent.setup();
    const cols: GridColumn<Row>[] = [
      { id: 'name', header: '이름', accessor: 'name', filterable: true },
    ];
    render(<Grid columns={cols} data={sampleData} getRowId={(r) => r.id} />);

    const filterInput = screen.getByRole('textbox', { name: '이름 필터' });
    await user.type(filterInput, '바나');

    expect(screen.getByText('바나나')).toBeInTheDocument();
    expect(screen.queryByText('사과')).not.toBeInTheDocument();
    expect(screen.queryByText('체리')).not.toBeInTheDocument();
  });

  it('sort + filter 동시 적용', async () => {
    const user = userEvent.setup();
    const cols: GridColumn<Row>[] = [
      { id: 'name', header: '이름', accessor: 'name', filterable: true },
      { id: 'price', header: '가격', accessor: 'price', sortable: true },
    ];
    const moreData: Row[] = [
      { id: 1, name: '사과주스', price: 5000 },
      { id: 2, name: '사과파이', price: 3000 },
      { id: 3, name: '사과잼', price: 4000 },
      { id: 4, name: '바나나', price: 2000 },
    ];
    const { container } = render(<Grid columns={cols} data={moreData} getRowId={(r) => r.id} />);

    // 필터: '사과'
    await user.type(screen.getByRole('textbox', { name: '이름 필터' }), '사과');
    // 정렬: 가격 desc (2번 클릭)
    const priceHeader = screen.getByRole('columnheader', { name: /가격/ });
    await user.click(priceHeader);
    await user.click(priceHeader);

    // 사과주스(5000) > 사과잼(4000) > 사과파이(3000)
    const rows = container.querySelectorAll('tbody tr');
    expect(rows.length).toBe(3);
    expect(rows[0]?.textContent).toContain('사과주스');
    expect(rows[2]?.textContent).toContain('사과파이');
  });

  // ───────────────────────────────────────────────────────────────────────────
  // tree (계층) 모드
  // ───────────────────────────────────────────────────────────────────────────

  interface TreeNode {
    id: number;
    name: string;
    children?: TreeNode[];
  }

  const treeData: TreeNode[] = [
    {
      id: 1,
      name: 'Root',
      children: [
        { id: 2, name: 'Child A' },
        { id: 3, name: 'Child B', children: [{ id: 4, name: 'Grandchild' }] },
      ],
    },
    { id: 5, name: 'Sibling' },
  ];
  const treeColumns: GridColumn<TreeNode>[] = [{ id: 'name', header: '이름', accessor: 'name' }];

  it('tree: collapsed by default — only root nodes visible', () => {
    render(
      <Grid
        columns={treeColumns}
        data={treeData}
        tree
        getChildren={(r) => r.children}
        getRowId={(r) => r.id}
      />,
    );
    expect(screen.getByText('Root')).toBeInTheDocument();
    expect(screen.getByText('Sibling')).toBeInTheDocument();
    expect(screen.queryByText('Child A')).not.toBeInTheDocument();
    expect(screen.queryByText('Grandchild')).not.toBeInTheDocument();
  });

  it('tree: clicking caret expands the node', async () => {
    const user = userEvent.setup();
    render(
      <Grid
        columns={treeColumns}
        data={treeData}
        tree
        getChildren={(r) => r.children}
        getRowId={(r) => r.id}
      />,
    );
    // Root 노드의 펼치기 버튼 클릭
    const carets = screen.getAllByRole('button', { name: '펼치기' });
    await user.click(carets[0]!);
    expect(screen.getByText('Child A')).toBeInTheDocument();
    expect(screen.getByText('Child B')).toBeInTheDocument();
    // Child B는 자식이 있지만 아직 안 펼쳤음
    expect(screen.queryByText('Grandchild')).not.toBeInTheDocument();
  });

  it('tree: defaultExpandedIds="all" expands all nodes', () => {
    render(
      <Grid
        columns={treeColumns}
        data={treeData}
        tree
        getChildren={(r) => r.children}
        getRowId={(r) => r.id}
        defaultExpandedIds="all"
      />,
    );
    expect(screen.getByText('Root')).toBeInTheDocument();
    expect(screen.getByText('Child A')).toBeInTheDocument();
    expect(screen.getByText('Child B')).toBeInTheDocument();
    expect(screen.getByText('Grandchild')).toBeInTheDocument();
  });

  it('tree: defaultExpandedIds with id array expands specific nodes', () => {
    render(
      <Grid
        columns={treeColumns}
        data={treeData}
        tree
        getChildren={(r) => r.children}
        getRowId={(r) => r.id}
        defaultExpandedIds={[1]}
      />,
    );
    expect(screen.getByText('Child A')).toBeInTheDocument();
    // Child B는 펼쳐졌지만 그 자식(4)은 안 펼침
    expect(screen.queryByText('Grandchild')).not.toBeInTheDocument();
  });

  // ───────────────────────────────────────────────────────────────────────────
  // active cell highlight (셀 클릭)
  // ───────────────────────────────────────────────────────────────────────────

  it('marks clicked cell as active with aria-selected', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Grid columns={columns} data={sampleData} getRowId={(r) => r.id} />,
    );

    // 처음엔 active 셀 없음
    expect(container.querySelector('td[aria-selected="true"]')).toBeNull();

    // 셀 클릭 → 그 셀이 active
    await user.click(screen.getByText('사과'));
    const activeCells = container.querySelectorAll('td[aria-selected="true"]');
    expect(activeCells.length).toBe(1);
    expect(activeCells[0]?.textContent).toBe('사과');

    // 다른 셀 클릭 → active 이동
    await user.click(screen.getByText('2000'));
    const newActive = container.querySelectorAll('td[aria-selected="true"]');
    expect(newActive.length).toBe(1);
    expect(newActive[0]?.textContent).toBe('2000');
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 빌트인 editor: number / date / dropdown
  // ───────────────────────────────────────────────────────────────────────────

  it('editor=dropdown: select 즉시 commit', async () => {
    const user = userEvent.setup();
    const ref = React.createRef<GridHandle<Row>>();
    const cols: GridColumn<Row>[] = [
      {
        id: 'name',
        header: '이름',
        accessor: 'name',
        editable: true,
        editor: 'dropdown',
        options: [
          { value: '사과', label: '사과' },
          { value: '오렌지', label: '오렌지' },
          { value: '키위', label: '키위' },
        ],
      },
    ];
    render(<Grid ref={ref} columns={cols} data={sampleData} getRowId={(r) => r.id} />);

    await user.dblClick(screen.getByText('사과'));
    const select = screen.getByRole('combobox', { name: '셀 편집 (드롭다운)' });
    await user.selectOptions(select, '키위');

    expect(screen.getByText('키위')).toBeInTheDocument();
    const changed = ref.current?.getChangedData() ?? [];
    expect(changed[0]?.name).toBe('키위');
  });

  it('editor=number: input type=number 로 진입', async () => {
    const user = userEvent.setup();
    const cols: GridColumn<Row>[] = [
      { id: 'price', header: '가격', accessor: 'price', editable: true, editor: 'number' },
    ];
    render(<Grid columns={cols} data={sampleData} getRowId={(r) => r.id} />);

    await user.dblClick(screen.getByText('1000'));
    const input = screen.getByRole('spinbutton', { name: '셀 편집' });
    expect(input).toHaveAttribute('type', 'number');

    await user.clear(input);
    await user.type(input, '9999{Enter}');
    expect(screen.getByText('9999')).toBeInTheDocument();
  });

  it('renderer=progress: progressbar role + aria-valuenow', () => {
    const cols: GridColumn<Row>[] = [
      { id: 'price', header: '진행률', accessor: 'price', renderer: 'progress', max: 5000 },
    ];
    render(<Grid columns={cols} data={sampleData} getRowId={(r) => r.id} />);

    const bars = screen.getAllByRole('progressbar');
    expect(bars.length).toBe(3);
    expect(bars[0]).toHaveAttribute('aria-valuenow', '1000');
    expect(bars[0]).toHaveAttribute('aria-valuemax', '5000');
  });

  it('renderer=date + dateFormat: 포맷 적용', () => {
    interface DateRow {
      id: number;
      due: string;
    }
    const cols: GridColumn<DateRow>[] = [
      { id: 'due', header: '마감', accessor: 'due', renderer: 'date', dateFormat: 'YYYY/MM/DD' },
    ];
    const data: DateRow[] = [{ id: 1, due: '2024-02-15' }];
    render(<Grid columns={cols} data={data} getRowId={(r) => r.id} />);
    expect(screen.getByText('2024/02/15')).toBeInTheDocument();
  });

  it('getSavedData returns current edited values (excluding deleted)', async () => {
    const user = userEvent.setup();
    const ref = React.createRef<GridHandle<Row>>();
    const editableColumns: GridColumn<Row>[] = [
      { id: 'name', header: '이름', accessor: 'name', editable: true },
      { id: 'price', header: '가격', accessor: 'price' },
    ];
    render(
      <Grid
        ref={ref}
        columns={editableColumns}
        data={sampleData}
        selectable
        getRowId={(r) => r.id}
      />,
    );

    // 1번 편집
    await user.dblClick(screen.getByText('사과'));
    const input = screen.getByRole('textbox', { name: '셀 편집' });
    await user.clear(input);
    await user.type(input, '딸기{Enter}');

    // 2번 삭제
    await user.click(screen.getByRole('checkbox', { name: '행 2 선택' }));
    act(() => {
      ref.current?.deleteSelected();
    });

    const saved = ref.current?.getSavedData() ?? [];
    expect(saved.length).toBe(2);
    expect(saved.find((r) => r.id === 1)?.name).toBe('딸기');
    expect(saved.find((r) => r.id === 3)?.name).toBe('체리');

    // 삭제 데이터는 원본 스냅샷
    const deleted = ref.current?.getDeletedData() ?? [];
    expect(deleted.length).toBe(1);
    expect(deleted[0]?.name).toBe('바나나');
  });
});
