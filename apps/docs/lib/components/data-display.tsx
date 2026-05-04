'use client';

import * as React from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  type ColumnDef,
  DataTable,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@baneung-pack/ui';

import type { ComponentSpec } from './_types';

interface UserRow {
  id: string;
  name: string;
  email: string;
  age: number;
}

const userColumns: ColumnDef<UserRow, unknown>[] = [
  { accessorKey: 'name', header: '이름' },
  { accessorKey: 'email', header: '이메일' },
  { accessorKey: 'age', header: '나이' },
];

const userData: UserRow[] = [
  { id: '1', name: '홍길동', email: 'hong@example.com', age: 30 },
  { id: '2', name: '김철수', email: 'kim@example.com', age: 25 },
  { id: '3', name: '이영희', email: 'lee@example.com', age: 28 },
];

function CollapsibleExample() {
  const [open, setOpen] = React.useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="outline">{open ? '접기' : '더 보기'}</Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3 text-sm text-foreground-muted">
        펼쳐진 추가 정보 — 더 자세한 설명을 여기에 표시합니다.
      </CollapsibleContent>
    </Collapsible>
  );
}

export const dataDisplayComponents: ComponentSpec[] = [
  {
    slug: 'accordion',
    title: 'Accordion',
    category: 'Data Display',
    description: 'Radix Accordion. type single/multiple, collapsible. ↑↓로 트리거 이동.',
    importPath:
      "import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@baneung-pack/ui';",
    subpath: "import { Accordion } from '@baneung-pack/ui/accordion';",
    Example: () => (
      <Accordion type="single" collapsible>
        <AccordionItem value="q1">
          <AccordionTrigger>접근성을 어디까지 보장하나요?</AccordionTrigger>
          <AccordionContent>
            모든 컴포넌트는 WCAG 2.1 AA를 충족합니다. axe-core 자동 검사가 CI에 포함됩니다.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="q2">
          <AccordionTrigger>다크 모드는?</AccordionTrigger>
          <AccordionContent>
            <code className="font-mono text-xs">data-theme=&quot;dark&quot;</code>를 html에 부여하면
            토큰이 자동 cascade.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="q3">
          <AccordionTrigger>한글 IME는?</AccordionTrigger>
          <AccordionContent>
            useComposition 훅으로 조합 중 Enter는 submit하지 않습니다.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
    code: `import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@baneung-pack/ui';

<Accordion type="single" collapsible>
  <AccordionItem value="q1">
    <AccordionTrigger>접근성을 어디까지 보장하나요?</AccordionTrigger>
    <AccordionContent>
      모든 컴포넌트는 WCAG 2.1 AA를 충족합니다.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="q2">
    <AccordionTrigger>다크 모드는?</AccordionTrigger>
    <AccordionContent>
      <code>data-theme="dark"</code>를 html에 부여하면 토큰이 자동 cascade.
    </AccordionContent>
  </AccordionItem>
</Accordion>`,
    api: [
      { property: 'type (Root)', description: '선택 모드', type: "'single' | 'multiple'" },
      {
        property: 'collapsible (Root)',
        description: 'single 모드에서 모두 닫힘 허용',
        type: 'boolean',
        default: 'false',
      },
      {
        property: 'value / defaultValue (Root)',
        description: '열린 항목',
        type: 'string | string[]',
      },
      { property: 'onValueChange (Root)', description: '변경 콜백', type: '(value) => void' },
    ],
  },
  {
    slug: 'collapsible',
    title: 'Collapsible',
    category: 'Data Display',
    description: 'Radix Collapsible. 단일 영역의 단순 fold/unfold.',
    importPath:
      "import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@baneung-pack/ui';",
    subpath: "import { Collapsible } from '@baneung-pack/ui/collapsible';",
    Example: CollapsibleExample,
    code: `import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  Button,
} from '@baneung-pack/ui';

const [open, setOpen] = useState(false);

<Collapsible open={open} onOpenChange={setOpen}>
  <CollapsibleTrigger asChild>
    <Button variant="outline">{open ? '접기' : '더 보기'}</Button>
  </CollapsibleTrigger>
  <CollapsibleContent>
    펼쳐진 추가 정보
  </CollapsibleContent>
</Collapsible>`,
    api: [
      { property: 'open (Root)', description: 'controlled', type: 'boolean' },
      {
        property: 'defaultOpen (Root)',
        description: 'uncontrolled 초기',
        type: 'boolean',
        default: 'false',
      },
      {
        property: 'onOpenChange (Root)',
        description: '변경 콜백',
        type: '(open: boolean) => void',
      },
      { property: 'disabled (Root)', description: '비활성', type: 'boolean', default: 'false' },
    ],
  },
  {
    slug: 'table',
    title: 'Table',
    category: 'Data Display',
    description: '시맨틱 <table> 래퍼 + Header/Body/Footer/Row/Head/Cell/Caption.',
    importPath:
      "import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from '@baneung-pack/ui';",
    subpath: "import { Table } from '@baneung-pack/ui/table';",
    Example: () => (
      <Table>
        <TableCaption>월간 매출</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>월</TableHead>
            <TableHead className="text-right">매출</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>1월</TableCell>
            <TableCell className="text-right">₩12,000,000</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>2월</TableCell>
            <TableCell className="text-right">₩14,500,000</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>3월</TableCell>
            <TableCell className="text-right">₩13,200,000</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    ),
    code: `import {
  Table,
  TableCaption,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@baneung-pack/ui';

<Table>
  <TableCaption>월간 매출</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>월</TableHead>
      <TableHead className="text-right">매출</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {rows.map((row) => (
      <TableRow key={row.month}>
        <TableCell>{row.month}</TableCell>
        <TableCell className="text-right">{row.revenue}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>`,
    api: [
      {
        property: 'children',
        description: 'TableHeader / TableBody / TableFooter / TableCaption',
        type: 'ReactNode',
      },
    ],
  },
  {
    slug: 'data-table',
    title: 'DataTable',
    category: 'Data Display',
    description:
      '@tanstack/react-table 기반. 정렬/페이지네이션/선택/컬럼 가시성, 빈 데이터 시 Empty 자동, controlled/uncontrolled.',
    importPath: "import { DataTable, type ColumnDef } from '@baneung-pack/ui';",
    subpath: "import { DataTable } from '@baneung-pack/ui/data-table';",
    Example: () => <DataTable columns={userColumns} data={userData} />,
    code: `import { DataTable, type ColumnDef } from '@baneung-pack/ui';

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

const columns: ColumnDef<User>[] = [
  { accessorKey: 'name', header: '이름' },
  { accessorKey: 'email', header: '이메일' },
  { accessorKey: 'age', header: '나이' },
];

<DataTable
  columns={columns}
  data={users}
  emptyTitle="사용자가 없습니다"
  emptyDescription="새 사용자를 추가하세요"
/>`,
    api: [
      {
        property: 'columns',
        description: 'ColumnDef 배열 (tanstack-table)',
        type: 'ColumnDef<TData>[]',
      },
      { property: 'data', description: '행 데이터', type: 'TData[]' },
      {
        property: 'sorting / onSortingChange',
        description: '정렬 controlled',
        type: 'SortingState / OnChangeFn',
      },
      { property: 'defaultSorting', description: '정렬 uncontrolled 초기값', type: 'SortingState' },
      {
        property: 'pagination / onPaginationChange',
        description: '페이지네이션 controlled',
        type: 'PaginationState / OnChangeFn',
      },
      {
        property: 'pageCount',
        description: '서버 사이드 모드 — 총 페이지 수 (지정 시 manualPagination)',
        type: 'number',
      },
      {
        property: 'rowSelection / onRowSelectionChange',
        description: '행 선택',
        type: 'RowSelectionState / OnChangeFn',
      },
      {
        property: 'columnVisibility / onColumnVisibilityChange',
        description: '컬럼 가시성',
        type: 'VisibilityState / OnChangeFn',
      },
      {
        property: 'showPagination',
        description: '페이지네이션 컨트롤 표시',
        type: 'boolean',
        default: 'true',
      },
      { property: 'emptyTitle / emptyDescription', description: '빈 상태 텍스트', type: 'string' },
      { property: 'getRowId', description: '커스텀 행 id 생성기', type: '(row, index) => string' },
    ],
  },
  {
    slug: 'carousel',
    title: 'Carousel',
    category: 'Data Display',
    description: 'embla-carousel-react 기반. ARIA carousel 패턴, ←→/↑↓ 키, 스와이프(터치) 자동.',
    importPath:
      "import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@baneung-pack/ui';",
    subpath: "import { Carousel } from '@baneung-pack/ui/carousel';",
    Example: () => (
      <Carousel className="w-full max-w-md">
        <CarouselContent>
          {[1, 2, 3, 4].map((n) => (
            <CarouselItem key={n}>
              <div className="flex h-32 items-center justify-center border border-border-default text-2xl font-semibold text-foreground-muted">
                슬라이드 {n}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="mt-3 flex gap-2">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </Carousel>
    ),
    code: `import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@baneung-pack/ui';

<Carousel opts={{ loop: true }}>
  <CarouselContent>
    {slides.map((slide) => (
      <CarouselItem key={slide.id}>
        <img src={slide.src} alt={slide.alt} />
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>`,
    api: [
      { property: 'opts', description: 'embla 옵션 (loop, align, ...)', type: 'EmblaOptionsType' },
      {
        property: 'orientation',
        description: '방향',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
      },
      {
        property: 'setApi',
        description: 'embla API 노출 콜백 (외부 제어)',
        type: '(api: CarouselApi) => void',
      },
    ],
  },
];
