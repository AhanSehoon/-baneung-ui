'use client';

import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as React from 'react';

import { cn } from '../../lib/cn';

export interface CaptionPickerOption {
  value: number;
  label: string;
}

export interface CaptionPickerProps {
  /** 트리거 라벨 — 현재 값 ("2026년", "6월"). */
  triggerLabel: string;
  /** aria-label — 스크린리더용. */
  ariaLabel: string;
  /** 옵션 목록. */
  options: CaptionPickerOption[];
  /** 현재 선택값. */
  value: number;
  /** 변경 콜백. */
  onChange: (value: number) => void;
}

/**
 * CaptionPicker — Calendar 캡션의 년/월 선택 드롭다운.
 *
 * native `<select>`는 OS picker라 스타일링이 불가능 → Radix Popover로 대체.
 * 디자인 토큰을 따르는 일관된 드롭다운 메뉴 제공.
 *
 * # 특징
 *  - 열릴 때 현재 선택값으로 자동 스크롤
 *  - 키보드: ↑/↓ 이동, Enter 선택, Esc 닫기 (Radix 기본 제공)
 *  - 토큰 색상: selected는 강조 bg, hover는 surface
 */
export function CaptionPicker({
  triggerLabel,
  ariaLabel,
  options,
  value,
  onChange,
}: CaptionPickerProps): React.ReactElement {
  const [open, setOpen] = React.useState(false);
  const listRef = React.useRef<HTMLDivElement>(null);

  // 열릴 때 현재 선택값으로 스크롤
  React.useEffect(() => {
    if (!open) return;
    const id = window.requestAnimationFrame(() => {
      const list = listRef.current;
      if (!list) return;
      const selected = list.querySelector<HTMLButtonElement>('[data-selected="true"]');
      if (selected) {
        selected.scrollIntoView({ block: 'center', behavior: 'auto' });
      }
    });
    return () => window.cancelAnimationFrame(id);
  }, [open]);

  const handleSelect = (v: number): void => {
    onChange(v);
    setOpen(false);
  };

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger
        aria-label={ariaLabel}
        className={cn(
          'inline-flex h-7 items-center gap-1 px-2 text-sm font-medium uppercase tracking-[0.18em]',
          'text-foreground-muted hover:text-foreground transition-colors',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          'data-[state=open]:text-foreground',
        )}
      >
        {triggerLabel}
        <span aria-hidden className="text-[10px] text-foreground-subtle">
          ▾
        </span>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="center"
          sideOffset={6}
          className={cn(
            'z-50 w-32 bg-canvas text-foreground',
            'border border-border-default rounded-none shadow-md',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
          )}
        >
          <div
            ref={listRef}
            className={cn(
              'max-h-64 overflow-y-auto p-1',
              // 커스텀 스크롤바 — WebKit (Chrome/Edge/Safari)
              '[&::-webkit-scrollbar]:w-1.5',
              '[&::-webkit-scrollbar-track]:bg-transparent',
              '[&::-webkit-scrollbar-thumb]:bg-border-default',
              '[&::-webkit-scrollbar-thumb]:rounded-full',
              '[&::-webkit-scrollbar-thumb:hover]:bg-border-strong',
              // Firefox — color: thumb track
              '[scrollbar-width:thin]',
              '[scrollbar-color:var(--color-border-default)_transparent]',
            )}
            role="listbox"
            aria-label={ariaLabel}
          >
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  data-selected={isSelected}
                  onClick={() => handleSelect(opt.value)}
                  className={cn(
                    'flex w-full items-center justify-between px-2 py-1.5 text-sm',
                    'tabular-nums transition-colors',
                    'hover:bg-surface',
                    'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring focus-visible:bg-surface',
                    isSelected && 'bg-surface-strong font-semibold text-foreground',
                    !isSelected && 'text-foreground-muted',
                  )}
                >
                  <span>{opt.label}</span>
                  {isSelected && (
                    <svg
                      aria-hidden
                      width="12"
                      height="12"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="shrink-0"
                    >
                      <path d="M3 8l3.5 3.5L13 4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
