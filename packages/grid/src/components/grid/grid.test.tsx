import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

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

  it('filterable: funnel 버튼 클릭으로 popover 열림 — 체크 해제 + 확인으로 행 제외', async () => {
    const user = userEvent.setup();
    const cols: GridColumn<Row>[] = [
      { id: 'name', header: '이름', accessor: 'name', filterable: true },
    ];
    const { container } = render(<Grid columns={cols} data={sampleData} getRowId={(r) => r.id} />);
    const tbody = container.querySelector('tbody')!;

    // popover 열기
    await user.click(screen.getByRole('button', { name: '이름 필터' }));
    expect(screen.getByRole('dialog', { name: '컬럼 필터' })).toBeInTheDocument();

    // '사과' 체크 해제 + 확인 → '사과' 행 사라짐 (tbody scope로 검사)
    const appleCheckbox = screen.getByRole('checkbox', { name: '사과' });
    expect(appleCheckbox).toBeChecked();
    await user.click(appleCheckbox);
    await user.click(screen.getByRole('button', { name: '확인' }));

    expect(within(tbody).queryByText('사과')).not.toBeInTheDocument();
    expect(within(tbody).getByText('바나나')).toBeInTheDocument();
    expect(within(tbody).getByText('체리')).toBeInTheDocument();
  });

  it('filterable: 취소 누르면 변경 폐기', async () => {
    const user = userEvent.setup();
    const cols: GridColumn<Row>[] = [
      { id: 'name', header: '이름', accessor: 'name', filterable: true },
    ];
    const { container } = render(<Grid columns={cols} data={sampleData} getRowId={(r) => r.id} />);
    const tbody = container.querySelector('tbody')!;

    await user.click(screen.getByRole('button', { name: '이름 필터' }));
    await user.click(screen.getByRole('checkbox', { name: '사과' }));
    await user.click(screen.getByRole('button', { name: '취소' }));

    // 취소 → 사과 그대로 표시 (tbody scope)
    expect(within(tbody).getByText('사과')).toBeInTheDocument();
  });

  it('filterable: 필터 초기화 — draft를 비움', async () => {
    const user = userEvent.setup();
    const cols: GridColumn<Row>[] = [
      { id: 'name', header: '이름', accessor: 'name', filterable: true },
    ];
    const { container } = render(<Grid columns={cols} data={sampleData} getRowId={(r) => r.id} />);
    const tbody = container.querySelector('tbody')!;

    await user.click(screen.getByRole('button', { name: '이름 필터' }));
    await user.click(screen.getByRole('checkbox', { name: '사과' }));
    await user.click(screen.getByRole('button', { name: '확인' }));
    expect(within(tbody).queryByText('사과')).not.toBeInTheDocument();

    // 다시 열어 초기화 → 모두 표시
    await user.click(screen.getByRole('button', { name: '이름 필터' }));
    await user.click(screen.getByRole('button', { name: /필터 초기화/ }));
    await user.click(screen.getByRole('button', { name: '확인' }));
    expect(within(tbody).getByText('사과')).toBeInTheDocument();
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

    // 필터: 바나나 해제 → 사과 계열 3개만 남음
    await user.click(screen.getByRole('button', { name: '이름 필터' }));
    await user.click(screen.getByRole('checkbox', { name: '바나나' }));
    await user.click(screen.getByRole('button', { name: '확인' }));

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

  // ───────────────────────────────────────────────────────────────────────────
  // addRow / removeSelectedRows / multi-cell selection / Delete 키
  // ───────────────────────────────────────────────────────────────────────────

  it('addRow: first / last 위치에 행 추가 (active 셀 없어도 동작)', async () => {
    const ref = React.createRef<GridHandle<Row>>();
    render(<Grid ref={ref} columns={columns} data={sampleData} getRowId={(r) => r.id} />);

    act(() => {
      ref.current?.addRow({ id: 99, name: '신규-맨앞', price: 0 }, 'first');
      ref.current?.addRow({ id: 100, name: '신규-맨끝', price: 0 }, 'last');
    });

    const saved = ref.current?.getSavedData() ?? [];
    expect(saved[0]?.name).toBe('신규-맨앞');
    expect(saved[saved.length - 1]?.name).toBe('신규-맨끝');
    expect(saved.length).toBe(5); // 3 + 2
  });

  it('addRow: above-active / below-active', async () => {
    const user = userEvent.setup();
    const ref = React.createRef<GridHandle<Row>>();
    render(<Grid ref={ref} columns={columns} data={sampleData} getRowId={(r) => r.id} />);

    // '바나나' 셀을 클릭 → 그 행이 active
    await user.click(screen.getByText('바나나'));

    act(() => {
      ref.current?.addRow({ id: 50, name: '바나나-위', price: 0 }, 'above-active');
      ref.current?.addRow({ id: 51, name: '바나나-아래', price: 0 }, 'below-active');
    });

    const saved = ref.current?.getSavedData() ?? [];
    const names = saved.map((r) => r.name);
    // 순서: 사과, 바나나-위, 바나나, 바나나-아래, 체리
    expect(names).toEqual(['사과', '바나나-위', '바나나', '바나나-아래', '체리']);
  });

  it('cellSelection="none": 셀 클릭해도 activeCell 안 됨', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Grid columns={columns} data={sampleData} cellSelection="none" getRowId={(r) => r.id} />,
    );
    await user.click(screen.getByText('사과'));
    // outline 없음 — aria-selected가 적용된 td가 없어야 함
    expect(container.querySelector('td[aria-selected="true"]')).toBeNull();
  });

  it('removeSelectedRows: active 셀이 속한 행 삭제', async () => {
    const user = userEvent.setup();
    const ref = React.createRef<GridHandle<Row>>();
    render(<Grid ref={ref} columns={columns} data={sampleData} getRowId={(r) => r.id} />);

    await user.click(screen.getByText('바나나'));
    // 클릭으로 active cell 설정됨을 확인
    expect(ref.current?.getSavedData()).toHaveLength(3);

    await act(async () => {
      ref.current?.removeSelectedRows();
    });

    await waitFor(() => {
      expect(screen.queryByText('바나나')).not.toBeInTheDocument();
    });
    expect(screen.getByText('사과')).toBeInTheDocument();
    const deleted = ref.current?.getDeletedData() ?? [];
    expect(deleted[0]?.name).toBe('바나나');
  });

  it('exportCsv: ref API로 호출 시 Blob URL을 통해 anchor click 발생', async () => {
    // Spy URL.createObjectURL + anchor click — jsdom에는 둘 다 기본 구현 없음
    const createObjURL = vi.fn(() => 'blob:mock');
    const revokeObjURL = vi.fn();
    const origCreate = URL.createObjectURL;
    const origRevoke = URL.revokeObjectURL;
    URL.createObjectURL = createObjURL as unknown as typeof URL.createObjectURL;
    URL.revokeObjectURL = revokeObjURL as unknown as typeof URL.revokeObjectURL;
    const clickSpy = vi.fn();
    const origAppend = document.body.appendChild.bind(document.body);
    // anchor 생성 가로채서 click 호출 감지
    const origCreateElement = document.createElement.bind(document);
    document.createElement = (tagName: string) => {
      const el = origCreateElement(tagName);
      if (tagName === 'a') {
        Object.defineProperty(el, 'click', { value: clickSpy, configurable: true });
      }
      return el;
    };

    try {
      const ref = React.createRef<GridHandle<Row>>();
      render(<Grid ref={ref} columns={columns} data={sampleData} getRowId={(r) => r.id} />);

      ref.current?.exportCsv('test.csv');

      expect(createObjURL).toHaveBeenCalledTimes(1);
      expect(clickSpy).toHaveBeenCalledTimes(1);
      expect(revokeObjURL).toHaveBeenCalledTimes(1);
    } finally {
      URL.createObjectURL = origCreate;
      URL.revokeObjectURL = origRevoke;
      document.createElement = origCreateElement;
      document.body.appendChild = origAppend;
    }
  });

  it('clearSelectedCells: 선택 셀 값을 빈 문자열로', async () => {
    const user = userEvent.setup();
    const ref = React.createRef<GridHandle<Row>>();
    const editableColumns: GridColumn<Row>[] = [
      { id: 'name', header: '이름', accessor: 'name', editable: true },
    ];
    render(<Grid ref={ref} columns={editableColumns} data={sampleData} getRowId={(r) => r.id} />);

    await user.click(screen.getByText('사과'));
    await act(async () => {
      ref.current?.clearSelectedCells();
    });

    await waitFor(() => {
      const changed = ref.current?.getChangedData() ?? [];
      expect(changed).toHaveLength(1);
    });
    const changed = ref.current?.getChangedData() ?? [];
    expect(changed[0]?.id).toBe(1);
    expect(changed[0]?.name).toBe('');
  });

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

  it('autoSize=true: outer는 h-full w-full, scroll은 flex-1 min-h-0', () => {
    const { container } = render(<Grid autoSize columns={columns} data={sampleData} />);
    // outer container
    const outer = container.firstElementChild as HTMLElement;
    expect(outer.className).toMatch(/h-full/);
    expect(outer.className).toMatch(/w-full/);
    // scroll container (role=region)
    const scroll = screen.getByRole('region', { name: '데이터 그리드' });
    expect(scroll.className).toMatch(/flex-1/);
    expect(scroll.className).toMatch(/min-h-0/);
    // height/maxHeight style은 적용되지 않음 (부모 컨테이너에 맡김)
    expect(scroll.style.height).toBe('');
    expect(scroll.style.maxHeight).toBe('');
  });

  it('autoSize=false (기본): 기존 height/maxHeight 동작 유지', () => {
    render(<Grid columns={columns} data={sampleData} height={500} />);
    const scroll = screen.getByRole('region', { name: '데이터 그리드' });
    expect(scroll.style.maxHeight).toBe('500px');
    // flex-1 / min-h-0 미적용
    expect(scroll.className).not.toMatch(/flex-1/);
  });

  it('exportXlsx: ref API 호출 시 Blob URL을 통해 anchor click 발생', async () => {
    const ref = React.createRef<GridHandle<Row>>();
    render(<Grid ref={ref} columns={columns} data={sampleData} />);

    // exceljs는 무거우므로 download spy로 트리거 검증만 (실제 Excel 파싱 X)
    const createObjectURL = vi.fn().mockReturnValue('blob:mock-url');
    const revokeObjectURL = vi.fn();
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      writable: true,
      value: createObjectURL,
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      writable: true,
      value: revokeObjectURL,
    });
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => undefined);

    await ref.current?.exportXlsx({ filename: 'test.xlsx' });

    expect(createObjectURL).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  it('clipboard=true + Ctrl+C: 선택된 셀이 TSV로 navigator.clipboard에 복사', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText, readText: vi.fn().mockResolvedValue('') },
    });

    render(<Grid columns={columns} data={sampleData} clipboard cellSelection="single" />);

    // 첫 행 이름 셀 클릭 → active 상태
    const cell = screen.getByText('사과').closest('td')!;
    await user.click(cell);

    // 키 입력 — fireEvent로 컨테이너에 직접 keydown 발송
    const container = cell.closest('[tabindex="0"]') as HTMLElement;
    fireEvent.keyDown(container, { key: 'c', ctrlKey: true });

    await waitFor(() => {
      expect(writeText).toHaveBeenCalled();
    });
    // 단일 셀 복사 → '사과'만 TSV에
    expect(writeText.mock.calls[0]?.[0]).toBe('사과');
  });

  it('clipboard=true + Ctrl+V: TSV를 active 셀부터 행/열로 분산해 입력', async () => {
    const user = userEvent.setup();
    const ref = React.createRef<GridHandle<Row>>();
    // Excel에서 복사한 듯한 2x2 TSV (이름, 가격)
    const readText = vi.fn().mockResolvedValue('딸기\t1500\n포도\t2500');
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined), readText },
    });

    render(
      <Grid
        ref={ref}
        columns={columns}
        data={sampleData}
        clipboard
        cellSelection="single"
        getRowId={(r) => r.id}
      />,
    );

    // 첫 행 이름 셀 클릭 → active 시작 위치
    const cell = screen.getByText('사과').closest('td')!;
    await user.click(cell);
    const container = cell.closest('[tabindex="0"]') as HTMLElement;
    fireEvent.keyDown(container, { key: 'v', ctrlKey: true });

    // editCell이 비동기 호출되므로 잠시 대기
    await waitFor(() => {
      const saved = ref.current?.getSavedData() ?? [];
      const r1 = saved.find((r) => r.id === 1);
      const r2 = saved.find((r) => r.id === 2);
      expect(r1?.name).toBe('딸기');
      expect(r2?.name).toBe('포도');
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // quickFilter / multi-column sort / column resize
  // ───────────────────────────────────────────────────────────────────────────

  it('quickFilter: 모든 컬럼에서 부분 일치(case-insensitive) 검색', () => {
    const data: Row[] = [
      { id: 1, name: 'Apple', price: 1000 },
      { id: 2, name: 'Banana', price: 2500 },
      { id: 3, name: 'Apricot', price: 1500 },
    ];
    const { rerender } = render(<Grid columns={columns} data={data} quickFilter="ap" />);
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Apricot')).toBeInTheDocument();
    expect(screen.queryByText('Banana')).not.toBeInTheDocument();
    // 숫자 컬럼도 검색됨 — '2500' → Banana만 매치
    rerender(<Grid columns={columns} data={data} quickFilter="2500" />);
    expect(screen.queryByText('Apple')).not.toBeInTheDocument();
    expect(screen.getByText('Banana')).toBeInTheDocument();
  });

  it('quickFilter 빈 문자열은 필터 없음', () => {
    render(<Grid columns={columns} data={sampleData} quickFilter="" />);
    expect(screen.getByText('사과')).toBeInTheDocument();
    expect(screen.getByText('바나나')).toBeInTheDocument();
    expect(screen.getByText('체리')).toBeInTheDocument();
  });

  it('다중 컬럼 정렬: Shift+클릭으로 2차 정렬 추가, 순서 번호 표시', async () => {
    const user = userEvent.setup();
    const data: Row[] = [
      { id: 1, name: 'B', price: 100 },
      { id: 2, name: 'A', price: 200 },
      { id: 3, name: 'A', price: 100 },
      { id: 4, name: 'B', price: 200 },
    ];
    const sortableCols: GridColumn<Row>[] = [
      { id: 'name', header: '이름', accessor: 'name', sortable: true },
      { id: 'price', header: '가격', accessor: 'price', sortable: true },
    ];
    render(<Grid columns={sortableCols} data={data} getRowId={(r) => r.id} />);

    // 1차: name asc
    await user.click(screen.getByRole('columnheader', { name: /이름/ }));
    // 2차: Shift+price → multi-sort 추가
    await user.keyboard('{Shift>}');
    await user.click(screen.getByRole('columnheader', { name: /가격/ }));
    await user.keyboard('{/Shift}');

    // name asc, 같은 name 안에서 price asc
    const allRows = document.querySelectorAll('tbody tr');
    const order = Array.from(allRows).map((r) => {
      const tds = r.querySelectorAll('td');
      return `${tds[0]?.textContent}-${tds[1]?.textContent}`;
    });
    expect(order).toEqual(['A-100', 'A-200', 'B-100', 'B-200']);
  });

  it('다중 컬럼 정렬: 일반 클릭(Shift 없음)은 단일 정렬로 초기화', async () => {
    const user = userEvent.setup();
    const sortableCols: GridColumn<Row>[] = [
      { id: 'name', header: '이름', accessor: 'name', sortable: true },
      { id: 'price', header: '가격', accessor: 'price', sortable: true },
    ];
    render(<Grid columns={sortableCols} data={sampleData} getRowId={(r) => r.id} />);

    // Shift+name → asc, Shift+price 추가 → 2개 정렬
    await user.click(screen.getByRole('columnheader', { name: /이름/ }));
    await user.keyboard('{Shift>}');
    await user.click(screen.getByRole('columnheader', { name: /가격/ }));
    await user.keyboard('{/Shift}');
    // 일반 클릭 → 단일 정렬로 리셋 (sortStates 길이 1)
    await user.click(screen.getByRole('columnheader', { name: /이름/ }));
    // 데이터 정렬은 name 기준으로만 — 바나나가 ㅂ < ㅅ < ㅊ로 '바나나' 가 첫 행이 됨
    const allRows = document.querySelectorAll('tbody tr');
    const firstName = allRows[0]?.querySelectorAll('td')[0]?.textContent;
    expect(firstName).toBe('바나나');
  });

  it('컬럼 리사이즈: resizable=true 시 헤더에 separator 핸들 렌더', () => {
    const { container } = render(<Grid columns={columns} data={sampleData} resizable />);
    const handles = container.querySelectorAll('[role="separator"][aria-orientation="vertical"]');
    expect(handles.length).toBe(2);
  });

  it('컬럼 리사이즈: column.resizable=false인 컬럼은 핸들 제외', () => {
    const partialCols: GridColumn<Row>[] = [
      { id: 'name', header: '이름', accessor: 'name' },
      { id: 'price', header: '가격', accessor: 'price', resizable: false },
    ];
    const { container } = render(<Grid columns={partialCols} data={sampleData} resizable />);
    const handles = container.querySelectorAll('[role="separator"][aria-orientation="vertical"]');
    expect(handles.length).toBe(1);
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 컬럼 표시/숨김 + Pin + 푸터 + 조건부 스타일
  // ───────────────────────────────────────────────────────────────────────────

  it('컬럼 표시/숨김: column.hidden=true는 초기 렌더에서 제외', () => {
    const cols: GridColumn<Row>[] = [
      { id: 'name', header: '이름', accessor: 'name' },
      { id: 'price', header: '가격', accessor: 'price', hidden: true },
    ];
    render(<Grid columns={cols} data={sampleData} />);
    expect(screen.getByRole('columnheader', { name: '이름' })).toBeInTheDocument();
    expect(screen.queryByRole('columnheader', { name: '가격' })).not.toBeInTheDocument();
    // 데이터 셀에서도 가격 값 없음
    expect(screen.queryByText('1000')).not.toBeInTheDocument();
  });

  it('컬럼 표시/숨김: ref API로 토글 가능', () => {
    const ref = React.createRef<GridHandle<Row>>();
    render(<Grid ref={ref} columns={columns} data={sampleData} />);
    expect(screen.getByRole('columnheader', { name: '가격' })).toBeInTheDocument();
    act(() => {
      ref.current?.toggleColumnVisibility('price');
    });
    expect(screen.queryByRole('columnheader', { name: '가격' })).not.toBeInTheDocument();
    expect(ref.current?.getColumnVisibility().price).toBe(false);
  });

  it('컬럼 표시/숨김: showColumnMenu=true 시 ⚙️ 버튼 표시', async () => {
    const user = userEvent.setup();
    render(<Grid columns={columns} data={sampleData} showColumnMenu />);
    const btn = screen.getByRole('button', { name: '컬럼 표시 메뉴' });
    expect(btn).toBeInTheDocument();
    // 클릭 시 popover 표시
    await user.click(btn);
    expect(screen.getByRole('dialog', { name: '컬럼 표시 설정' })).toBeInTheDocument();
  });

  it('Pin: column.pin="left" 시 sticky 위치 + 컬럼 순서 재배치', () => {
    const cols: GridColumn<Row>[] = [
      { id: 'name', header: '이름', accessor: 'name' },
      { id: 'price', header: '가격', accessor: 'price', pin: 'left', width: 100 },
    ];
    render(<Grid columns={cols} data={sampleData} />);
    const headers = screen.getAllByRole('columnheader');
    // 가격이 좌측 pin이므로 첫 번째 헤더
    expect(headers[0]?.textContent).toContain('가격');
    expect(headers[1]?.textContent).toContain('이름');
    // sticky 스타일
    expect(headers[0]?.getAttribute('style')).toMatch(/position:\s*sticky/);
    expect(headers[0]?.getAttribute('style')).toMatch(/left:\s*0px/);
  });

  it('Pin: column.pin="right" 시 우측에 배치 + position sticky', () => {
    const cols: GridColumn<Row>[] = [
      { id: 'name', header: '이름', accessor: 'name', pin: 'right', width: 80 },
      { id: 'price', header: '가격', accessor: 'price' },
    ];
    render(<Grid columns={cols} data={sampleData} />);
    const headers = screen.getAllByRole('columnheader');
    // 이름이 우측 pin → 마지막 헤더
    expect(headers[0]?.textContent).toContain('가격');
    expect(headers[1]?.textContent).toContain('이름');
    expect(headers[1]?.getAttribute('style')).toMatch(/right:\s*0px/);
  });

  it('집계 푸터: showFooter=true + aggregate=sum 적용 시 합계 표시', () => {
    const cols: GridColumn<Row>[] = [
      { id: 'name', header: '이름', accessor: 'name', aggregate: 'count' },
      { id: 'price', header: '가격', accessor: 'price', aggregate: 'sum' },
    ];
    render(<Grid columns={cols} data={sampleData} showFooter />);
    // sampleData: 사과(1000) + 바나나(2000) + 체리(3000) = 6000
    expect(screen.getByText('6,000')).toBeInTheDocument();
    // count = 3
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('집계 푸터: 함수형 aggregate는 ReactNode 그대로 표시', () => {
    const cols: GridColumn<Row>[] = [
      { id: 'name', header: '이름', accessor: 'name' },
      {
        id: 'price',
        header: '가격',
        accessor: 'price',
        aggregate: (rows: Row[]) => `최대 ${Math.max(...rows.map((r) => r.price))}원`,
      },
    ];
    render(<Grid columns={cols} data={sampleData} showFooter />);
    expect(screen.getByText('최대 3000원')).toBeInTheDocument();
  });

  it('조건부 셀 스타일: cellClassName + cellStyle 적용', () => {
    const cols: GridColumn<Row>[] = [
      { id: 'name', header: '이름', accessor: 'name' },
      {
        id: 'price',
        header: '가격',
        accessor: 'price',
        cellClassName: (v) => ((v as number) > 1500 ? 'high-price-cell' : undefined),
        cellStyle: (v) => ((v as number) > 1500 ? { color: 'red' } : undefined),
      },
    ];
    const { container } = render(<Grid columns={cols} data={sampleData} />);
    // 2000, 3000은 high-price-cell + red, 1000은 아님
    const highCells = container.querySelectorAll('.high-price-cell');
    expect(highCells.length).toBe(2);
    expect((highCells[0] as HTMLElement).style.color).toBe('red');
  });

  it('컬럼 리사이즈: mousedown→move→up 시 onColumnResize 콜백 호출', () => {
    const onResize = vi.fn();
    const { container } = render(
      <Grid columns={columns} data={sampleData} resizable onColumnResize={onResize} />,
    );
    const firstHandle = container.querySelector(
      '[role="separator"][aria-orientation="vertical"]',
    ) as HTMLElement;
    fireEvent.mouseDown(firstHandle, { clientX: 100 });
    fireEvent.mouseMove(document, { clientX: 150 });
    fireEvent.mouseUp(document);

    expect(onResize).toHaveBeenCalledTimes(1);
    expect(onResize.mock.calls[0]?.[0]).toBe('name');
  });

  // ───────────────────────────────────────────────────────────────────────────
  // Phase 3 — 키보드 네비게이션 / 컨텍스트 메뉴 / 컬럼 순서 / view
  // ───────────────────────────────────────────────────────────────────────────

  it('키보드 네비게이션: 화살표/Tab/Enter로 active 셀 이동', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Grid columns={columns} data={sampleData} getRowId={(r) => r.id} />,
    );

    // 첫 셀 클릭으로 active 시작
    await user.click(screen.getByText('사과'));
    const gridContainer = container.querySelector('[tabindex="0"]') as HTMLElement;

    // ArrowRight → 옆 셀 (가격)
    fireEvent.keyDown(gridContainer, { key: 'ArrowRight' });
    let active = container.querySelector('td[aria-selected="true"]');
    expect(active?.textContent).toBe('1000');

    // ArrowDown → 같은 컬럼 다음 행 (2000)
    fireEvent.keyDown(gridContainer, { key: 'ArrowDown' });
    active = container.querySelector('td[aria-selected="true"]');
    expect(active?.textContent).toBe('2000');

    // ArrowLeft → 옆 셀 (바나나)
    fireEvent.keyDown(gridContainer, { key: 'ArrowLeft' });
    active = container.querySelector('td[aria-selected="true"]');
    expect(active?.textContent).toBe('바나나');

    // Enter → 다음 행 (체리)
    fireEvent.keyDown(gridContainer, { key: 'Enter' });
    active = container.querySelector('td[aria-selected="true"]');
    expect(active?.textContent).toBe('체리');

    // End → 행 마지막 컬럼 (3000)
    fireEvent.keyDown(gridContainer, { key: 'End' });
    active = container.querySelector('td[aria-selected="true"]');
    expect(active?.textContent).toBe('3000');

    // Ctrl+Home → 그리드 시작
    fireEvent.keyDown(gridContainer, { key: 'Home', ctrlKey: true });
    active = container.querySelector('td[aria-selected="true"]');
    expect(active?.textContent).toBe('사과');
  });

  it('컨텍스트 메뉴: contextMenu=true 시 우클릭으로 기본 메뉴 표시', async () => {
    const user = userEvent.setup();
    render(<Grid columns={columns} data={sampleData} contextMenu getRowId={(r) => r.id} />);
    const cell = screen.getByText('사과').closest('td')!;
    fireEvent.contextMenu(cell, { clientX: 100, clientY: 100 });
    const menu = await screen.findByRole('menu', { name: '셀 컨텍스트 메뉴' });
    expect(menu).toBeInTheDocument();
    // 기본 항목들 존재
    expect(screen.getByRole('menuitem', { name: /복사/ })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /붙여넣기/ })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /셀 클리어/ })).toBeInTheDocument();
    // Escape로 닫힘
    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByRole('menu', { name: '셀 컨텍스트 메뉴' })).not.toBeInTheDocument();
    });
  });

  it('컨텍스트 메뉴: 함수형 prop으로 커스텀 항목 + ctx 전달', () => {
    const onCustom = vi.fn();
    render(
      <Grid
        columns={columns}
        data={sampleData}
        getRowId={(r) => r.id}
        contextMenu={(ctx) => [
          { id: 'custom', label: `상세보기 #${ctx.rowId}`, onClick: () => onCustom(ctx) },
        ]}
      />,
    );
    const cell = screen.getByText('바나나').closest('td')!;
    fireEvent.contextMenu(cell);
    const item = screen.getByRole('menuitem', { name: '상세보기 #2' });
    fireEvent.click(item);
    expect(onCustom).toHaveBeenCalledWith(expect.objectContaining({ rowId: 2, columnId: 'name' }));
  });

  it('컬럼 순서 변경: reorderable + drag&drop 으로 헤더 순서 이동', () => {
    const onReorder = vi.fn();
    const { container } = render(
      <Grid columns={columns} data={sampleData} reorderable onColumnReorder={onReorder} />,
    );
    const headers = container.querySelectorAll('th[scope="col"]');
    // 시뮬: 'name' 헤더 → 'price' 헤더로 drop
    const nameHeader = headers[0] as HTMLElement; // 이름
    const priceHeader = headers[1] as HTMLElement; // 가격
    const dataTransfer = {
      setData: vi.fn(),
      getData: vi.fn().mockReturnValue('name'),
      effectAllowed: '',
      dropEffect: '',
    };
    fireEvent.dragStart(nameHeader, { dataTransfer });
    fireEvent.dragOver(priceHeader, { dataTransfer });
    fireEvent.drop(priceHeader, { dataTransfer });
    expect(onReorder).toHaveBeenCalledWith(['price', 'name']);
  });

  it('view: ref API로 getView / setView / clearView 동작', () => {
    const ref = React.createRef<GridHandle<Row>>();
    render(<Grid ref={ref} columns={columns} data={sampleData} />);
    // 초기 view
    let v = ref.current!.getView();
    expect(v.sortStates).toEqual([]);
    expect(v.columnOrder).toEqual(['name', 'price']);
    // setView 적용
    act(() => {
      ref.current?.setView({
        sortStates: [{ columnId: 'price', direction: 'desc' }],
        columnWidths: { price: 200 },
        columnVisibility: { price: false },
      });
    });
    v = ref.current!.getView();
    expect(v.sortStates).toEqual([{ columnId: 'price', direction: 'desc' }]);
    expect(v.columnWidths.price).toBe(200);
    expect(v.columnVisibility.price).toBe(false);
    // clearView
    act(() => {
      ref.current?.clearView();
    });
    v = ref.current!.getView();
    expect(v.sortStates).toEqual([]);
    expect(v.columnWidths).toEqual({});
  });

  it('view: viewKey 지정 시 localStorage에 저장 → 다시 마운트해도 복원', async () => {
    const user = userEvent.setup();
    // localStorage 모킹은 jsdom 기본 — 진짜 사용 가능
    window.localStorage.removeItem('baneung-grid:test-grid');
    const sortableCols: GridColumn<Row>[] = [
      { id: 'name', header: '이름', accessor: 'name', sortable: true },
      { id: 'price', header: '가격', accessor: 'price', sortable: true },
    ];
    const { unmount } = render(
      <Grid columns={sortableCols} data={sampleData} viewKey="test-grid" getRowId={(r) => r.id} />,
    );
    // 이름 컬럼 정렬 활성화
    await user.click(screen.getByRole('columnheader', { name: /이름/ }));
    // localStorage에 저장됨 확인
    await waitFor(() => {
      const stored = window.localStorage.getItem('baneung-grid:test-grid');
      expect(stored).toBeTruthy();
      const view = JSON.parse(stored!);
      expect(view.sortStates).toEqual([{ columnId: 'name', direction: 'asc' }]);
    });
    // 언마운트 후 다시 마운트 → 저장된 정렬이 복원돼야 함
    unmount();
    const ref = React.createRef<GridHandle<Row>>();
    render(
      <Grid
        ref={ref}
        columns={sortableCols}
        data={sampleData}
        viewKey="test-grid"
        getRowId={(r) => r.id}
      />,
    );
    await waitFor(() => {
      expect(ref.current?.getView().sortStates).toEqual([{ columnId: 'name', direction: 'asc' }]);
    });
    window.localStorage.removeItem('baneung-grid:test-grid');
  });
});
