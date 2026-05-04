import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import * as React from 'react';

import { cn } from '../../lib/cn';

/**
 * ContextMenu — 우클릭(또는 long-press) 컨텍스트 메뉴.
 *
 * 키보드: 메뉴가 열린 후 ↑↓ 이동, Enter 선택, Esc 닫기.
 * `<ContextMenuTrigger>` 영역을 우클릭하면 열립니다.
 */
export const ContextMenu = ContextMenuPrimitive.Root;
export const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
export const ContextMenuPortal = ContextMenuPrimitive.Portal;
export const ContextMenuGroup = ContextMenuPrimitive.Group;
export const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

export function ContextMenuSub(
  props: React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Sub>,
): React.ReactElement {
  return <ContextMenuPrimitive.Sub {...props} />;
}

const itemBase = cn(
  'relative flex cursor-default select-none items-center gap-2',
  'px-2 py-1.5 text-sm rounded-none outline-none',
  'data-[highlighted]:bg-surface-strong data-[highlighted]:text-foreground',
  'data-[disabled]:pointer-events-none data-[disabled]:opacity-60',
);

export const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(function ContextMenuContent({ className, ...props }, ref) {
  return (
    <ContextMenuPortal>
      <ContextMenuPrimitive.Content
        ref={ref}
        className={cn(
          'z-50 min-w-44 p-1',
          'bg-canvas text-foreground border border-border-default rounded-none shadow-md',
          className,
        )}
        {...props}
      />
    </ContextMenuPortal>
  );
});
ContextMenuContent.displayName = 'ContextMenuContent';

export const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item>
>(function ContextMenuItem({ className, ...props }, ref) {
  return <ContextMenuPrimitive.Item ref={ref} className={cn(itemBase, className)} {...props} />;
});
ContextMenuItem.displayName = 'ContextMenuItem';

export const ContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(function ContextMenuCheckboxItem({ className, children, checked, ...props }, ref) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      ref={ref}
      checked={checked}
      className={cn(itemBase, 'pl-7', className)}
      {...props}
    >
      <span className="absolute left-2 flex size-3 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>✓</ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );
});
ContextMenuCheckboxItem.displayName = 'ContextMenuCheckboxItem';

export const ContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(function ContextMenuRadioItem({ className, children, ...props }, ref) {
  return (
    <ContextMenuPrimitive.RadioItem
      ref={ref}
      className={cn(itemBase, 'pl-7', className)}
      {...props}
    >
      <span className="absolute left-2 flex size-3 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>•</ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  );
});
ContextMenuRadioItem.displayName = 'ContextMenuRadioItem';

export const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(function ContextMenuSeparator({ className, ...props }, ref) {
  return (
    <ContextMenuPrimitive.Separator
      ref={ref}
      className={cn('-mx-1 my-1 h-px bg-border-default', className)}
      {...props}
    />
  );
});
ContextMenuSeparator.displayName = 'ContextMenuSeparator';

export const ContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label>
>(function ContextMenuLabel({ className, ...props }, ref) {
  return (
    <ContextMenuPrimitive.Label
      ref={ref}
      className={cn('px-2 py-1.5 text-xs font-medium text-foreground-subtle', className)}
      {...props}
    />
  );
});
ContextMenuLabel.displayName = 'ContextMenuLabel';

export const ContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger>
>(function ContextMenuSubTrigger({ className, children, ...props }, ref) {
  return (
    <ContextMenuPrimitive.SubTrigger ref={ref} className={cn(itemBase, className)} {...props}>
      {children}
      <span aria-hidden="true" className="ml-auto text-foreground-subtle">
        ›
      </span>
    </ContextMenuPrimitive.SubTrigger>
  );
});
ContextMenuSubTrigger.displayName = 'ContextMenuSubTrigger';

export const ContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(function ContextMenuSubContent({ className, ...props }, ref) {
  return (
    <ContextMenuPrimitive.SubContent
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
ContextMenuSubContent.displayName = 'ContextMenuSubContent';
