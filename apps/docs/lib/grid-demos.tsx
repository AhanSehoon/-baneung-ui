'use client';

import * as React from 'react';

import { Grid, type GridColumn, type GridHandle } from '@baneung-pack/grid';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Muted } from '@baneung-pack/ui';

/**
 * 모든 Grid 데모 컴포넌트와 샘플 데이터를 한 곳에서 관리.
 * 각 데모 페이지(`/grid/*`)는 여기서 export된 함수형 컴포넌트만 import해서 렌더한다.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 공통 데이터 — 일반 Product 샘플
// ─────────────────────────────────────────────────────────────────────────────

interface Product {
  id: number;
  name: string;
  category: '과일' | '채소' | '곡물';
  price: number;
  stock: number;
}

const sampleProducts: Product[] = [
  { id: 1, name: '사과', category: '과일', price: 3500, stock: 120 },
  { id: 2, name: '바나나', category: '과일', price: 2800, stock: 85 },
  { id: 3, name: '체리', category: '과일', price: 12000, stock: 30 },
  { id: 4, name: '당근', category: '채소', price: 1500, stock: 200 },
  { id: 5, name: '브로콜리', category: '채소', price: 2400, stock: 60 },
  { id: 6, name: '감자', category: '채소', price: 900, stock: 500 },
  { id: 7, name: '쌀', category: '곡물', price: 45000, stock: 25 },
  { id: 8, name: '귀리', category: '곡물', price: 9800, stock: 40 },
];

const largeDataset: Product[] = Array.from({ length: 5000 }, (_, i) => {
  const categories: Product['category'][] = ['과일', '채소', '곡물'];
  const cat = categories[i % 3]!;
  return {
    id: i + 1,
    name: `${cat}-${String(i + 1).padStart(4, '0')}`,
    category: cat,
    price: 500 + ((i * 7919) % 100000),
    stock: (i * 6151) % 500,
  };
});

const categoryColors: Record<Product['category'], 'secondary' | 'outline' | 'danger'> = {
  과일: 'secondary',
  채소: 'outline',
  곡물: 'danger',
};

// ─────────────────────────────────────────────────────────────────────────────
// Demo: 기본 사용
// ─────────────────────────────────────────────────────────────────────────────

const basicColumns: GridColumn<Product>[] = [
  { id: 'id', header: 'ID', accessor: 'id', width: 60, align: 'right' },
  { id: 'name', header: '상품명', accessor: 'name' },
  { id: 'category', header: '카테고리', accessor: 'category', width: 100 },
  { id: 'price', header: '가격', accessor: 'price', align: 'right', width: 120 },
  { id: 'stock', header: '재고', accessor: 'stock', align: 'right', width: 80 },
];

export function BasicDemo() {
  return <Grid columns={basicColumns} data={sampleProducts} getRowId={(row) => row.id} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// Demo: 커스텀 renderer (콤마, Badge, 조건부 색)
// ─────────────────────────────────────────────────────────────────────────────

const formattedColumns: GridColumn<Product>[] = [
  { id: 'id', header: 'ID', accessor: 'id', width: 60, align: 'right' },
  { id: 'name', header: '상품명', accessor: 'name' },
  {
    id: 'category',
    header: '카테고리',
    accessor: 'category',
    width: 100,
    renderer: (value) => (
      <Badge variant={categoryColors[value as Product['category']]}>
        {value as React.ReactNode}
      </Badge>
    ),
  },
  {
    id: 'price',
    header: '가격',
    accessor: 'price',
    align: 'right',
    width: 120,
    renderer: (value) => `${(value as number).toLocaleString()}원`,
  },
  {
    id: 'stock',
    header: '재고',
    accessor: 'stock',
    align: 'right',
    width: 100,
    renderer: (value) => {
      const n = value as number;
      const color = n < 50 ? 'text-danger' : 'text-foreground';
      return <span className={color}>{n.toLocaleString()}개</span>;
    },
  },
];

export function CustomRendererDemo() {
  return <Grid columns={formattedColumns} data={sampleProducts} getRowId={(row) => row.id} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// Demo: 가상화 (5000행)
// ─────────────────────────────────────────────────────────────────────────────

export function VirtualizedDemo() {
  return (
    <Grid
      columns={formattedColumns}
      data={largeDataset}
      virtualized
      height={420}
      rowHeight={36}
      getRowId={(row) => row.id}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Demo: 내장 페이지네이션
// ─────────────────────────────────────────────────────────────────────────────

export function PaginationDemo() {
  const data = React.useMemo(() => largeDataset.slice(0, 250), []);
  return <Grid columns={formattedColumns} data={data} pageSize={10} getRowId={(row) => row.id} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// Demo: 외부 페이지네이션
// ─────────────────────────────────────────────────────────────────────────────

export function ExternalPaginationDemo() {
  const [page, setPage] = React.useState(1);
  const pageSize = 5;
  const data = React.useMemo(() => largeDataset.slice(0, 50), []);
  const pageCount = Math.ceil(data.length / pageSize);

  return (
    <div className="flex flex-col gap-3">
      <Grid
        columns={formattedColumns}
        data={data}
        pageSize={pageSize}
        page={page}
        onPageChange={setPage}
        showPagination={false}
        getRowId={(row) => row.id}
      />
      <div className="flex items-center justify-between border-t border-border-default px-3 py-2">
        <Muted className="text-xs">
          {pageCount}개 페이지 중 {page}페이지 (외부 컨트롤)
        </Muted>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            이전
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            disabled={page >= pageCount}
          >
            다음
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Demo: 인라인 편집 + 행 선택 + ref API
// ─────────────────────────────────────────────────────────────────────────────

const editableColumns: GridColumn<Product>[] = [
  { id: 'id', header: 'ID', accessor: 'id', width: 60, align: 'right' },
  { id: 'name', header: '상품명 (편집)', accessor: 'name', editable: true },
  { id: 'category', header: '카테고리 (편집)', accessor: 'category', width: 100, editable: true },
  {
    id: 'price',
    header: '가격 (편집)',
    accessor: 'price',
    align: 'right',
    width: 120,
    editable: true,
    renderer: (v) => `${Number(v).toLocaleString()}원`,
  },
  {
    id: 'stock',
    header: '재고 (편집)',
    accessor: 'stock',
    align: 'right',
    width: 100,
    editable: true,
    renderer: (v) => `${Number(v).toLocaleString()}개`,
  },
];

interface InspectorPayload {
  saved: Product[];
  changed: Product[];
  deleted: Product[];
  selected: (string | number)[];
}

function InspectorBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <Muted className="text-xs font-medium uppercase tracking-wide">{title}</Muted>
      <div className="max-h-40 overflow-auto border border-border-subtle bg-canvas p-2">
        {children}
      </div>
    </div>
  );
}

export function EditableSelectableDemo() {
  const gridRef = React.useRef<GridHandle<Product>>(null);
  const [inspector, setInspector] = React.useState<InspectorPayload | null>(null);

  const refresh = React.useCallback(() => {
    if (!gridRef.current) return;
    setInspector({
      saved: gridRef.current.getSavedData(),
      changed: gridRef.current.getChangedData(),
      deleted: gridRef.current.getDeletedData(),
      selected: gridRef.current.getSelectedIds(),
    });
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2 border border-border-default bg-surface px-3 py-2">
        <Muted className="text-xs">셀 더블클릭으로 편집, 체크박스로 선택:</Muted>
        <div className="grow" />
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            gridRef.current?.deleteSelected();
            refresh();
          }}
        >
          선택 삭제
        </Button>
        <Button variant="outline" size="sm" onClick={refresh}>
          변경 내역 확인
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            gridRef.current?.reset();
            setInspector(null);
          }}
        >
          되돌리기
        </Button>
      </div>

      <Grid
        ref={gridRef}
        columns={editableColumns}
        data={sampleProducts}
        selectable
        getRowId={(row) => row.id}
        onRowChange={() => refresh()}
      />

      {inspector && (
        <Card>
          <CardHeader>
            <CardTitle>ref API 응답</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <InspectorBlock title={`getSelectedIds (${inspector.selected.length})`}>
                <pre className="overflow-auto text-xs">{JSON.stringify(inspector.selected)}</pre>
              </InspectorBlock>
              <InspectorBlock title={`getChangedData (${inspector.changed.length})`}>
                <pre className="overflow-auto text-xs">
                  {JSON.stringify(inspector.changed, null, 2)}
                </pre>
              </InspectorBlock>
              <InspectorBlock title={`getDeletedData (${inspector.deleted.length})`}>
                <pre className="overflow-auto text-xs">
                  {JSON.stringify(inspector.deleted, null, 2)}
                </pre>
              </InspectorBlock>
              <InspectorBlock title={`getSavedData (${inspector.saved.length})`}>
                <pre className="overflow-auto text-xs">
                  {JSON.stringify(inspector.saved, null, 2)}
                </pre>
              </InspectorBlock>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Demo: Tree (계층) 모드
// ─────────────────────────────────────────────────────────────────────────────

interface TreeNode {
  id: string;
  name: string;
  type: 'folder' | 'task';
  status?: 'todo' | 'doing' | 'done';
  children?: TreeNode[];
}

const treeData: TreeNode[] = [
  {
    id: 'p1',
    name: 'Proposal of Project',
    type: 'folder',
    children: [
      {
        id: 'p1-1',
        name: 'Gathering of idea',
        type: 'folder',
        children: [
          { id: 'p1-1-1', name: 'Define project objective', type: 'task', status: 'done' },
          { id: 'p1-1-2', name: 'Brainstorming', type: 'task', status: 'done' },
          { id: 'p1-1-3', name: 'Think my idea', type: 'task', status: 'doing' },
          {
            id: 'p1-1-4',
            name: 'Complete proposal of individual idea',
            type: 'task',
            status: 'doing',
          },
          { id: 'p1-1-5', name: 'Have a idea appraisal', type: 'task', status: 'todo' },
          {
            id: 'p1-1-6',
            name: 'Make the decision in a management meeting',
            type: 'task',
            status: 'todo',
          },
        ],
      },
      {
        id: 'p1-2',
        name: 'Market research',
        type: 'folder',
        children: [
          { id: 'p1-2-1', name: 'Competitor analysis', type: 'task', status: 'todo' },
          { id: 'p1-2-2', name: 'User survey', type: 'task', status: 'todo' },
        ],
      },
      {
        id: 'p1-3',
        name: 'Writing Proposal',
        type: 'folder',
        children: [{ id: 'p1-3-1', name: 'Draft proposal', type: 'task', status: 'todo' }],
      },
    ],
  },
  {
    id: 'p2',
    name: 'Planning',
    type: 'folder',
    children: [
      {
        id: 'p2-1',
        name: 'Scheduling of Projct',
        type: 'folder',
        children: [{ id: 'p2-1-1', name: 'Define milestones', type: 'task', status: 'todo' }],
      },
      {
        id: 'p2-2',
        name: 'Assignment of resource',
        type: 'folder',
        children: [{ id: 'p2-2-1', name: 'Allocate team', type: 'task', status: 'todo' }],
      },
      {
        id: 'p2-3',
        name: 'Assignment of Task',
        type: 'folder',
        children: [{ id: 'p2-3-1', name: 'Distribute tasks', type: 'task', status: 'todo' }],
      },
    ],
  },
  {
    id: 'p3',
    name: 'Design',
    type: 'folder',
    children: [
      { id: 'p3-1', name: 'Design user interface web page', type: 'task', status: 'todo' },
      { id: 'p3-2', name: 'Define user interface functionality', type: 'task', status: 'todo' },
    ],
  },
];

const statusBadge = {
  todo: <Badge variant="outline">To Do</Badge>,
  doing: <Badge variant="secondary">In Progress</Badge>,
  done: <Badge variant="success">Done</Badge>,
} as const;

const treeColumns: GridColumn<TreeNode>[] = [
  { id: 'name', header: '항목', accessor: 'name' },
  {
    id: 'type',
    header: '종류',
    accessor: 'type',
    width: 100,
    renderer: (v) => (v === 'folder' ? '📁 폴더' : '· 작업'),
  },
  {
    id: 'status',
    header: '상태',
    accessor: 'status',
    width: 120,
    renderer: (v) => (v ? statusBadge[v as keyof typeof statusBadge] : ''),
  },
];

export function TreeDemo() {
  return (
    <Grid
      columns={treeColumns}
      data={treeData}
      tree
      getChildren={(row) => row.children}
      getRowId={(row) => row.id}
      defaultExpandedIds={['p1', 'p1-1']}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Demo: 빌트인 에디터 · 정렬 · 필터
// ─────────────────────────────────────────────────────────────────────────────

interface Task {
  id: number;
  charge: string;
  complete: number;
  startDate: string;
  endDate: string;
}

const chargeOptions = [
  { value: 'Lawrence', label: 'Lawrence' },
  { value: 'Anna', label: 'Anna' },
  { value: 'Chaly', label: 'Chaly' },
  { value: 'Ken', label: 'Ken' },
  { value: 'Sindy', label: 'Sindy' },
  { value: 'Paude Jim', label: 'Paude Jim' },
  { value: 'Jim Mackulan', label: 'Jim Mackulan' },
  { value: 'Steve', label: 'Steve' },
];

const tasks: Task[] = [
  { id: 1, charge: 'Lawrence', complete: 62, startDate: '2024-02-01', endDate: '2024-08-21' },
  { id: 2, charge: 'Anna', complete: 99, startDate: '2024-02-01', endDate: '2024-03-31' },
  { id: 3, charge: 'Chaly', complete: 100, startDate: '2024-02-01', endDate: '2024-02-15' },
  { id: 4, charge: 'Ken', complete: 100, startDate: '2024-02-05', endDate: '2024-02-28' },
  { id: 5, charge: 'Sindy', complete: 100, startDate: '2024-02-15', endDate: '2024-03-05' },
  { id: 6, charge: 'Paude Jim', complete: 100, startDate: '2024-03-11', endDate: '2024-03-20' },
  { id: 7, charge: 'Jim Mackulan', complete: 98, startDate: '2024-03-31', endDate: '2024-03-31' },
  { id: 8, charge: 'Steve', complete: 50, startDate: '2024-03-01', endDate: '2024-05-31' },
];

const taskColumns: GridColumn<Task>[] = [
  { id: 'id', header: 'ID', accessor: 'id', width: 60, align: 'right', sortable: true },
  {
    id: 'charge',
    header: 'Charge',
    accessor: 'charge',
    editable: true,
    editor: 'dropdown',
    options: chargeOptions,
    sortable: true,
    filterable: true,
  },
  {
    id: 'complete',
    header: 'Complete(%)',
    accessor: 'complete',
    renderer: 'progress',
    min: 0,
    max: 100,
    editable: true,
    editor: 'number',
    width: 140,
    sortable: true,
  },
  {
    id: 'startDate',
    header: 'Start Date',
    accessor: 'startDate',
    renderer: 'date',
    dateFormat: 'YYYY/MM/DD',
    editable: true,
    editor: 'date',
    width: 130,
    sortable: true,
  },
  {
    id: 'endDate',
    header: 'End Date',
    accessor: 'endDate',
    renderer: 'date',
    dateFormat: 'YYYY/MM/DD',
    editable: true,
    editor: 'date',
    width: 130,
    sortable: true,
  },
];

export function EditorTypesDemo() {
  return <Grid columns={taskColumns} data={tasks} getRowId={(r) => r.id} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// Demo: 행 추가/삭제 + multi-cell drag + Delete 키
// ─────────────────────────────────────────────────────────────────────────────

interface TaskRow {
  id: number;
  charge: string;
  complete: number;
  startDate: string;
  endDate: string;
}

const initialTasks: TaskRow[] = [
  { id: 1, charge: 'Lawrence', complete: 62, startDate: '2024-02-01', endDate: '2024-08-21' },
  { id: 2, charge: 'Anna', complete: 99, startDate: '2024-02-01', endDate: '2024-03-31' },
  { id: 3, charge: 'Steve', complete: 50, startDate: '2024-03-01', endDate: '2024-05-31' },
];

const editableTaskColumns: GridColumn<TaskRow>[] = [
  { id: 'id', header: 'ID', accessor: 'id', width: 60, align: 'right' },
  {
    id: 'charge',
    header: 'Charge',
    accessor: 'charge',
    editable: true,
    editor: 'dropdown',
    options: chargeOptions,
  },
  {
    id: 'complete',
    header: 'Complete(%)',
    accessor: 'complete',
    renderer: 'progress',
    min: 0,
    max: 100,
    editable: true,
    editor: 'number',
    width: 140,
  },
  {
    id: 'startDate',
    header: 'Start Date',
    accessor: 'startDate',
    renderer: 'date',
    dateFormat: 'YYYY/MM/DD',
    editable: true,
    editor: 'date',
    width: 130,
  },
  {
    id: 'endDate',
    header: 'End Date',
    accessor: 'endDate',
    renderer: 'date',
    dateFormat: 'YYYY/MM/DD',
    editable: true,
    editor: 'date',
    width: 130,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Demo: CSV 다운로드
// ─────────────────────────────────────────────────────────────────────────────

export function CsvExportDemo() {
  const gridRef = React.useRef<GridHandle<Product>>(null);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2 border border-border-default bg-surface px-3 py-2">
        <Muted className="text-xs">행 편집 후 다운로드:</Muted>
        <div className="grow" />
        <Button
          variant="outline"
          size="sm"
          onClick={() => gridRef.current?.exportCsv('products.csv')}
        >
          전체 CSV 다운로드
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const changed = gridRef.current?.getChangedData() ?? [];
            gridRef.current?.exportCsv('products-changed.csv', { rows: changed });
          }}
        >
          변경분만 CSV 다운로드
        </Button>
        <Button variant="ghost" size="sm" onClick={() => gridRef.current?.reset()}>
          되돌리기
        </Button>
      </div>
      <Grid
        ref={gridRef}
        columns={editableColumns}
        data={sampleProducts}
        selectable
        getRowId={(row) => row.id}
      />
    </div>
  );
}

export function RowOperationsDemo() {
  const gridRef = React.useRef<GridHandle<TaskRow>>(null);
  const nextIdRef = React.useRef(initialTasks.length + 1);
  const blankRow = (): TaskRow => ({
    id: nextIdRef.current++,
    charge: 'Anna',
    complete: 0,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2 border border-border-default bg-surface px-3 py-2 text-xs">
        <Muted className="text-xs">행 추가:</Muted>
        <Button
          variant="outline"
          size="sm"
          onClick={() => gridRef.current?.addRow(blankRow(), 'first')}
        >
          최상위
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => gridRef.current?.addRow(blankRow(), 'last')}
        >
          최하위
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => gridRef.current?.addRow(blankRow(), 'above-active')}
        >
          선택 위
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => gridRef.current?.addRow(blankRow(), 'below-active')}
        >
          선택 아래
        </Button>
        <div className="mx-2 h-4 w-px bg-border-default" aria-hidden="true" />
        <Muted className="text-xs">행/셀 삭제:</Muted>
        <Button variant="outline" size="sm" onClick={() => gridRef.current?.removeSelectedRows()}>
          선택 행 삭제
        </Button>
        <Button variant="outline" size="sm" onClick={() => gridRef.current?.clearSelectedCells()}>
          선택 셀 클리어
        </Button>
        <Button variant="ghost" size="sm" onClick={() => gridRef.current?.reset()}>
          되돌리기
        </Button>
      </div>

      <Muted className="text-xs">
        💡 단일 셀 클릭 또는 드래그로 여러 셀 선택 (사각형 영역). Delete 키로 선택 셀 값 클리어
        (그리드 컨테이너 포커스 필요 — 클릭하면 자동 포커스).
      </Muted>

      <Grid
        ref={gridRef}
        columns={editableTaskColumns}
        data={initialTasks}
        getRowId={(r) => r.id}
        cellSelection="multi"
        clearOnDelete
      />
    </div>
  );
}
