import {
  type ColumnDef,
  type OnChangeFn,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type Table as TanstackTable,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';

import { cn } from '../../lib/cn';
import { Button } from '../button';
import { Empty, EmptyDescription, EmptyTitle } from '../empty';
import { Pagination } from '../pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../table';

export type { ColumnDef, SortingState, PaginationState, RowSelectionState, VisibilityState };

export interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];

  // 정렬 (controlled / uncontrolled 둘 다 지원 — 미지정 시 클라이언트 정렬)
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  defaultSorting?: SortingState;

  // 페이지네이션
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  defaultPagination?: PaginationState;
  /** 서버 사이드 페이지네이션 시 총 페이지 수. 클라이언트 모드에서는 자동 계산. */
  pageCount?: number;
  /** 페이지네이션 컨트롤 표시. 기본 true. */
  showPagination?: boolean;

  // 행 선택
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;

  // 컬럼 가시성
  columnVisibility?: VisibilityState;
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>;

  // 빈 상태
  emptyTitle?: string;
  emptyDescription?: string;

  /** 외부에서 row identifier를 만들고 싶을 때. */
  getRowId?: (row: TData, index: number) => string;

  className?: string;
}

/**
 * DataTable — @tanstack/react-table 기반 정렬/페이지네이션/선택 가능한 표.
 *
 * - controlled (서버 사이드) / uncontrolled (클라이언트) 둘 다 지원
 * - 빈 데이터일 때 `<Empty>`로 자동 폴백
 * - 페이지네이션 컨트롤은 [`Pagination`] 컴포넌트로 분리되어 있어 외부에서 재사용 가능
 *
 * 모바일 카드 모드 / 가상화 (`rowVirtualization`)는 후속 작업으로 남겨둡니다.
 */
export function DataTable<TData>({
  columns,
  data,
  sorting,
  onSortingChange,
  defaultSorting,
  pagination,
  onPaginationChange,
  defaultPagination,
  pageCount,
  showPagination = true,
  rowSelection,
  onRowSelectionChange,
  columnVisibility,
  onColumnVisibilityChange,
  emptyTitle = '데이터가 없습니다',
  emptyDescription = '표시할 항목이 없습니다.',
  getRowId,
  className,
}: DataTableProps<TData>): React.ReactElement {
  const [internalSorting, setInternalSorting] = React.useState<SortingState>(defaultSorting ?? []);
  const [internalPagination, setInternalPagination] = React.useState<PaginationState>(
    defaultPagination ?? { pageIndex: 0, pageSize: 10 },
  );
  const [internalRowSelection, setInternalRowSelection] = React.useState<RowSelectionState>({});
  const [internalColumnVisibility, setInternalColumnVisibility] = React.useState<VisibilityState>(
    {},
  );

  const isSortingControlled = sorting !== undefined;
  const isPaginationControlled = pagination !== undefined;
  const isSelectionControlled = rowSelection !== undefined;
  const isVisibilityControlled = columnVisibility !== undefined;

  const table: TanstackTable<TData> = useReactTable({
    data,
    columns,
    state: {
      sorting: isSortingControlled ? sorting : internalSorting,
      pagination: isPaginationControlled ? pagination : internalPagination,
      rowSelection: isSelectionControlled ? rowSelection : internalRowSelection,
      columnVisibility: isVisibilityControlled ? columnVisibility : internalColumnVisibility,
    },
    pageCount,
    onSortingChange: onSortingChange ?? setInternalSorting,
    onPaginationChange: onPaginationChange ?? setInternalPagination,
    onRowSelectionChange: onRowSelectionChange ?? setInternalRowSelection,
    onColumnVisibilityChange: onColumnVisibilityChange ?? setInternalColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // 클라이언트 페이지네이션은 pageCount 미지정 시
    getPaginationRowModel: pageCount === undefined ? getPaginationRowModel() : undefined,
    manualPagination: pageCount !== undefined,
    manualSorting: isSortingControlled,
    getRowId,
  });

  const rows = table.getRowModel().rows;
  const totalPages = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;

  if (data.length === 0) {
    return (
      <Empty>
        <EmptyTitle>{emptyTitle}</EmptyTitle>
        <EmptyDescription>{emptyDescription}</EmptyDescription>
      </Empty>
    );
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const sortDir = header.column.getIsSorted();
                const canSort = header.column.getCanSort();
                return (
                  <TableHead
                    key={header.id}
                    aria-sort={
                      sortDir === 'asc' ? 'ascending' : sortDir === 'desc' ? 'descending' : 'none'
                    }
                    style={{ width: header.getSize() === 150 ? undefined : header.getSize() }}
                  >
                    {header.isPlaceholder ? null : canSort ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={header.column.getToggleSortingHandler()}
                        className="-ml-3 h-8 px-2 font-medium text-foreground-muted hover:text-foreground"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <span aria-hidden="true" className="ml-1 text-xs">
                          {sortDir === 'asc' ? '↑' : sortDir === 'desc' ? '↓' : '↕'}
                        </span>
                      </Button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} data-state={row.getIsSelected() ? 'selected' : undefined}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {showPagination && totalPages > 1 ? (
        <Pagination
          page={currentPage}
          total={totalPages}
          onPageChange={(p): void => table.setPageIndex(p - 1)}
        />
      ) : null}
    </div>
  );
}
