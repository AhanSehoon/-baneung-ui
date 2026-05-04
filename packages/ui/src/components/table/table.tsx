import * as React from 'react';

import { cn } from '../../lib/cn';

/**
 * Table — 시맨틱 `<table>` 래퍼.
 *
 * - `<table>` + `<thead>`/`<tbody>`/`<tr>`/`<th>`/`<td>` 그대로 사용
 * - 정렬 헤더는 부모가 클릭 핸들러 + aria-sort를 제어 (DataTable이 자동화)
 * - 캡션 권장: `<TableCaption>`로 표 의미를 스크린리더에 전달
 *
 * @example
 *   <Table>
 *     <TableCaption>월간 매출</TableCaption>
 *     <TableHeader>
 *       <TableRow>
 *         <TableHead>월</TableHead>
 *         <TableHead className="text-right">매출</TableHead>
 *       </TableRow>
 *     </TableHeader>
 *     <TableBody>
 *       <TableRow>
 *         <TableCell>1월</TableCell>
 *         <TableCell className="text-right">1,200,000</TableCell>
 *       </TableRow>
 *     </TableBody>
 *   </Table>
 */
export const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  function Table({ className, ...props }, ref) {
    return (
      <div className="relative w-full overflow-auto">
        <table ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...props} />
      </div>
    );
  },
);
Table.displayName = 'Table';

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(function TableHeader({ className, ...props }, ref) {
  return (
    <thead
      ref={ref}
      className={cn('[&_tr]:border-b [&_tr]:border-border-default', className)}
      {...props}
    />
  );
});
TableHeader.displayName = 'TableHeader';

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(function TableBody({ className, ...props }, ref) {
  return <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />;
});
TableBody.displayName = 'TableBody';

export const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(function TableFooter({ className, ...props }, ref) {
  return (
    <tfoot
      ref={ref}
      className={cn('border-t border-border-default bg-surface font-medium', className)}
      {...props}
    />
  );
});
TableFooter.displayName = 'TableFooter';

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(function TableRow({ className, ...props }, ref) {
  return (
    <tr
      ref={ref}
      className={cn(
        'border-b border-border-default transition-colors duration-fast ease-standard',
        'hover:bg-surface',
        'data-[state=selected]:bg-surface-strong',
        className,
      )}
      {...props}
    />
  );
});
TableRow.displayName = 'TableRow';

export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(function TableHead({ className, ...props }, ref) {
  return (
    <th
      ref={ref}
      className={cn(
        'h-10 px-3 text-left align-middle text-xs font-medium text-foreground-muted',
        '[&:has([role=checkbox])]:pr-0',
        className,
      )}
      {...props}
    />
  );
});
TableHead.displayName = 'TableHead';

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(function TableCell({ className, ...props }, ref) {
  return (
    <td
      ref={ref}
      className={cn('p-3 align-middle [&:has([role=checkbox])]:pr-0', className)}
      {...props}
    />
  );
});
TableCell.displayName = 'TableCell';

export const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(function TableCaption({ className, ...props }, ref) {
  return (
    <caption ref={ref} className={cn('mt-4 text-sm text-foreground-muted', className)} {...props} />
  );
});
TableCaption.displayName = 'TableCaption';
