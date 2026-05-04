import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Command as CommandPrimitive } from 'cmdk';
import * as React from 'react';

import { cn } from '../../lib/cn';
import { useControllableState } from '../../lib/use-controllable-state';
import { useFieldContext } from '../field/field-context';

export interface ComboboxOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  /** 후보 목록. 사용자가 자유 입력하면 새 값을 추가할 수도 있습니다. */
  options: ComboboxOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  disabled?: boolean;
  /** true면 후보에 없는 값을 허용. 기본 false. */
  allowFreeText?: boolean;
  className?: string;
  id?: string;
  'aria-label'?: string;
}

/**
 * Combobox — 자유 입력 + 자동완성.
 *
 * - 단일 선택, 검색은 항상 활성
 * - `allowFreeText`로 후보 없는 자유 텍스트 허용 여부 결정
 * - 키보드: ↑↓ 항목 탐색, Enter 선택, Esc 닫기
 * - 한글 IME: 입력 중에는 cmdk 필터링이 native composition을 따라가도록 위임
 */
export function Combobox(props: ComboboxProps): React.ReactElement {
  const ctx = useFieldContext();
  const {
    options,
    placeholder = '선택…',
    emptyText = '결과 없음',
    disabled: disabledProp,
    allowFreeText = false,
    className,
    id: idProp,
    'aria-label': ariaLabel,
  } = props;
  const disabled = disabledProp ?? ctx?.disabled ?? false;
  const id = idProp ?? ctx?.id;

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = useControllableState<string>({
    prop: props.value,
    defaultProp: props.defaultValue ?? '',
    onChange: props.onValueChange,
  });
  const [query, setQuery] = React.useState('');

  React.useEffect(() => {
    if (!open) {
      // 닫힐 때 query를 비워 다음 열림 시 새로 시작
      setQuery('');
    }
  }, [open]);

  const handleSelect = (optionValue: string): void => {
    setValue(optionValue);
    setOpen(false);
  };

  const handleAddFreeText = (): void => {
    if (!allowFreeText || !query.trim()) return;
    setValue(query.trim());
    setOpen(false);
  };

  const triggerLabel = React.useMemo(() => {
    if (!value) return placeholder;
    return options.find((o) => o.value === value)?.label ?? value;
  }, [value, options, placeholder]);

  const isPlaceholder = !value;

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger
        id={id}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        aria-invalid={ctx?.invalid || undefined}
        disabled={disabled}
        className={cn(
          'inline-flex h-10 w-full items-center justify-between gap-2 px-3 text-sm',
          'bg-canvas text-foreground',
          'border border-border-default rounded-none',
          'transition-colors duration-base ease-standard',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          'disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-surface',
          'aria-[invalid=true]:border-danger',
          className,
        )}
      >
        <span className={cn('truncate text-left', isPlaceholder && 'text-foreground-subtle')}>
          {triggerLabel}
        </span>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={4}
          className={cn(
            'z-50 w-[var(--radix-popover-trigger-width)] min-w-48 max-w-[80vw]',
            'overflow-hidden bg-canvas text-foreground',
            'border border-border-default rounded-none shadow-md',
          )}
        >
          <CommandPrimitive label={ariaLabel ?? '검색'}>
            <div className="flex items-center border-b border-border-default px-3">
              <CommandPrimitive.Input
                value={query}
                onValueChange={setQuery}
                placeholder="검색…"
                className={cn(
                  'flex h-10 w-full bg-transparent py-2 text-sm outline-none',
                  'placeholder:text-foreground-subtle',
                )}
              />
            </div>
            <CommandPrimitive.List className="max-h-[280px] overflow-y-auto overflow-x-hidden p-1">
              <CommandPrimitive.Empty className="py-6 text-center text-sm text-foreground-muted">
                {allowFreeText && query.trim() ? (
                  <button
                    type="button"
                    onClick={handleAddFreeText}
                    className="text-foreground underline"
                  >
                    “{query}” 추가
                  </button>
                ) : (
                  emptyText
                )}
              </CommandPrimitive.Empty>
              {options.map((opt) => (
                <CommandPrimitive.Item
                  key={opt.value}
                  value={opt.value}
                  keywords={[opt.label]}
                  disabled={opt.disabled}
                  onSelect={(): void => handleSelect(opt.value)}
                  className={cn(
                    'relative flex cursor-default select-none items-center gap-2',
                    'px-2 py-1.5 text-sm rounded-none outline-none',
                    'data-[selected=true]:bg-surface-strong data-[selected=true]:text-foreground',
                    'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-60',
                  )}
                >
                  <span className="flex-1 truncate">{opt.label}</span>
                  {opt.value === value ? (
                    <span aria-hidden="true" className="text-foreground-muted">
                      ✓
                    </span>
                  ) : null}
                </CommandPrimitive.Item>
              ))}
            </CommandPrimitive.List>
          </CommandPrimitive>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
