import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Command as CommandPrimitive } from 'cmdk';
import * as React from 'react';

import { cn } from '../../lib/cn';
import { useControllableState } from '../../lib/use-controllable-state';
import { useFieldContext } from '../field/field-context';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
  group?: string;
  description?: string;
}

interface SelectBaseProps {
  options: SelectOption[];
  placeholder?: string;
  emptyText?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  /** 검색 입력 노출. cmdk 필터링이 자동 동작합니다. */
  searchable?: boolean;
  /** 커스텀 필터 함수. (option, query) => boolean. */
  filterFn?: (option: SelectOption, query: string) => boolean;
  /** 트리거 너비. 기본 'auto'(부모에 맞춤). */
  className?: string;
  /** 트리거에 직접 사용할 id (Field context 우선). */
  id?: string;
  /** Trigger의 aria-label (Field.Label이 없는 경우 권장). */
  'aria-label'?: string;
}

interface SingleSelectProps extends SelectBaseProps {
  mode?: 'single';
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

interface MultipleSelectProps extends SelectBaseProps {
  mode: 'multiple';
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** 다중 선택 최대 개수. 초과 시 추가 선택 무시. */
  maxSelected?: number;
  /** true면 칩 대신 "N개 선택" 카운트 표시. 기본 false. */
  showSelectedCount?: boolean;
}

export type SelectProps = SingleSelectProps | MultipleSelectProps;

const triggerSizeMap = {
  sm: 'h-8 px-2 text-xs',
  md: 'h-10 px-3 text-sm',
  lg: 'h-12 px-4 text-base',
} as const;

/**
 * 체크 마커 (선택된 항목에 표시).
 */
function CheckMark(): React.ReactElement {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
      className="size-4 shrink-0"
    >
      <path d="M3 8.5l3 3 7-7" strokeLinecap="square" />
    </svg>
  );
}

function ChevronDown(): React.ReactElement {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
      className="size-4 shrink-0 opacity-60"
    >
      <path d="M4 6l4 4 4-4" strokeLinecap="square" />
    </svg>
  );
}

/**
 * Select — single / multiple / searchable 3가지 모드를 단일 컴포넌트로 제공.
 *
 * - 모드 결정: `mode` prop ('single' | 'multiple', 기본 'single')
 * - 검색: `searchable` prop (cmdk가 자동으로 필터링)
 * - 부모 `<Field>`가 있으면 id/required/disabled를 자동 픽업
 * - 키보드: ↑↓ 순회, Enter 선택(다중은 토글), Esc 닫기, 타이핑 시 자동 검색(searchable일 때)
 *
 * 가상화/모바일 풀스크린 시트는 후속 페이즈에서 추가됩니다.
 *
 * @example single
 *   <Select options={[{label:'서울', value:'seoul'}]} placeholder="도시" />
 *
 * @example multiple + searchable
 *   <Select mode="multiple" searchable options={cities} placeholder="도시" />
 */
export function Select(props: SelectProps): React.ReactElement {
  const ctx = useFieldContext();
  const {
    options,
    placeholder = '선택…',
    emptyText = '결과 없음',
    disabled: disabledProp,
    size = 'md',
    searchable = false,
    filterFn,
    className,
    id: idProp,
    'aria-label': ariaLabel,
  } = props;
  const disabled = disabledProp ?? ctx?.disabled ?? false;
  const id = idProp ?? ctx?.id;

  const isMultiple = props.mode === 'multiple';
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = useControllableState<string | string[]>({
    prop: props.value,
    defaultProp: props.defaultValue ?? (isMultiple ? [] : ''),
    onChange: props.onValueChange as ((v: string | string[]) => void) | undefined,
  });

  const selectedSet = React.useMemo(() => {
    if (isMultiple) return new Set(((value as string[] | undefined) ?? []) as string[]);
    return new Set(value ? [value as string] : []);
  }, [value, isMultiple]);

  const handleSelect = (optionValue: string): void => {
    if (isMultiple) {
      const current = (value as string[] | undefined) ?? [];
      let next: string[];
      if (current.includes(optionValue)) {
        next = current.filter((v) => v !== optionValue);
      } else {
        const max = (props as MultipleSelectProps).maxSelected;
        if (max !== undefined && current.length >= max) return;
        next = [...current, optionValue];
      }
      setValue(next);
    } else {
      setValue(optionValue);
      setOpen(false);
    }
  };

  // Trigger 라벨링
  // - single: 선택된 항목의 label
  // - multiple (default): "<첫 항목 label> 외 N개" — 트리거 폭이 늘어나지 않도록 한 줄 고정
  // - multiple + showSelectedCount: "N개 선택" 카운트만
  const triggerLabel = React.useMemo(() => {
    if (isMultiple) {
      const arr = (value as string[] | undefined) ?? [];
      if (arr.length === 0) return placeholder;
      const showCount = (props as MultipleSelectProps).showSelectedCount;
      if (showCount) return `${arr.length}개 선택`;
      const firstLabel = options.find((o) => o.value === arr[0])?.label ?? arr[0];
      if (arr.length === 1) return firstLabel;
      return `${firstLabel} 외 ${arr.length - 1}개`;
    }
    const v = value as string | undefined;
    if (!v) return placeholder;
    return options.find((o) => o.value === v)?.label ?? v;
  }, [isMultiple, value, options, placeholder, props]);

  const isPlaceholder =
    (isMultiple && ((value as string[] | undefined) ?? []).length === 0) || (!isMultiple && !value);

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
          'inline-flex w-full items-center justify-between gap-2',
          'bg-canvas text-foreground',
          'border border-border-default rounded-none',
          'transition-colors duration-base ease-standard',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          'disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-surface',
          'aria-[invalid=true]:border-danger',
          triggerSizeMap[size],
          className,
        )}
      >
        <span
          className={cn('flex-1 truncate text-left', isPlaceholder && 'text-foreground-subtle')}
        >
          {triggerLabel}
        </span>
        <ChevronDown />
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
          <CommandPrimitive
            label={ariaLabel ?? '옵션'}
            filter={
              filterFn
                ? (val: string, search: string): number => {
                    const opt = options.find((o) => o.value === val);
                    if (!opt) return 0;
                    return filterFn(opt, search) ? 1 : 0;
                  }
                : undefined
            }
          >
            {searchable ? (
              <div className="flex items-center border-b border-border-default px-3">
                <CommandPrimitive.Input
                  placeholder="검색…"
                  className={cn(
                    'flex h-10 w-full bg-transparent py-2 text-sm outline-none',
                    'placeholder:text-foreground-subtle',
                  )}
                />
              </div>
            ) : null}
            <CommandPrimitive.List
              className="max-h-[280px] overflow-y-auto overflow-x-hidden p-1"
              aria-multiselectable={isMultiple || undefined}
            >
              <CommandPrimitive.Empty className="py-6 text-center text-sm text-foreground-muted">
                {emptyText}
              </CommandPrimitive.Empty>
              {options.map((opt) => {
                const isSelected = selectedSet.has(opt.value);
                return (
                  <CommandPrimitive.Item
                    key={opt.value}
                    value={opt.value}
                    keywords={[opt.label, opt.description ?? '']}
                    disabled={opt.disabled}
                    onSelect={(): void => handleSelect(opt.value)}
                    className={cn(
                      'relative flex cursor-default select-none items-center gap-2',
                      'px-2 py-1.5 text-sm rounded-none outline-none',
                      'data-[selected=true]:bg-surface-strong data-[selected=true]:text-foreground',
                      'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-60',
                    )}
                  >
                    <span className="flex size-4 shrink-0 items-center justify-center">
                      {isSelected ? <CheckMark /> : null}
                    </span>
                    <span className="flex-1 truncate">{opt.label}</span>
                    {opt.description ? (
                      <span className="truncate text-xs text-foreground-subtle">
                        {opt.description}
                      </span>
                    ) : null}
                  </CommandPrimitive.Item>
                );
              })}
            </CommandPrimitive.List>
          </CommandPrimitive>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
