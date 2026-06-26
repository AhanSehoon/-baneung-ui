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

  // cmdk는 Input(또는 Command 루트)에 포커스가 있어야 키보드 이벤트(↑↓, Enter)를 받는다.
  // Popover.Content의 기본 autoFocus는 Content 자체로 가서 cmdk가 키 입력을 못 받음.
  // searchable=false일 때도 Input을 DOM에 유지(시각적으로만 숨김)해 방향키 동작 보장.
  const inputRef = React.useRef<HTMLInputElement>(null);
  // 검색이 아닐 때 타이핑으로 인한 필터링 방지를 위해 검색어 빈 문자열로 강제.
  const [search, setSearch] = React.useState('');

  /**
   * Dialog / Sheet (Radix Dialog 기반) 안에서 Select가 열릴 때 옵션 리스트의
   * 스크롤이 동작하지 않는 문제 회피.
   *
   * 원인: Radix Dialog는 `react-remove-scroll`을 적용해 document-level capture
   * 단계에서 자기 트리 밖의 wheel/touchmove를 preventDefault한다.
   * Popover.Portal의 기본 container는 document.body라서 portal된 옵션 리스트가
   * Dialog의 scroll-lock 허용 영역 바깥에 위치 → 휠 스크롤이 차단됨.
   *
   * 해법: 트리거의 가장 가까운 [role="dialog"] 조상(Dialog/Sheet/Drawer)을 찾아
   * 그쪽으로 portal. Dialog 트리 내부면 react-remove-scroll이 허용함.
   * Dialog 안이 아니면 container 미지정 → 기본대로 document.body 사용.
   */
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | undefined>(undefined);
  React.useEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const dialog = trigger.closest('[role="dialog"]');
    if (dialog instanceof HTMLElement) setPortalContainer(dialog);
  }, []);

  /**
   * Dialog/Drawer/Sheet 등 부모 FocusScope 안에서 Select를 열 때,
   * Popover.Content는 portal로 document.body에 렌더되므로 부모 FocusScope가
   * "범위 밖"으로 인지하고 trigger로 포커스를 되돌릴 수 있다.
   *
   * 대응: 한 번 포커스를 옮긴 뒤 다음 두 시점에 한 번 더 강제 포커스해
   * FocusScope 정리 후에도 Input이 활성 상태가 되도록 보장한다.
   * - rAF: 같은 frame의 다른 focus 호출이 끝난 후
   * - setTimeout: macrotask 큐의 가장 마지막 (FocusScope의 마지막 보정 후)
   */
  const focusInput = React.useCallback((): void => {
    const focusOnce = (): void => {
      const el = inputRef.current;
      if (el && document.activeElement !== el) el.focus({ preventScroll: true });
    };
    focusOnce();
    requestAnimationFrame(focusOnce);
    setTimeout(focusOnce, 0);
  }, []);

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
    <PopoverPrimitive.Root
      open={open}
      onOpenChange={(next): void => {
        setOpen(next);
        if (!next) setSearch('');
      }}
    >
      <PopoverPrimitive.Trigger
        ref={triggerRef}
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
      <PopoverPrimitive.Portal container={portalContainer}>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={4}
          onOpenAutoFocus={(e): void => {
            // Popover.Content가 자기 자신을 포커싱하는 기본 동작을 막고
            // cmdk Input으로 포커스를 옮겨 키보드 네비게이션이 동작하도록 한다.
            // 부모 Dialog/Drawer 등의 FocusScope가 포커스를 되돌리지 않도록 다단계 재시도.
            e.preventDefault();
            focusInput();
          }}
          onKeyDownCapture={(e): void => {
            // 부모 Dialog FocusScope가 Input 포커스를 trigger로 되돌렸을 수 있다.
            // 사용자가 키를 누른 시점에 포커스가 Input이 아니면 옮겨 cmdk에 전달.
            const isNavKey =
              e.key === 'ArrowDown' ||
              e.key === 'ArrowUp' ||
              e.key === 'Enter' ||
              e.key === 'Home' ||
              e.key === 'End' ||
              e.key === 'PageDown' ||
              e.key === 'PageUp';
            if (!isNavKey) return;
            const input = inputRef.current;
            if (input && document.activeElement !== input) {
              input.focus({ preventScroll: true });
              // 이미 발생한 이벤트는 cmdk가 못 받았으므로 같은 키 이벤트를 재dispatch.
              // dispatchEvent로 cmdk의 onKeyDown 핸들러를 동기적으로 트리거.
              const ev = new KeyboardEvent('keydown', {
                key: e.key,
                code: e.code,
                bubbles: true,
                cancelable: true,
              });
              input.dispatchEvent(ev);
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          className={cn(
            'z-50 w-[var(--radix-popover-trigger-width)] min-w-48 max-w-[80vw]',
            'overflow-hidden bg-canvas text-foreground',
            'border border-border-default rounded-none shadow-md',
          )}
        >
          <CommandPrimitive
            label={ariaLabel ?? '옵션'}
            // 비검색 모드: search state를 항상 빈 문자열로 유지 → cmdk가 필터링 안 함.
            // 검색 모드: 입력에 따라 필터링.
            shouldFilter={searchable}
            filter={
              filterFn
                ? (val: string, queryText: string): number => {
                    const opt = options.find((o) => o.value === val);
                    if (!opt) return 0;
                    return filterFn(opt, queryText) ? 1 : 0;
                  }
                : undefined
            }
          >
            {/*
              CommandInput을 항상 DOM에 유지(searchable=false일 땐 sr-only로 숨김).
              cmdk는 Input에 포커스가 있어야 ↑↓/Enter 키 이벤트를 받아 옵션을 순회·선택한다.
              비검색 모드에선 사용자 눈에 안 보이지만 키 이벤트는 정상 동작.
            */}
            <div
              className={cn(
                searchable ? 'flex items-center border-b border-border-default px-3' : 'sr-only',
              )}
            >
              <CommandPrimitive.Input
                ref={inputRef}
                value={search}
                onValueChange={setSearch}
                placeholder={searchable ? '검색…' : undefined}
                aria-label={searchable ? '옵션 검색' : '옵션 키보드 네비게이션'}
                className={cn(
                  'flex h-10 w-full bg-transparent py-2 text-sm outline-none',
                  'placeholder:text-foreground-subtle',
                )}
              />
            </div>
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
                      'pl-3 pr-2 py-1.5 text-sm rounded-none outline-none',
                      // 선택/포커스 시각화 — bg 변경 + 좌측 accent bar (::before pseudo).
                      // - bg: 항목 전체 강조
                      // - accent bar: 좌측 3px 세로 막대 (focus-ring 색) — VS Code/Linear 스타일
                      //   pseudo-element는 item 박스 안에 absolute로 그려져 overflow에 클리핑되지 않고
                      //   상단/하단이 명확히 보임. (이전 ring-inset은 Tailwind v4의 ring-color 매핑
                      //   불일치로 안 보였음.)
                      'data-[selected=true]:bg-surface-strong data-[selected=true]:text-foreground',
                      'data-[selected=true]:before:absolute data-[selected=true]:before:inset-y-0',
                      'data-[selected=true]:before:left-0 data-[selected=true]:before:w-0.75',
                      'data-[selected=true]:before:bg-ring data-[selected=true]:before:content-[""]',
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
