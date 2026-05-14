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
// Demo 5: 외부 페이지네이션 (controlled + showPagination=false)
// ─────────────────────────────────────────────────────────────────────────────

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
                  ['getRowId', '(row, idx) => string | number', '-', '행 키 추출 함수'],
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

      {/* Roadmap */}
      <Card>
        <CardHeader>
          <CardTitle>로드맵</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-foreground-muted">
            <li>
              <strong>v0.2</strong>: 빌트인 렌더러 (number-comma, date, dropdown, icon)
            </li>
            <li>
              <strong>v0.3</strong>: 더블클릭 인라인 편집 + ref API (saved/changed/deleted 추적)
            </li>
            <li>
              <strong>v0.4</strong>: 정렬·필터·다중 선택·컬럼 리사이즈
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
