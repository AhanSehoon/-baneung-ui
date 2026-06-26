import { Command as CommandPrimitive } from 'cmdk';
import * as React from 'react';

import { cn } from '../../lib/cn';

/**
 * Command — cmdk 기반 커맨드 팔레트 베이스.
 *
 * 자체적으로 검색 필터링, 키보드 네비, 그룹 헤더를 제공합니다.
 * Dialog로 감싸 ⌘K 패턴을 만들 수 있고, 인라인으로도 사용 가능합니다.
 *
 * @example
 *   <Command label="명령 메뉴">
 *     <Command.Input placeholder="명령 검색..." />
 *     <Command.List>
 *       <Command.Empty>결과 없음</Command.Empty>
 *       <Command.Group heading="액션">
 *         <Command.Item onSelect={() => goTo('/new')}>새 문서</Command.Item>
 *       </Command.Group>
 *     </Command.List>
 *   </Command>
 */
const CommandRoot = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(function Command({ className, ...props }, ref) {
  return (
    <CommandPrimitive
      ref={ref}
      className={cn(
        'flex w-full flex-col overflow-hidden bg-canvas text-foreground',
        'border border-border-default rounded-none',
        className,
      )}
      {...props}
    />
  );
});
CommandRoot.displayName = 'Command';

export const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(function CommandInput({ className, ...props }, ref) {
  // 포커스 인디케이터는 wrapper의 bottom-border 색 변경(focus-within:border-ring)으로 표시.
  // input 자체의 outline은 globals.css의 :focus-visible 규칙이 input을 :not()으로 제외하므로
  // 안 그려짐 → 부모 overflow-hidden에 상단이 클리핑되는 문제 없음.
  return (
    <div className="flex items-center border-b border-border-default px-3 focus-within:border-ring">
      <CommandPrimitive.Input
        ref={ref}
        className={cn(
          'flex h-10 w-full bg-transparent py-2 text-sm',
          'placeholder:text-foreground-subtle',
          'disabled:cursor-not-allowed disabled:opacity-60',
          className,
        )}
        {...props}
      />
    </div>
  );
});
CommandInput.displayName = 'CommandInput';

export const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(function CommandList({ className, ...props }, ref) {
  return (
    <CommandPrimitive.List
      ref={ref}
      className={cn('max-h-[300px] overflow-y-auto overflow-x-hidden', className)}
      {...props}
    />
  );
});
CommandList.displayName = 'CommandList';

export const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>(function CommandEmpty({ className, ...props }, ref) {
  return (
    <CommandPrimitive.Empty
      ref={ref}
      className={cn('py-6 text-center text-sm text-foreground-muted', className)}
      {...props}
    />
  );
});
CommandEmpty.displayName = 'CommandEmpty';

export const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(function CommandGroup({ className, ...props }, ref) {
  return (
    <CommandPrimitive.Group
      ref={ref}
      className={cn(
        'overflow-hidden p-1 text-foreground',
        '[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5',
        '[&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium',
        '[&_[cmdk-group-heading]]:text-foreground-subtle',
        className,
      )}
      {...props}
    />
  );
});
CommandGroup.displayName = 'CommandGroup';

export const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(function CommandSeparator({ className, ...props }, ref) {
  return (
    <CommandPrimitive.Separator
      ref={ref}
      className={cn('mx-1 h-px bg-border-default', className)}
      {...props}
    />
  );
});
CommandSeparator.displayName = 'CommandSeparator';

export const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(function CommandItem({ className, ...props }, ref) {
  return (
    <CommandPrimitive.Item
      ref={ref}
      className={cn(
        'relative flex cursor-default select-none items-center gap-2',
        'px-2 py-1.5 text-sm rounded-none outline-none',
        'data-[selected=true]:bg-surface-strong data-[selected=true]:text-foreground',
        'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-60',
        className,
      )}
      {...props}
    />
  );
});
CommandItem.displayName = 'CommandItem';

/**
 * 합성 패턴 dot 표기 + named export 양쪽 지원.
 */
type CommandComponent = typeof CommandRoot & {
  Input: typeof CommandInput;
  List: typeof CommandList;
  Empty: typeof CommandEmpty;
  Group: typeof CommandGroup;
  Separator: typeof CommandSeparator;
  Item: typeof CommandItem;
};

export const Command = CommandRoot as CommandComponent;
Command.Input = CommandInput;
Command.List = CommandList;
Command.Empty = CommandEmpty;
Command.Group = CommandGroup;
Command.Separator = CommandSeparator;
Command.Item = CommandItem;
