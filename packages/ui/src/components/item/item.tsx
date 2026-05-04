import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';

import { cn } from '../../lib/cn';

export interface ItemProps extends React.HTMLAttributes<HTMLLIElement> {
  /** 좌측 슬롯 (아이콘, 아바타 등). asChild=true 시 무시됩니다. */
  startSlot?: React.ReactNode;
  /** 우측 슬롯 (배지, 보조 라벨, 액션 버튼 등). asChild=true 시 무시됩니다. */
  endSlot?: React.ReactNode;
  /** 선택 상태 — 시각 강조 + `data-state="selected"`. ARIA는 부모 컨텍스트에서 부여. */
  selected?: boolean;
  /** 비활성. */
  disabled?: boolean;
  /**
   * Slot으로 합성해 자식 element 자체로 렌더 (예: `<a>` / `<button>`).
   * 사용 시 startSlot/endSlot은 무시되니 직접 children에 포함하세요.
   */
  asChild?: boolean;
}

/**
 * Item — 리스트의 단일 항목. List/Sidebar/Combobox 등 광범위하게 재사용.
 *
 * - 시맨틱: 기본 `<li>`. `asChild`로 `<a>` / `<button>` 합성 가능
 * - hover/selected 시각 피드백, focus-visible 링
 * - **ARIA**: 본 컴포넌트는 `aria-selected`/`role`을 자동 부여하지 않습니다.
 *   사용 컨텍스트(role="listbox" + role="option" 등)에 따라 부모가 명시하세요.
 *   상태는 `data-state="selected"`로 노출되어 CSS 셀렉터로 활용 가능.
 */
export const Item = React.forwardRef<HTMLLIElement, ItemProps>(function Item(
  {
    className,
    startSlot,
    endSlot,
    selected = false,
    disabled = false,
    asChild = false,
    children,
    ...props
  },
  ref,
) {
  const sharedClassName = cn(
    'flex items-center gap-3 px-3 py-2 text-sm text-foreground rounded-none',
    'transition-colors duration-fast ease-standard',
    'hover:bg-surface',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
    selected && 'bg-surface-strong text-foreground',
    disabled && 'cursor-not-allowed opacity-60 pointer-events-none',
    className,
  );

  if (asChild) {
    // Slot은 단일 자식만 받음 — startSlot/endSlot은 무시. 사용자가 children에 직접 구성.
    return (
      <Slot
        ref={ref}
        data-state={selected ? 'selected' : undefined}
        data-disabled={disabled || undefined}
        className={sharedClassName}
        {...props}
      >
        {children}
      </Slot>
    );
  }

  return (
    <li
      ref={ref}
      data-state={selected ? 'selected' : undefined}
      data-disabled={disabled || undefined}
      className={sharedClassName}
      {...props}
    >
      {startSlot ? (
        <span aria-hidden="true" className="flex shrink-0 items-center text-foreground-muted">
          {startSlot}
        </span>
      ) : null}
      <span className="flex-1 truncate">{children}</span>
      {endSlot ? (
        <span className="flex shrink-0 items-center text-foreground-muted">{endSlot}</span>
      ) : null}
    </li>
  );
});
Item.displayName = 'Item';
