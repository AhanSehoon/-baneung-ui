import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as React from 'react';

import { cn } from '../../lib/cn';

/**
 * DropdownMenu — Radix DropdownMenu 기반.
 *
 * - 키보드: ↑↓ 항목 이동, Enter 선택, Esc 닫기, ← 서브메뉴 닫기, → 서브메뉴 열기
 * - 체크박스/라디오 항목, 서브메뉴, 단축키 라벨 모두 지원
 */
export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
export const DropdownMenuGroup = DropdownMenuPrimitive.Group;
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

// Sub 메뉴는 내부 context를 가지므로 직접 re-export 시 TS2742 위험. 함수 래퍼로 감쌉니다.
export function DropdownMenuSub(
  props: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Sub>,
): React.ReactElement {
  return <DropdownMenuPrimitive.Sub {...props} />;
}

export const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger>
>(function DropdownMenuSubTrigger({ className, children, ...props }, ref) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      ref={ref}
      className={cn(
        'flex cursor-default select-none items-center gap-2 px-2 py-1.5 text-sm rounded-none outline-none',
        'data-[highlighted]:bg-surface-strong data-[state=open]:bg-surface-strong',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-60',
        className,
      )}
      {...props}
    >
      {children}
      <span aria-hidden="true" className="ml-auto text-foreground-subtle">
        ›
      </span>
    </DropdownMenuPrimitive.SubTrigger>
  );
});
DropdownMenuSubTrigger.displayName = 'DropdownMenuSubTrigger';

export const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(function DropdownMenuSubContent({ className, ...props }, ref) {
  return (
    <DropdownMenuPrimitive.SubContent
      ref={ref}
      className={cn(
        'z-50 min-w-44 p-1',
        'bg-canvas text-foreground border border-border-default rounded-none shadow-md',
        className,
      )}
      {...props}
    />
  );
});
DropdownMenuSubContent.displayName = 'DropdownMenuSubContent';

export const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(function DropdownMenuContent({ className, sideOffset = 4, ...props }, ref) {
  return (
    <DropdownMenuPortal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          'z-50 min-w-44 p-1',
          'bg-canvas text-foreground border border-border-default rounded-none shadow-md',
          className,
        )}
        {...props}
      />
    </DropdownMenuPortal>
  );
});
DropdownMenuContent.displayName = 'DropdownMenuContent';

const itemBase = cn(
  'relative flex cursor-default select-none items-center gap-2',
  'px-2 py-1.5 text-sm rounded-none outline-none',
  'data-[highlighted]:bg-surface-strong data-[highlighted]:text-foreground',
  'data-[disabled]:pointer-events-none data-[disabled]:opacity-60',
);

export const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
>(function DropdownMenuItem({ className, ...props }, ref) {
  return <DropdownMenuPrimitive.Item ref={ref} className={cn(itemBase, className)} {...props} />;
});
DropdownMenuItem.displayName = 'DropdownMenuItem';

export const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(function DropdownMenuCheckboxItem({ className, children, checked, ...props }, ref) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      ref={ref}
      checked={checked}
      className={cn(itemBase, 'pl-7', className)}
      {...props}
    >
      <span className="absolute left-2 flex size-3 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>✓</DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
});
DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem';

export const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(function DropdownMenuRadioItem({ className, children, ...props }, ref) {
  return (
    <DropdownMenuPrimitive.RadioItem
      ref={ref}
      className={cn(itemBase, 'pl-7', className)}
      {...props}
    >
      <span className="absolute left-2 flex size-3 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>•</DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
});
DropdownMenuRadioItem.displayName = 'DropdownMenuRadioItem';

export const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>
>(function DropdownMenuLabel({ className, ...props }, ref) {
  return (
    <DropdownMenuPrimitive.Label
      ref={ref}
      className={cn('px-2 py-1.5 text-xs font-medium text-foreground-subtle', className)}
      {...props}
    />
  );
});
DropdownMenuLabel.displayName = 'DropdownMenuLabel';

export const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(function DropdownMenuSeparator({ className, ...props }, ref) {
  return (
    <DropdownMenuPrimitive.Separator
      ref={ref}
      className={cn('-mx-1 my-1 h-px bg-border-default', className)}
      {...props}
    />
  );
});
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

export const DropdownMenuShortcut = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(function DropdownMenuShortcut({ className, ...props }, ref) {
  return (
    <span
      ref={ref}
      className={cn('ml-auto text-xs tracking-wider text-foreground-subtle', className)}
      {...props}
    />
  );
});
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';
