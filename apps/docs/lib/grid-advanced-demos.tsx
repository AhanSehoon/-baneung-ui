'use client';

import * as React from 'react';

import { Grid, type GridColumn, type GridHandle } from '@baneung-pack/grid';
import { Badge, Button, Input, Muted } from '@baneung-pack/ui';

/**
 * Phase 1·2 추가 기능 데모 모음.
 * - quickFilter (전역 검색)
 * - 다중 컬럼 정렬 (Shift+클릭)
 * - 컬럼 리사이즈
 * - 컬럼 표시/숨김 (showColumnMenu)
 * - 컬럼 고정 (pin left/right)
 * - 집계 푸터 (showFooter)
 * - 조건부 셀 스타일 (cellStyle/cellClassName)
 * - XLSX 내보내기
 * - Excel 호환 Ctrl+C/V 클립보드
 */

// ─────────────────────────────────────────────────────────────────────────────
// 공통 데이터 — 주문 샘플 (대용량 관리 화면 시나리오)
// ─────────────────────────────────────────────────────────────────────────────

interface Order {
  id: number;
  customer: string;
  product: string;
  category: '전자제품' | '의류' | '식품';
  qty: number;
  price: number;
  discount: number;
  payment: '카드' | '계좌이체' | '간편결제';
  shipping: string;
  memo: string;
  status: '대기' | '배송중' | '완료' | '취소';
  date: string;
}

const sampleOrders: Order[] = [
  {
    id: 1001,
    customer: '김민수',
    product: 'iPhone 17',
    category: '전자제품',
    qty: 1,
    price: 1450000,
    discount: 50000,
    payment: '카드',
    shipping: '서울 강남구 테헤란로 123',
    memo: '문 앞에 놓아주세요',
    status: '완료',
    date: '2026-06-01',
  },
  {
    id: 1002,
    customer: '이지은',
    product: '나이키 운동화',
    category: '의류',
    qty: 2,
    price: 89000,
    discount: 0,
    payment: '간편결제',
    shipping: '경기 성남시 분당구 판교로 45',
    memo: '',
    status: '배송중',
    date: '2026-06-03',
  },
  {
    id: 1003,
    customer: '박철호',
    product: '삼성 모니터',
    category: '전자제품',
    qty: 1,
    price: 320000,
    discount: 30000,
    payment: '카드',
    shipping: '부산 해운대구 우동 555',
    memo: '경비실에 맡겨주세요',
    status: '완료',
    date: '2026-06-05',
  },
  {
    id: 1004,
    customer: '최영희',
    product: '유기농 쌀 10kg',
    category: '식품',
    qty: 3,
    price: 45000,
    discount: 5000,
    payment: '계좌이체',
    shipping: '대구 수성구 동대구로 88',
    memo: '',
    status: '대기',
    date: '2026-06-10',
  },
  {
    id: 1005,
    customer: '정민재',
    product: '아디다스 후디',
    category: '의류',
    qty: 1,
    price: 79000,
    discount: 0,
    payment: '간편결제',
    shipping: '인천 연수구 컨벤시아대로 12',
    memo: '교환 요청 대기 중',
    status: '취소',
    date: '2026-06-12',
  },
  {
    id: 1006,
    customer: '강수연',
    product: 'AirPods Pro',
    category: '전자제품',
    qty: 2,
    price: 359000,
    discount: 20000,
    payment: '카드',
    shipping: '광주 서구 상무대로 77',
    memo: '',
    status: '완료',
    date: '2026-06-14',
  },
  {
    id: 1007,
    customer: '윤지호',
    product: '한우 등심 1kg',
    category: '식품',
    qty: 1,
    price: 120000,
    discount: 10000,
    payment: '계좌이체',
    shipping: '대전 유성구 대학로 99',
    memo: '신선식품 — 빠른 배송 부탁',
    status: '배송중',
    date: '2026-06-15',
  },
  {
    id: 1008,
    customer: '한가영',
    product: '갤럭시 워치',
    category: '전자제품',
    qty: 1,
    price: 280000,
    discount: 0,
    payment: '간편결제',
    shipping: '서울 마포구 월드컵북로 222',
    memo: '',
    status: '완료',
    date: '2026-06-16',
  },
];

const statusVariant: Record<Order['status'], 'secondary' | 'outline' | 'danger'> = {
  대기: 'outline',
  배송중: 'secondary',
  완료: 'secondary',
  취소: 'danger',
};

// ─────────────────────────────────────────────────────────────────────────────
// Demo: 전역 검색 (quickFilter)
// ─────────────────────────────────────────────────────────────────────────────

const orderColumns: GridColumn<Order>[] = [
  { id: 'id', header: '주문번호', accessor: 'id', width: 90, align: 'right', sortable: true },
  { id: 'customer', header: '고객명', accessor: 'customer', width: 100, sortable: true },
  { id: 'product', header: '상품', accessor: 'product', sortable: true },
  { id: 'category', header: '카테고리', accessor: 'category', width: 100, sortable: true },
  { id: 'qty', header: '수량', accessor: 'qty', width: 60, align: 'right', sortable: true },
  {
    id: 'price',
    header: '가격',
    accessor: 'price',
    width: 110,
    align: 'right',
    sortable: true,
    renderer: (v) => `${(v as number).toLocaleString()}원`,
  },
  {
    id: 'status',
    header: '상태',
    accessor: 'status',
    width: 90,
    renderer: (v) => (
      <Badge variant={statusVariant[v as Order['status']]}>{v as React.ReactNode}</Badge>
    ),
  },
  { id: 'date', header: '주문일', accessor: 'date', width: 110, sortable: true },
];

export function QuickFilterDemo() {
  const [q, setQ] = React.useState('');
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 border border-border-default bg-surface px-3 py-2">
        <Muted className="text-xs">전역 검색:</Muted>
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="모든 컬럼 검색 (고객명·상품·상태 등)"
          className="max-w-xs"
        />
      </div>
      <Grid columns={orderColumns} data={sampleOrders} quickFilter={q} getRowId={(r) => r.id} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Demo: 다중 컬럼 정렬 + 컬럼 리사이즈
// ─────────────────────────────────────────────────────────────────────────────

export function MultiSortResizeDemo() {
  return (
    <div className="flex flex-col gap-3">
      <Muted className="text-xs">
        💡 헤더 클릭 = 단일 정렬, <strong>Shift+클릭</strong> = 다중 정렬 추가. 헤더 우측 경계
        드래그로 컬럼 폭 조절.
      </Muted>
      <Grid
        columns={orderColumns}
        data={sampleOrders}
        getRowId={(r) => r.id}
        resizable
        onColumnResize={(colId, w) => {
          // 실 사용 시 localStorage에 저장
          // localStorage.setItem(`grid-w-${colId}`, String(w));
          void colId;
          void w;
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Demo: 컬럼 표시/숨김 (showColumnMenu)
// ─────────────────────────────────────────────────────────────────────────────

export function ColumnVisibilityDemo() {
  return (
    <div className="flex flex-col gap-3">
      <Muted className="text-xs">💡 우상단 ⚙ 컬럼 버튼 → 체크박스로 컬럼 표시/숨김 토글.</Muted>
      <Grid columns={orderColumns} data={sampleOrders} getRowId={(r) => r.id} showColumnMenu />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Demo: 컬럼 고정 (Pin Left/Right)
// ─────────────────────────────────────────────────────────────────────────────

const pinnedColumns: GridColumn<Order>[] = [
  { id: 'id', header: '주문번호', accessor: 'id', width: 90, align: 'right', pin: 'left' },
  { id: 'customer', header: '고객명', accessor: 'customer', width: 100, pin: 'left' },
  { id: 'product', header: '상품', accessor: 'product', width: 180 },
  { id: 'category', header: '카테고리', accessor: 'category', width: 100 },
  { id: 'qty', header: '수량', accessor: 'qty', width: 70, align: 'right' },
  {
    id: 'price',
    header: '가격',
    accessor: 'price',
    width: 120,
    align: 'right',
    renderer: (v) => `${(v as number).toLocaleString()}원`,
  },
  {
    id: 'discount',
    header: '할인',
    accessor: 'discount',
    width: 90,
    align: 'right',
    renderer: (v) => ((v as number) > 0 ? `-${(v as number).toLocaleString()}원` : '-'),
  },
  { id: 'payment', header: '결제수단', accessor: 'payment', width: 100 },
  { id: 'shipping', header: '배송지', accessor: 'shipping', width: 240 },
  { id: 'memo', header: '메모', accessor: 'memo', width: 180 },
  { id: 'date', header: '주문일', accessor: 'date', width: 110 },
  {
    id: 'status',
    header: '상태',
    accessor: 'status',
    width: 90,
    pin: 'right',
    renderer: (v) => (
      <Badge variant={statusVariant[v as Order['status']]}>{v as React.ReactNode}</Badge>
    ),
  },
];

export function PinnedColumnsDemo() {
  return (
    <div className="flex flex-col gap-3">
      <Muted className="text-xs">
        💡 가로 스크롤 시 좌측 (주문번호·고객명) + 우측 (상태) 컬럼 고정. 안쪽 경계에 옅은 그림자.
      </Muted>
      {/* 그리드는 부모 폭을 100% 사용. 컬럼 합계 폭이 더 크면 내부 가로 스크롤 활성. */}
      <Grid columns={pinnedColumns} data={sampleOrders} getRowId={(r) => r.id} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Demo: 집계 푸터 (showFooter + aggregate)
// ─────────────────────────────────────────────────────────────────────────────

const aggregateColumns: GridColumn<Order>[] = [
  { id: 'id', header: '주문번호', accessor: 'id', width: 90, align: 'right', aggregate: 'count' },
  { id: 'customer', header: '고객명', accessor: 'customer', width: 100 },
  { id: 'product', header: '상품', accessor: 'product' },
  { id: 'qty', header: '수량', accessor: 'qty', width: 80, align: 'right', aggregate: 'sum' },
  {
    id: 'price',
    header: '가격',
    accessor: 'price',
    width: 220,
    align: 'right',
    renderer: (v) => `${(v as number).toLocaleString()}원`,
    aggregate: (rows: Order[]) => {
      const total = rows.reduce((s, r) => s + r.price * r.qty, 0);
      return <strong>합계: {total.toLocaleString()}원</strong>;
    },
  },
];

export function FooterAggregateDemo() {
  return (
    <div className="flex flex-col gap-3">
      <Muted className="text-xs">
        💡 푸터 행: 주문번호=count, 수량=sum, 가격=함수형 집계(qty×price 합).
      </Muted>
      <Grid columns={aggregateColumns} data={sampleOrders} showFooter getRowId={(r) => r.id} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Demo: 조건부 셀 스타일 (cellStyle / cellClassName)
// ─────────────────────────────────────────────────────────────────────────────

const styledColumns: GridColumn<Order>[] = [
  { id: 'id', header: '주문번호', accessor: 'id', width: 90, align: 'right' },
  { id: 'customer', header: '고객명', accessor: 'customer', width: 100 },
  { id: 'product', header: '상품', accessor: 'product' },
  {
    id: 'price',
    header: '가격',
    accessor: 'price',
    width: 130,
    align: 'right',
    renderer: (v) => `${(v as number).toLocaleString()}원`,
    // 30만원 초과는 굵게 + 진한 색, 50만원 초과는 배경까지
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
    width: 100,
    cellClassName: (v) =>
      v === '취소' ? 'text-danger' : v === '완료' ? 'text-success' : undefined,
  },
];

export function ConditionalStyleDemo() {
  return (
    <div className="flex flex-col gap-3">
      <Muted className="text-xs">
        💡 가격 50만+ 빨강 배경, 30만+ 굵게. 상태 완료=초록, 취소=빨강 (Excel 조건부 서식 패턴).
      </Muted>
      <Grid columns={styledColumns} data={sampleOrders} getRowId={(r) => r.id} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Demo: XLSX 내보내기 + Excel 호환 Ctrl+C/V 클립보드
// ─────────────────────────────────────────────────────────────────────────────

const editableOrderColumns: GridColumn<Order>[] = [
  { id: 'id', header: '주문번호', accessor: 'id', width: 90, align: 'right' },
  { id: 'customer', header: '고객명', accessor: 'customer', width: 100, editable: true },
  { id: 'product', header: '상품', accessor: 'product', editable: true },
  {
    id: 'qty',
    header: '수량',
    accessor: 'qty',
    width: 80,
    align: 'right',
    editable: true,
    editor: 'number',
  },
  {
    id: 'price',
    header: '가격',
    accessor: 'price',
    width: 130,
    align: 'right',
    editable: true,
    editor: 'number',
    renderer: (v) => `${(v as number).toLocaleString()}원`,
  },
  { id: 'date', header: '주문일', accessor: 'date', width: 130, editable: true, editor: 'date' },
];

export function ExcelIntegrationDemo() {
  const ref = React.useRef<GridHandle<Order>>(null);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2 border border-border-default bg-surface px-3 py-2">
        <Muted className="text-xs">Excel 워크플로:</Muted>
        <div className="grow" />
        <Button
          size="sm"
          variant="outline"
          onClick={() => ref.current?.exportXlsx({ filename: 'orders.xlsx', sheetName: '주문' })}
        >
          XLSX로 내보내기
        </Button>
        <Button size="sm" variant="ghost" onClick={() => ref.current?.reset()}>
          되돌리기
        </Button>
      </div>
      <Muted className="text-xs">
        💡 셀 클릭/드래그 → <strong>Ctrl+C</strong>로 복사하면 Excel에 그대로 붙여넣기 가능.
        Excel에서 셀 범위 복사 후 그리드 셀에 <strong>Ctrl+V</strong>로 일괄 입력.
      </Muted>
      <Grid
        ref={ref}
        columns={editableOrderColumns}
        data={sampleOrders}
        getRowId={(r) => r.id}
        cellSelection="multi"
        clipboard
        clearOnDelete
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Demo: 모든 기능 통합 — 관리자 페이지 시나리오
// ─────────────────────────────────────────────────────────────────────────────

const adminColumns: GridColumn<Order>[] = [
  {
    id: 'id',
    header: '주문번호',
    accessor: 'id',
    width: 90,
    align: 'right',
    pin: 'left',
    sortable: true,
    aggregate: 'count',
  },
  {
    id: 'customer',
    header: '고객명',
    accessor: 'customer',
    width: 100,
    pin: 'left',
    sortable: true,
    filterable: true,
  },
  {
    id: 'product',
    header: '상품',
    accessor: 'product',
    editable: true,
    sortable: true,
    filterable: true,
  },
  {
    id: 'category',
    header: '카테고리',
    accessor: 'category',
    width: 100,
    sortable: true,
    filterable: true,
  },
  {
    id: 'qty',
    header: '수량',
    accessor: 'qty',
    width: 80,
    align: 'right',
    editable: true,
    editor: 'number',
    aggregate: 'sum',
  },
  {
    id: 'price',
    header: '가격',
    accessor: 'price',
    width: 130,
    align: 'right',
    sortable: true,
    editable: true,
    editor: 'number',
    renderer: (v) => `${(v as number).toLocaleString()}원`,
    cellStyle: (v) => ((v as number) > 500000 ? { fontWeight: 600 } : undefined),
    aggregate: 'sum',
  },
  {
    id: 'status',
    header: '상태',
    accessor: 'status',
    width: 100,
    pin: 'right',
    cellClassName: (v) =>
      v === '취소' ? 'text-danger' : v === '완료' ? 'text-success' : undefined,
    renderer: (v) => (
      <Badge variant={statusVariant[v as Order['status']]}>{v as React.ReactNode}</Badge>
    ),
  },
];

export function AdminAllInOneDemo() {
  const ref = React.useRef<GridHandle<Order>>(null);
  const [q, setQ] = React.useState('');
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2 border border-border-default bg-surface px-3 py-2">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="검색"
          className="max-w-xs"
        />
        <div className="grow" />
        <Button
          size="sm"
          variant="outline"
          onClick={() => ref.current?.exportXlsx({ filename: 'admin.xlsx' })}
        >
          XLSX
        </Button>
      </div>
      <Grid
        ref={ref}
        columns={adminColumns}
        data={sampleOrders}
        getRowId={(r) => r.id}
        quickFilter={q}
        resizable
        showColumnMenu
        showFooter
        cellSelection="multi"
        clipboard
        clearOnDelete
        selectable
      />
    </div>
  );
}
