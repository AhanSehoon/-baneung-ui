'use client';

import * as React from 'react';

import { Grid, type GridColumn, type GridHandle } from '@baneung-pack/grid';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Heading,
  Lead,
  Muted,
  Separator,
} from '@baneung-pack/ui';

// ─────────────────────────────────────────────────────────────────────────────
// 데모 데이터
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

// 가상화 데모용 — 5000행. 인덱스 기반 deterministic 값 사용 (SSR/CSR 일치 보장).
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

// 카테고리별 색상 (커스텀 renderer 데모)
const categoryColors: Record<Product['category'], 'secondary' | 'outline' | 'danger'> = {
  과일: 'secondary',
  채소: 'outline',
  곡물: 'danger',
};

// ─────────────────────────────────────────────────────────────────────────────
// Demo 1: 기본
// ─────────────────────────────────────────────────────────────────────────────

const basicColumns: GridColumn<Product>[] = [
  { id: 'id', header: 'ID', accessor: 'id', width: 60, align: 'right' },
  { id: 'name', header: '상품명', accessor: 'name' },
  { id: 'category', header: '카테고리', accessor: 'category', width: 100 },
  { id: 'price', header: '가격', accessor: 'price', align: 'right', width: 120 },
  { id: 'stock', header: '재고', accessor: 'stock', align: 'right', width: 80 },
];

function BasicDemo() {
  return <Grid columns={basicColumns} data={sampleProducts} getRowId={(row) => row.id} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// Demo 2: 커스텀 renderer (콤마, Badge)
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

function CustomRendererDemo() {
  return <Grid columns={formattedColumns} data={sampleProducts} getRowId={(row) => row.id} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// Demo 3: 가상화 (5000행)
// ─────────────────────────────────────────────────────────────────────────────

function VirtualizedDemo() {
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
// Demo 4: 내장 페이지네이션
// ─────────────────────────────────────────────────────────────────────────────

function PaginationDemo() {
  // 25개 페이지가 생기도록 250행
  const data = React.useMemo(() => largeDataset.slice(0, 250), []);
  return <Grid columns={formattedColumns} data={data} pageSize={10} getRowId={(row) => row.id} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// Demo 6: 인라인 편집 + 행 선택 + ref API (외부 버튼으로 일괄 삭제·저장)
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

function EditableSelectableDemo() {
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

// ─────────────────────────────────────────────────────────────────────────────
// Demo 5: 외부 페이지네이션 (controlled + showPagination=false)
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// Demo 7: Tree (계층) 모드
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
    renderer: (v) => {
      if (!v) return '';
      return statusBadge[v as keyof typeof statusBadge];
    },
  },
];

function TreeDemo() {
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
// Demo 8: 빌트인 에디터 — dropdown · date · number + progress 렌더러
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

function EditorTypesDemo() {
  return <Grid columns={taskColumns} data={tasks} getRowId={(r) => r.id} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// Demo 5: 외부 페이지네이션 (controlled + showPagination=false)
// ─────────────────────────────────────────────────────────────────────────────

function ExternalPaginationDemo() {
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
// 페이지 본체
// ─────────────────────────────────────────────────────────────────────────────

export default function GridPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>Grid</Heading>
        <Lead>
          데이터 그리드 컴포넌트 (<code>@baneung-pack/grid</code>). props 한 줄로 가상화 모드를
          토글하고, 내장 페이지네이션·외부 페이지네이션 둘 다 지원합니다.
        </Lead>
      </header>

      <Separator />

      {/* Demo 1: Basic */}
      <section className="flex flex-col gap-4">
        <div>
          <Heading level={2} className="text-2xl">
            기본 사용
          </Heading>
          <Muted className="text-sm">컬럼 정의 + 데이터만 전달. 좌/중/우 align 지원.</Muted>
        </div>
        <BasicDemo />
      </section>

      {/* Demo 2: Custom renderers */}
      <section className="flex flex-col gap-4">
        <div>
          <Heading level={2} className="text-2xl">
            커스텀 렌더러
          </Heading>
          <Muted className="text-sm">
            <code>renderer</code> 함수로 임의의 React 노드 반환. 콤마·Badge·조건부 색상 등.
          </Muted>
        </div>
        <CustomRendererDemo />
      </section>

      {/* Demo 3: Virtualized */}
      <section className="flex flex-col gap-4">
        <div className="flex items-end justify-between">
          <div>
            <Heading level={2} className="text-2xl">
              가상화 모드
            </Heading>
            <Muted className="text-sm">
              <code>virtualized</code> 한 줄. 5000행 데이터 — DOM 노드 수는 약 20개 내외 유지.
            </Muted>
          </div>
          <Badge variant="outline">5,000 rows</Badge>
        </div>
        <VirtualizedDemo />
      </section>

      {/* Demo 4: Built-in pagination */}
      <section className="flex flex-col gap-4">
        <div>
          <Heading level={2} className="text-2xl">
            내장 페이지네이션
          </Heading>
          <Muted className="text-sm">
            <code>pageSize</code>만 설정하면 자동으로 내장 페이지네이션 활성. 250행 → 25페이지.
          </Muted>
        </div>
        <PaginationDemo />
      </section>

      {/* Demo 5: External pagination */}
      <section className="flex flex-col gap-4">
        <div>
          <Heading level={2} className="text-2xl">
            외부 페이지네이션
          </Heading>
          <Muted className="text-sm">
            <code>showPagination=false</code> + <code>page</code>/<code>onPageChange</code>로
            controlled. 사이트의 디자인 시스템 Pagination이나 커스텀 컨트롤과 통합.
          </Muted>
        </div>
        <ExternalPaginationDemo />
      </section>

      {/* Demo 6: Editing + Selection + ref API */}
      <section className="flex flex-col gap-4">
        <div>
          <Heading level={2} className="text-2xl">
            인라인 편집 · 선택 · 외부 제어 (ref API)
          </Heading>
          <Muted className="text-sm">
            셀 더블클릭으로 편집, 체크박스로 선택, 외부 버튼은 <code>useRef</code> +{' '}
            <code>useImperativeHandle</code> 패턴으로 그리드 내부 상태를 조회/조작.
          </Muted>
        </div>
        <EditableSelectableDemo />
      </section>

      {/* Demo 7: Tree (계층) */}
      <section className="flex flex-col gap-4">
        <div>
          <Heading level={2} className="text-2xl">
            Tree (계층) 모드
          </Heading>
          <Muted className="text-sm">
            <code>tree</code> + <code>getChildren</code>으로 중첩 데이터를 계층 표시. 각 노드의
            caret(▶/▼)으로 펼침/접힘. <code>defaultExpandedIds</code>로 초기 상태 제어 (
            <code>&apos;all&apos;</code> / <code>&apos;none&apos;</code> / 명시 id 배열).
          </Muted>
        </div>
        <TreeDemo />
      </section>

      {/* Demo 8: 빌트인 에디터 + 정렬·필터 */}
      <section className="flex flex-col gap-4">
        <div>
          <Heading level={2} className="text-2xl">
            빌트인 에디터 · 정렬 · 필터
          </Heading>
          <Muted className="text-sm">
            셀 더블클릭으로 편집기(dropdown / date / number) 진입. 헤더 클릭으로 정렬 (↕ → ▲ asc → ▼
            desc → 해제, 3-state). Charge 컬럼에는 필터 input — 부분 일치 (대소문자 무시).{' '}
            <code>sortable</code> / <code>filterable</code> 컬럼 prop으로 활성.
          </Muted>
        </div>
        <EditorTypesDemo />
      </section>

      <Separator />

      {/* Props 요약 */}
      <Card>
        <CardHeader>
          <CardTitle>Props 요약</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border-default">
                  <th className="px-3 py-2 text-left font-medium">Prop</th>
                  <th className="px-3 py-2 text-left font-medium">타입</th>
                  <th className="px-3 py-2 text-left font-medium">기본값</th>
                  <th className="px-3 py-2 text-left font-medium">설명</th>
                </tr>
              </thead>
              <tbody className="text-foreground-muted">
                {[
                  ['columns', 'GridColumn<TRow>[]', '필수', '컬럼 정의 배열'],
                  ['data', 'TRow[]', '필수', '행 데이터 배열'],
                  ['virtualized', 'boolean', 'false', '가상화 활성. 1000+ 행 권장'],
                  ['rowHeight', 'number', '36', '가상화 모드 행 높이(px)'],
                  ['height', 'number | string', '400', '컨테이너 높이'],
                  ['pageSize', 'number', '0', '> 0 이면 페이지네이션 활성'],
                  ['showPagination', 'boolean', 'true', '내장 페이지네이션 UI 표시'],
                  ['page', 'number', '-', 'controlled 페이지 (1-based)'],
                  ['onPageChange', '(page: number) => void', '-', 'controlled 모드 콜백'],
                  ['emptyState', 'ReactNode', '-', '데이터 없을 때 표시'],
                  [
                    'getRowId',
                    '(row, idx) => string | number',
                    '-',
                    '행 키 추출. 편집/선택 시 필수 권장',
                  ],
                  ['selectable', 'boolean', 'false', '첫 컬럼에 체크박스 자동 추가'],
                  ['onRowChange', '(row, id) => void', '-', '편집 commit 시 콜백'],
                  [
                    'ref',
                    'Ref<GridHandle<TRow>>',
                    '-',
                    'imperative API 접근 (saved/changed/deleted)',
                  ],
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop} className="border-b border-border-subtle last:border-b-0">
                    <td className="px-3 py-2 font-mono text-foreground">{prop}</td>
                    <td className="px-3 py-2 font-mono">{type}</td>
                    <td className="px-3 py-2 font-mono">{def}</td>
                    <td className="px-3 py-2">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* GridColumn 옵션 */}
      <Card>
        <CardHeader>
          <CardTitle>GridColumn 필드</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border-default">
                  <th className="px-3 py-2 text-left font-medium">필드</th>
                  <th className="px-3 py-2 text-left font-medium">타입</th>
                  <th className="px-3 py-2 text-left font-medium">설명</th>
                </tr>
              </thead>
              <tbody className="text-foreground-muted">
                {[
                  ['id', 'string', '컬럼 고유 식별자 (key·정렬·테스트에 사용)'],
                  ['header', 'ReactNode', '헤더에 표시될 노드'],
                  ['accessor', 'keyof TRow | (row) => unknown', '행에서 값 추출. 함수면 편집 불가'],
                  ['width', 'number | string', '셀 너비 (px 또는 CSS)'],
                  ['align', "'left' | 'center' | 'right'", '컬럼 정렬. 숫자는 보통 right'],
                  [
                    'renderer',
                    "'text' | (value, row) => ReactNode",
                    "기본 'text'. 함수면 임의 노드",
                  ],
                  [
                    'editable',
                    'boolean',
                    '더블클릭으로 인라인 편집 활성. accessor가 string key일 때만 동작',
                  ],
                ].map(([field, type, desc]) => (
                  <tr key={field} className="border-b border-border-subtle last:border-b-0">
                    <td className="px-3 py-2 font-mono text-foreground">{field}</td>
                    <td className="px-3 py-2 font-mono">{type}</td>
                    <td className="px-3 py-2">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* GridHandle ref 메서드 */}
      <Card>
        <CardHeader>
          <CardTitle>GridHandle (ref API)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border-default">
                  <th className="px-3 py-2 text-left font-medium">메서드</th>
                  <th className="px-3 py-2 text-left font-medium">반환</th>
                  <th className="px-3 py-2 text-left font-medium">설명</th>
                </tr>
              </thead>
              <tbody className="text-foreground-muted">
                {[
                  [
                    'getSavedData()',
                    'TRow[]',
                    '편집 반영, 삭제 제외한 현재 데이터 (저장 페이로드)',
                  ],
                  ['getChangedData()', 'TRow[]', '편집된 행만 (PATCH 페이로드)'],
                  ['getDeletedData()', 'TRow[]', '삭제된 행의 원본 스냅샷 (삭제 페이로드)'],
                  ['getSelectedIds()', '(string | number)[]', '현재 선택된 행 ID 배열'],
                  ['deleteSelected()', 'void', '선택된 행을 모두 삭제 처리'],
                  ['clearSelection()', 'void', '선택 해제'],
                  ['reset()', 'void', '편집·삭제 내역 폐기, 원본 data로 복원'],
                ].map(([method, ret, desc]) => (
                  <tr key={method} className="border-b border-border-subtle last:border-b-0">
                    <td className="px-3 py-2 font-mono text-foreground">{method}</td>
                    <td className="px-3 py-2 font-mono">{ret}</td>
                    <td className="px-3 py-2">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Roadmap */}
      <Card>
        <CardHeader>
          <CardTitle>로드맵</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-foreground-muted">
            <li>
              <strong>v0.3</strong>: 빌트인 셀 렌더러 (number-comma, date-picker, dropdown, icon)
            </li>
            <li>
              <strong>v0.4</strong>: 정렬·필터·컬럼 리사이즈
            </li>
            <li>
              <strong>v0.5</strong>: 행 드래그 순서 변경·그룹·고정 컬럼
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
