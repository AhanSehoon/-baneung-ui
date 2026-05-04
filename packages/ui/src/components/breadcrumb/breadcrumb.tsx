import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';

import { cn } from '../../lib/cn';

/**
 * Breadcrumb — 페이지 위계 네비게이션.
 *
 * - 시맨틱: `<nav aria-label="Breadcrumb">` + `<ol>` + `<li>`
 * - 마지막 항목은 `<BreadcrumbCurrent>`로 감싸 `aria-current="page"` 부여
 * - 항목 사이 separator는 `<BreadcrumbSeparator>` (기본 "/", `children`으로 화살표 등 교체 가능)
 *
 * @example
 *   <Breadcrumb>
 *     <BreadcrumbList>
 *       <BreadcrumbItem><BreadcrumbLink href="/">홈</BreadcrumbLink></BreadcrumbItem>
 *       <BreadcrumbSeparator />
 *       <BreadcrumbItem><BreadcrumbLink href="/products">제품</BreadcrumbLink></BreadcrumbItem>
 *       <BreadcrumbSeparator />
 *       <BreadcrumbItem><BreadcrumbCurrent>상세</BreadcrumbCurrent></BreadcrumbItem>
 *     </BreadcrumbList>
 *   </Breadcrumb>
 */
const BreadcrumbRoot = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  function Breadcrumb({ className, ...props }, ref) {
    return (
      <nav ref={ref} aria-label="Breadcrumb" className={cn('text-sm', className)} {...props} />
    );
  },
);
BreadcrumbRoot.displayName = 'Breadcrumb';

export const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.HTMLAttributes<HTMLOListElement>
>(function BreadcrumbList({ className, ...props }, ref) {
  return (
    <ol
      ref={ref}
      className={cn('flex flex-wrap items-center gap-1.5 text-foreground-muted', className)}
      {...props}
    />
  );
});
BreadcrumbList.displayName = 'BreadcrumbList';

export const BreadcrumbItem = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
  function BreadcrumbItem({ className, ...props }, ref) {
    return <li ref={ref} className={cn('inline-flex items-center', className)} {...props} />;
  },
);
BreadcrumbItem.displayName = 'BreadcrumbItem';

interface BreadcrumbLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  asChild?: boolean;
}

export const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  function BreadcrumbLink({ className, asChild = false, ...props }, ref) {
    const Comp = asChild ? Slot : 'a';
    return (
      <Comp
        ref={ref}
        className={cn(
          'transition-colors duration-fast ease-standard',
          'hover:text-foreground focus-visible:text-foreground',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          className,
        )}
        {...props}
      />
    );
  },
);
BreadcrumbLink.displayName = 'BreadcrumbLink';

export const BreadcrumbCurrent = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(function BreadcrumbCurrent({ className, ...props }, ref) {
  return (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn('text-foreground font-medium', className)}
      {...props}
    />
  );
});
BreadcrumbCurrent.displayName = 'BreadcrumbCurrent';

type BreadcrumbSeparatorProps = React.HTMLAttributes<HTMLLIElement>;

export const BreadcrumbSeparator = React.forwardRef<HTMLLIElement, BreadcrumbSeparatorProps>(
  function BreadcrumbSeparator({ className, children, ...props }, ref) {
    return (
      <li
        ref={ref}
        role="presentation"
        aria-hidden="true"
        className={cn('text-foreground-subtle', className)}
        {...props}
      >
        {children ?? '/'}
      </li>
    );
  },
);
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

/**
 * 합성 패턴 dot 표기.
 */
type BreadcrumbComponent = typeof BreadcrumbRoot & {
  List: typeof BreadcrumbList;
  Item: typeof BreadcrumbItem;
  Link: typeof BreadcrumbLink;
  Current: typeof BreadcrumbCurrent;
  Separator: typeof BreadcrumbSeparator;
};

export const Breadcrumb = BreadcrumbRoot as BreadcrumbComponent;
Breadcrumb.List = BreadcrumbList;
Breadcrumb.Item = BreadcrumbItem;
Breadcrumb.Link = BreadcrumbLink;
Breadcrumb.Current = BreadcrumbCurrent;
Breadcrumb.Separator = BreadcrumbSeparator;
