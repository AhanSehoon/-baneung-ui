import * as MenubarPrimitive from '@radix-ui/react-menubar';
import * as React from 'react';

import { cn } from '../../lib/cn';

/**
 * Menubar — Radix Menubar 기반. 데스크톱 앱처럼 가로형 메뉴 (파일/편집/보기...).
 *
 * - 키보드: ←→ 메뉴 간 이동, ↓ 메뉴 열기, ↑↓ 항목 이동, Enter 선택, Esc 닫기
 * - 한 번에 하나의 메뉴만 열림 (Radix가 자동 처리)
 * - 서브메뉴 / 체크박스 / 라디오 항목 지원
 */
const MenubarRoot = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(function Menubar({ className, ...props }, ref) {
  return (
    <MenubarPrimitive.Root
      ref={ref}
      className={cn(
        'flex h-10 items-center gap-1 px-2',
        'bg-canvas text-foreground',
        'border border-border-default rounded-none',
        className,
      )}
      {...props}
    />
  );
});
MenubarRoot.displayName = 'Menubar';

// MenubarPrimitive.Menu의 추론 타입이 Radix 내부 모듈에 의존해 직접 re-export 시 TS2742가 발생.
// 함수형 래퍼로 감싸 타입 경계를 명확히 한다.
export function MenubarMenu(
  props: React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Menu>,
): React.ReactElement {
  return <MenubarPrimitive.Menu {...props} />;
}

export const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(function MenubarTrigger({ className, ...props }, ref) {
  return (
    <MenubarPrimitive.Trigger
      ref={ref}
      className={cn(
        'inline-flex select-none items-center px-3 py-1.5 text-sm font-medium',
        'rounded-none outline-none',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        'data-[highlighted]:bg-surface data-[state=open]:bg-surface-strong',
        'transition-colors duration-fast ease-standard',
        className,
      )}
      {...props}
    />
  );
});
MenubarTrigger.displayName = 'MenubarTrigger';

export const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(function MenubarContent(
  { className, align = 'start', alignOffset = -4, sideOffset = 8, ...props },
  ref,
) {
  return (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        ref={ref}
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          'z-50 min-w-48 overflow-hidden p-1',
          'bg-canvas text-foreground',
          'border border-border-default rounded-none shadow-md',
          className,
        )}
        {...props}
      />
    </MenubarPrimitive.Portal>
  );
});
MenubarContent.displayName = 'MenubarContent';

export const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item>
>(function MenubarItem({ className, ...props }, ref) {
  return (
    <MenubarPrimitive.Item
      ref={ref}
      className={cn(
        'relative flex cursor-default select-none items-center gap-2',
        'px-2 py-1.5 text-sm rounded-none outline-none',
        'data-[highlighted]:bg-surface-strong data-[highlighted]:text-foreground',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-60',
        className,
      )}
      {...props}
    />
  );
});
MenubarItem.displayName = 'MenubarItem';

export const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(function MenubarSeparator({ className, ...props }, ref) {
  return (
    <MenubarPrimitive.Separator
      ref={ref}
      className={cn('-mx-1 my-1 h-px bg-border-default', className)}
      {...props}
    />
  );
});
MenubarSeparator.displayName = 'MenubarSeparator';

export const MenubarShortcut = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(function MenubarShortcut({ className, ...props }, ref) {
  return (
    <span
      ref={ref}
      className={cn('ml-auto text-xs tracking-wider text-foreground-subtle', className)}
      {...props}
    />
  );
});
MenubarShortcut.displayName = 'MenubarShortcut';

/**
 * 합성 패턴 dot 표기.
 */
type MenubarComponent = typeof MenubarRoot & {
  Menu: typeof MenubarMenu;
  Trigger: typeof MenubarTrigger;
  Content: typeof MenubarContent;
  Item: typeof MenubarItem;
  Separator: typeof MenubarSeparator;
  Shortcut: typeof MenubarShortcut;
};

export const Menubar = MenubarRoot as MenubarComponent;
Menubar.Menu = MenubarMenu;
Menubar.Trigger = MenubarTrigger;
Menubar.Content = MenubarContent;
Menubar.Item = MenubarItem;
Menubar.Separator = MenubarSeparator;
Menubar.Shortcut = MenubarShortcut;
