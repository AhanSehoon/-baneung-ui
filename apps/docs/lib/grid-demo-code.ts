/**
 * 각 Grid 데모의 소스 코드 스니펫 — 데모 페이지에서 "코드 보기" 버튼으로 노출.
 *
 * 실제 데모 구현은 `apps/docs/lib/grid-demos.tsx`에 있고, 여기는 사용자에게
 * 참고로 보여줄 최소 코드 예시(데이터 정의 + 컴포넌트 호출)만 따로 정리.
 */

export const basicCode = `import { Grid, type GridColumn } from '@baneung-pack/grid';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
}

const columns: GridColumn<Product>[] = [
  { id: 'id', header: 'ID', accessor: 'id', width: 60, align: 'right' },
  { id: 'name', header: '상품명', accessor: 'name' },
  { id: 'category', header: '카테고리', accessor: 'category', width: 100 },
  { id: 'price', header: '가격', accessor: 'price', align: 'right', width: 120 },
  { id: 'stock', header: '재고', accessor: 'stock', align: 'right', width: 80 },
];

const data: Product[] = [
  { id: 1, name: '사과', category: '과일', price: 3500, stock: 120 },
  // ...
];

export function BasicDemo() {
  return <Grid columns={columns} data={data} getRowId={(row) => row.id} />;
}`;

export const customRendererCode = `import { Grid, type GridColumn } from '@baneung-pack/grid';
import { Badge } from '@baneung-pack/ui';

const columns: GridColumn<Product>[] = [
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
    renderer: (value) => \`\${(value as number).toLocaleString()}원\`,
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
  return <Grid columns={columns} data={data} getRowId={(row) => row.id} />;
}`;

export const virtualizedCode = `import { Grid } from '@baneung-pack/grid';

// 5000행 데이터셋
const largeDataset = Array.from({ length: 5000 }, (_, i) => ({
  id: i + 1,
  name: \`item-\${i + 1}\`,
  // ...
}));

export function VirtualizedDemo() {
  return (
    <Grid
      columns={columns}
      data={largeDataset}
      virtualized       // ← 핵심
      height={420}
      rowHeight={36}
      getRowId={(row) => row.id}
    />
  );
}`;

export const paginationCode = `import { Grid } from '@baneung-pack/grid';

export function PaginationDemo() {
  return (
    <Grid
      columns={columns}
      data={data}      // 250행
      pageSize={10}    // ← 페이지당 10개. > 0이면 페이지네이션 자동 활성
      getRowId={(row) => row.id}
    />
  );
}`;

export const externalPaginationCode = `import { Grid } from '@baneung-pack/grid';
import { Button } from '@baneung-pack/ui';

export function ExternalPaginationDemo() {
  const [page, setPage] = React.useState(1);
  const pageSize = 5;
  const pageCount = Math.ceil(data.length / pageSize);

  return (
    <div>
      <Grid
        columns={columns}
        data={data}
        pageSize={pageSize}
        page={page}                    // ← controlled
        onPageChange={setPage}          // ← controlled
        showPagination={false}          // ← 내장 UI 숨김
        getRowId={(row) => row.id}
      />
      <div>
        {pageCount}개 중 {page}페이지
        <Button onClick={() => setPage((p) => p - 1)} disabled={page <= 1}>이전</Button>
        <Button onClick={() => setPage((p) => p + 1)} disabled={page >= pageCount}>다음</Button>
      </div>
    </div>
  );
}`;

export const editingCode = `import { Grid, type GridColumn, type GridHandle } from '@baneung-pack/grid';
import { Button } from '@baneung-pack/ui';

const columns: GridColumn<Product>[] = [
  { id: 'id', header: 'ID', accessor: 'id', width: 60, align: 'right' },
  { id: 'name', header: '상품명', accessor: 'name', editable: true },     // ← 편집 가능
  { id: 'category', header: '카테고리', accessor: 'category', editable: true },
  { id: 'price', header: '가격', accessor: 'price', editable: true },
  { id: 'stock', header: '재고', accessor: 'stock', editable: true },
];

export function EditableSelectableDemo() {
  const gridRef = React.useRef<GridHandle<Product>>(null);

  const handleSave = () => {
    const saved = gridRef.current?.getSavedData();   // 편집 반영, 삭제 제외 전체
    const changed = gridRef.current?.getChangedData(); // 편집된 행만
    const deleted = gridRef.current?.getDeletedData(); // 삭제된 행 (원본)
    // api.bulkUpsert(changed); api.bulkDelete(deleted.map(r => r.id));
  };

  return (
    <>
      <Button onClick={() => gridRef.current?.deleteSelected()}>선택 삭제</Button>
      <Button onClick={handleSave}>저장</Button>
      <Button onClick={() => gridRef.current?.reset()}>되돌리기</Button>

      <Grid
        ref={gridRef}
        columns={columns}
        data={data}
        selectable                       // ← 체크박스 컬럼 추가
        getRowId={(row) => row.id}
        onRowChange={(row, id) => console.log('changed', id, row)}
      />
    </>
  );
}`;

export const treeCode = `import { Grid, type GridColumn } from '@baneung-pack/grid';

interface TreeNode {
  id: string;
  name: string;
  type: 'folder' | 'task';
  children?: TreeNode[];
}

const treeData: TreeNode[] = [
  {
    id: 'p1', name: 'Proposal of Project', type: 'folder',
    children: [
      { id: 'p1-1', name: 'Gathering of idea', type: 'folder', children: [...] },
      // ...
    ],
  },
];

const columns: GridColumn<TreeNode>[] = [
  { id: 'name', header: '항목', accessor: 'name' },
  { id: 'type', header: '종류', accessor: 'type', width: 100 },
  { id: 'status', header: '상태', accessor: 'status', width: 120 },
];

export function TreeDemo() {
  return (
    <Grid
      columns={columns}
      data={treeData}
      tree                                  // ← 계층 모드 활성
      getChildren={(row) => row.children}   // ← 자식 추출
      getRowId={(row) => row.id}
      defaultExpandedIds={['p1', 'p1-1']}   // ← 'all' / 'none' / id 배열
    />
  );
}`;

export const editorsSortFilterCode = `import { Grid, type GridColumn } from '@baneung-pack/grid';

const columns: GridColumn<Task>[] = [
  { id: 'id', header: 'ID', accessor: 'id', width: 60, align: 'right', sortable: true },
  {
    id: 'charge',
    header: 'Charge',
    accessor: 'charge',
    editable: true,
    editor: 'dropdown',                 // ← 드롭다운 에디터
    options: chargeOptions,             // ← 선택지
    sortable: true,
    filterable: true,                   // ← 필터 funnel 표시
  },
  {
    id: 'complete',
    header: 'Complete(%)',
    accessor: 'complete',
    renderer: 'progress',               // ← 진행률 바 렌더러
    min: 0, max: 100,
    editable: true,
    editor: 'number',                   // ← 숫자 에디터
    sortable: true,
  },
  {
    id: 'startDate',
    header: 'Start Date',
    accessor: 'startDate',
    renderer: 'date',                   // ← 날짜 포맷팅
    dateFormat: 'YYYY/MM/DD',
    editable: true,
    editor: 'date',                     // ← 달력 popup 에디터
    sortable: true,
  },
];

export function EditorTypesDemo() {
  return <Grid columns={columns} data={tasks} getRowId={(r) => r.id} />;
}`;

export const csvExportCode = `import { Grid, type GridColumn, type GridHandle } from '@baneung-pack/grid';
import { Button } from '@baneung-pack/ui';

export function CsvExportDemo() {
  const gridRef = React.useRef<GridHandle<Product>>(null);

  return (
    <>
      {/* 전체 데이터 CSV로 다운로드 */}
      <Button onClick={() => gridRef.current?.exportCsv('products.csv')}>
        전체 CSV 다운로드
      </Button>

      {/* 변경된 행만 CSV로 다운로드 */}
      <Button
        onClick={() => {
          const changed = gridRef.current?.getChangedData() ?? [];
          gridRef.current?.exportCsv('changed.csv', { rows: changed });
        }}
      >
        변경분만 다운로드
      </Button>

      <Grid
        ref={gridRef}
        columns={editableColumns}
        data={data}
        selectable
        getRowId={(row) => row.id}
      />
    </>
  );
}

// exportCsv는 GridHandle.exportCsv(filename, options?) 시그니처:
// - filename: 다운로드 파일명 (기본 'grid.csv')
// - options.rows: 명시한 행만 export. 미지정 시 getSavedData() 사용 (편집 반영, 삭제 제외)
// 헤더: column.header가 string이면 그 값, 아니면 column.id
// 데이터: accessor가 반환한 raw 값 (renderer 시각 출력 X)
// 인코딩: UTF-8 + BOM → Excel에서 한글 깨짐 없이 열림`;

export const rowOperationsCode = `import { Grid, type GridColumn, type GridHandle } from '@baneung-pack/grid';
import { Button } from '@baneung-pack/ui';

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
    <>
      {/* 행 추가 — 4가지 위치 */}
      <Button onClick={() => gridRef.current?.addRow(blankRow(), 'first')}>최상위</Button>
      <Button onClick={() => gridRef.current?.addRow(blankRow(), 'last')}>최하위</Button>
      <Button onClick={() => gridRef.current?.addRow(blankRow(), 'above-active')}>선택 위</Button>
      <Button onClick={() => gridRef.current?.addRow(blankRow(), 'below-active')}>선택 아래</Button>

      {/* 행/셀 삭제 */}
      <Button onClick={() => gridRef.current?.removeSelectedRows()}>선택 행 삭제</Button>
      <Button onClick={() => gridRef.current?.clearSelectedCells()}>선택 셀 클리어</Button>
      <Button onClick={() => gridRef.current?.reset()}>되돌리기</Button>

      <Grid
        ref={gridRef}
        columns={editableTaskColumns}
        data={initialTasks}
        getRowId={(r) => r.id}
        cellSelection="multi"          // ← 드래그 다중 셀 선택
        clearOnDelete                  // ← Delete 키로 선택 셀 값 클리어
      />
    </>
  );
}`;

export const quickFilterCode = `import { Grid } from '@baneung-pack/grid';
import { Input } from '@baneung-pack/ui';

export function QuickFilterDemo() {
  const [q, setQ] = useState('');
  return (
    <>
      <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="검색" />
      <Grid
        columns={columns}
        data={data}
        quickFilter={q}            // ← 모든 컬럼 부분 일치 (case-insensitive)
        getRowId={(r) => r.id}
      />
    </>
  );
}`;

export const multiSortResizeCode = `import { Grid } from '@baneung-pack/grid';

// sortable=true 컬럼을 헤더 클릭으로 정렬.
// Shift+클릭 → 다중 정렬 추가 (asc → desc → 제거).
// resizable=true → 헤더 우측 경계 드래그로 폭 조절.
export function MultiSortResizeDemo() {
  return (
    <Grid
      columns={columns}
      data={data}
      getRowId={(r) => r.id}
      resizable                            // ← 컬럼 폭 드래그 조절
      onColumnResize={(colId, w) => {
        localStorage.setItem(\`grid-w-\${colId}\`, String(w));
      }}
    />
  );
}`;

export const columnVisibilityCode = `import { Grid, type GridHandle } from '@baneung-pack/grid';

// showColumnMenu=true → 우상단 ⚙️ 버튼 + 체크박스 popover로 컬럼 표시/숨김.
// 또는 column.hidden=true로 초기 숨김 / column.hideable=false로 사용자 토글 차단.
// controlled: columnVisibility prop + onColumnVisibilityChange.
export function ColumnVisibilityDemo() {
  const gridRef = useRef<GridHandle<Order>>(null);
  return (
    <Grid
      ref={gridRef}
      columns={columns}
      data={data}
      getRowId={(r) => r.id}
      showColumnMenu                       // ← 우상단 ⚙ 버튼
    />
  );
}`;

export const columnPinCode = `import { Grid, type GridColumn } from '@baneung-pack/grid';

// column.pin: 'left' | 'right' — 가로 스크롤해도 자리 유지.
// 동일 방향에 여러 컬럼을 pin하면 누적 offset 자동 계산.
const columns: GridColumn<Order>[] = [
  { id: 'id', header: '주문번호', accessor: 'id', width: 90, pin: 'left' },   // ← 좌측 고정
  { id: 'customer', header: '고객명', accessor: 'customer', width: 100, pin: 'left' },
  { id: 'product', header: '상품', accessor: 'product', width: 200 },
  { id: 'price', header: '가격', accessor: 'price', width: 130, align: 'right' },
  { id: 'status', header: '상태', accessor: 'status', width: 100, pin: 'right' }, // ← 우측 고정
];

export function ColumnPinDemo() {
  return <Grid columns={columns} data={data} getRowId={(r) => r.id} />;
}`;

export const footerAggregateCode = `import { Grid, type GridColumn } from '@baneung-pack/grid';

// column.aggregate: 'sum' | 'avg' | 'count' | 'min' | 'max' | function
// showFooter=true 시 푸터 행에 자동 계산된 집계 표시.
const columns: GridColumn<Order>[] = [
  { id: 'id', header: '주문번호', accessor: 'id', aggregate: 'count' },
  { id: 'qty', header: '수량', accessor: 'qty', aggregate: 'sum' },
  {
    id: 'price',
    header: '가격',
    accessor: 'price',
    aggregate: (rows) => {
      const total = rows.reduce((s, r) => s + r.price * r.qty, 0);
      return <strong>합계: {total.toLocaleString()}원</strong>;
    },
  },
];

export function FooterAggregateDemo() {
  return <Grid columns={columns} data={data} showFooter getRowId={(r) => r.id} />;
}`;

export const conditionalStyleCode = `import { Grid, type GridColumn } from '@baneung-pack/grid';

// column.cellStyle: 값/행 기준 인라인 스타일 (Excel 조건부 서식 패턴).
// column.cellClassName: 값/행 기준 Tailwind 클래스.
const columns: GridColumn<Order>[] = [
  { id: 'product', header: '상품', accessor: 'product' },
  {
    id: 'price',
    header: '가격',
    accessor: 'price',
    cellStyle: (v) => {
      const n = v as number;
      if (n > 500000) return { backgroundColor: 'rgba(239, 68, 68, 0.1)', fontWeight: 600 };
      if (n > 300000) return { fontWeight: 600 };
      return undefined;
    },
  },
  {
    id: 'status',
    header: '상태',
    accessor: 'status',
    cellClassName: (v) =>
      v === '취소' ? 'text-danger' : v === '완료' ? 'text-success' : undefined,
  },
];`;

export const excelCode = `import { Grid, type GridHandle } from '@baneung-pack/grid';
import { Button } from '@baneung-pack/ui';

// exportXlsx: ref API — exceljs를 동적 로드 (번들에 미포함).
// clipboard=true: Ctrl+C/V로 Excel과 셀 범위 호환 (TSV 직렬화).
export function ExcelDemo() {
  const ref = useRef<GridHandle<Order>>(null);
  return (
    <>
      <Button onClick={() => ref.current?.exportXlsx({ filename: 'orders.xlsx' })}>
        XLSX로 내보내기
      </Button>
      <Grid
        ref={ref}
        columns={columns}
        data={data}
        getRowId={(r) => r.id}
        cellSelection="multi"
        clipboard                          // ← Ctrl+C/V 활성화
      />
    </>
  );
}`;

export const keyboardNavCode = `import { Grid } from '@baneung-pack/grid';

// cellSelection !== 'none' 일 때 자동 활성.
// 화살표 — 셀 이동
// Tab / Shift+Tab — 다음/이전 셀
// Enter / Shift+Enter — 다음/이전 행 (같은 컬럼)
// Home / End — 행 처음/끝
// Ctrl+Home / Ctrl+End — 그리드 처음/끝
export function KeyboardNavDemo() {
  return (
    <Grid
      columns={columns}
      data={data}
      getRowId={(r) => r.id}
      cellSelection="single"
    />
  );
}`;

export const contextMenuCode = `import { Grid } from '@baneung-pack/grid';

// contextMenu={true}: 기본 메뉴 (복사 · 붙여넣기 · 셀 클리어 · 행 삭제 · CSV/Excel)
// contextMenu={(ctx) => items}: 셀별 동적 메뉴.
//   - ctx.rowId / columnId / row / selectedRowIds
//   - item.shortcut (단축키 힌트) / disabled / separator 지원
export function ContextMenuDemo() {
  return (
    <Grid
      columns={columns}
      data={data}
      getRowId={(r) => r.id}
      cellSelection="multi"
      clipboard
      contextMenu={(ctx) => [
        { id: 'detail', label: \`상세보기 #\${ctx.rowId}\`, onClick: () => navigate(\`/\${ctx.rowId}\`) },
        { separator: true },
        { id: 'copy', label: '복사', shortcut: 'Ctrl+C', onClick: copySelection },
        { id: 'delete', label: '삭제', onClick: () => deleteRow(ctx.rowId) },
      ]}
    />
  );
}`;

export const columnReorderCode = `import { Grid } from '@baneung-pack/grid';

// reorderable=true: 헤더 드래그&드롭으로 컬럼 순서 이동.
// 같은 pin 그룹 안에서만 순서 변경 (pin 경계 유지).
// onColumnReorder 콜백으로 새 순서 받기.
export function ColumnReorderDemo() {
  return (
    <Grid
      columns={columns}
      data={data}
      getRowId={(r) => r.id}
      reorderable                          // ← 헤더 드래그로 순서 변경
      onColumnReorder={(newOrder) => {
        localStorage.setItem('my-grid-order', JSON.stringify(newOrder));
      }}
    />
  );
}`;

export const saveViewCode = `import { Grid, type GridHandle } from '@baneung-pack/grid';
import { Button } from '@baneung-pack/ui';

// viewKey: 정렬 · 폭 · 표시 · 순서를 localStorage에 자동 저장.
// 페이지를 떠났다 다시 와도 마지막 설정 유지.
// ref API: getView() / setView(partial) / clearView()
export function SaveViewDemo() {
  const ref = useRef<GridHandle<Task>>(null);
  return (
    <>
      <Button onClick={() => ref.current?.clearView()}>설정 초기화</Button>
      <Grid
        ref={ref}
        columns={columns}
        data={data}
        getRowId={(r) => r.id}
        viewKey="tasks-view"               // ← localStorage 키
        resizable
        reorderable
        showColumnMenu
      />
    </>
  );
}`;

export const allFeaturesCode = `import { Grid, type GridHandle } from '@baneung-pack/grid';

// 모든 기능을 활성화한 관리자 화면 예제.
// quickFilter + resizable + reorderable + showColumnMenu + showFooter +
// cellSelection multi + clipboard + clearOnDelete + contextMenu + viewKey + Pin
export function AllFeaturesDemo() {
  const ref = useRef<GridHandle<Task>>(null);
  const [q, setQ] = useState('');
  return (
    <>
      <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="검색" />
      <Button onClick={() => ref.current?.exportXlsx({ filename: 'admin.xlsx' })}>XLSX</Button>
      <Grid
        ref={ref}
        columns={columns}              // ← pin/aggregate/cellStyle 등 컬럼 옵션 활용
        data={data}
        getRowId={(r) => r.id}
        quickFilter={q}
        viewKey="admin-view"
        resizable
        reorderable
        showColumnMenu
        showFooter
        cellSelection="multi"
        clipboard
        clearOnDelete
        contextMenu
        selectable
      />
    </>
  );
}`;
