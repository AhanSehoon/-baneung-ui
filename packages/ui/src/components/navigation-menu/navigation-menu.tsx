import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import * as React from 'react';

import { cn } from '../../lib/cn';

/**
 * NavigationMenu — Radix NavigationMenu 기반 드롭다운 네비게이션.
 *
 * - 키보드: ←→ Item 이동, ↓ Trigger 열기, Esc 닫기
 * - 한 번에 하나의 메뉴만 열림 (Radix가 자동 처리)
 * - Viewport는 모든 Content가 공유하는 단일 컨테이너 (애니메이션 부드러움)
 */
const NavigationMenuRoot = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(function NavigationMenu({ className, children, ...props }, ref) {
  return (
    <NavigationMenuPrimitive.Root
      ref={ref}
      className={cn('relative z-10 flex max-w-max flex-1 items-center justify-center', className)}
      {...props}
    >
      {children}
      <NavigationMenuViewport />
    </NavigationMenuPrimitive.Root>
  );
});
NavigationMenuRoot.displayName = 'NavigationMenu';

export const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(function NavigationMenuList({ className, ...props }, ref) {
  return (
    <NavigationMenuPrimitive.List
      ref={ref}
      className={cn('flex flex-1 list-none items-center justify-center gap-1', className)}
      {...props}
    />
  );
});
NavigationMenuList.displayName = 'NavigationMenuList';

export const NavigationMenuItem = NavigationMenuPrimitive.Item;

export const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(function NavigationMenuTrigger({ className, children, ...props }, ref) {
  return (
    <NavigationMenuPrimitive.Trigger
      ref={ref}
      className={cn(
        'group inline-flex h-10 cursor-pointer items-center gap-1 px-3 text-sm font-medium',
        'bg-canvas text-foreground rounded-none',
        'border border-border-default',
        'hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        'data-[state=open]:bg-surface-strong data-[state=open]:border-border-strong',
        'transition-colors duration-fast ease-standard',
        className,
      )}
      {...props}
    >
      {children}
      <span
        aria-hidden="true"
        className="text-xs opacity-60 transition-transform group-data-[state=open]:rotate-180"
      >
        ▾
      </span>
    </NavigationMenuPrimitive.Trigger>
  );
});
NavigationMenuTrigger.displayName = 'NavigationMenuTrigger';

export const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(function NavigationMenuContent({ className, ...props }, ref) {
  return (
    <NavigationMenuPrimitive.Content
      ref={ref}
      className={cn(
        'absolute left-0 top-0 w-full',
        'data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out',
        'data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out',
        className,
      )}
      {...props}
    />
  );
});
NavigationMenuContent.displayName = 'NavigationMenuContent';

export const NavigationMenuLink = NavigationMenuPrimitive.Link;

export const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(function NavigationMenuViewport({ className, ...props }, ref) {
  return (
    <div className="absolute left-0 top-full flex justify-center">
      <NavigationMenuPrimitive.Viewport
        ref={ref}
        className={cn(
          'origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)]',
          'w-full overflow-hidden bg-canvas text-foreground',
          'border border-border-default rounded-none shadow-md',
          'md:w-[var(--radix-navigation-menu-viewport-width)]',
          className,
        )}
        {...props}
      />
    </div>
  );
});
NavigationMenuViewport.displayName = 'NavigationMenuViewport';

export const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(function NavigationMenuIndicator({ className, ...props }, ref) {
  return (
    <NavigationMenuPrimitive.Indicator
      ref={ref}
      className={cn(
        'top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden',
        'data-[state=visible]:animate-in data-[state=hidden]:animate-out',
        'data-[state=visible]:fade-in data-[state=hidden]:fade-out',
        className,
      )}
      {...props}
    >
      <span className="relative top-[60%] block size-2 rotate-45 bg-border-default" />
    </NavigationMenuPrimitive.Indicator>
  );
});
NavigationMenuIndicator.displayName = 'NavigationMenuIndicator';

/**
 * 합성 패턴 dot 표기.
 */
type NavigationMenuComponent = typeof NavigationMenuRoot & {
  List: typeof NavigationMenuList;
  Item: typeof NavigationMenuItem;
  Trigger: typeof NavigationMenuTrigger;
  Content: typeof NavigationMenuContent;
  Link: typeof NavigationMenuLink;
  Viewport: typeof NavigationMenuViewport;
  Indicator: typeof NavigationMenuIndicator;
};

export const NavigationMenu = NavigationMenuRoot as NavigationMenuComponent;
NavigationMenu.List = NavigationMenuList;
NavigationMenu.Item = NavigationMenuItem;
NavigationMenu.Trigger = NavigationMenuTrigger;
NavigationMenu.Content = NavigationMenuContent;
NavigationMenu.Link = NavigationMenuLink;
NavigationMenu.Viewport = NavigationMenuViewport;
NavigationMenu.Indicator = NavigationMenuIndicator;
