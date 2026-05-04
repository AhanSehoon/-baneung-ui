import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as React from 'react';

import { cn } from '../../lib/cn';
import { useControllableState } from '../../lib/use-controllable-state';
import { Calendar } from '../calendar';
import { useFieldContext } from '../field/field-context';

export interface DatePickerProps {
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (value: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  /** 날짜를 문자열로 포맷. 기본 ISO yyyy-mm-dd. */
  formatDate?: (date: Date) => string;
  /** 비활성 날짜 매처 (예: 미래 날짜만 허용). */
  disabledDates?: Date[] | ((date: Date) => boolean);
  className?: string;
  id?: string;
  'aria-label'?: string;
}

/**
 * 기본 ISO 포맷 (yyyy-mm-dd).
 */
function isoFormat(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function CalendarIcon(): React.ReactElement {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
      className="size-4 shrink-0 opacity-60"
    >
      <rect x="2" y="3" width="12" height="11" />
      <path d="M2 6h12M5 1v3M11 1v3" />
    </svg>
  );
}

/**
 * DatePicker — Calendar + Popover 조합.
 *
 * 트리거는 표시 텍스트 + 캘린더 아이콘. 클릭 또는 Space/Enter로 팝오버 열림.
 * 키보드: 팝오버 안에서 화살표로 날짜 이동, Enter로 선택, Esc로 닫기.
 */
export function DatePicker(props: DatePickerProps): React.ReactElement {
  const ctx = useFieldContext();
  const {
    placeholder = '날짜 선택',
    disabled: disabledProp,
    formatDate = isoFormat,
    disabledDates,
    className,
    id: idProp,
    'aria-label': ariaLabel,
  } = props;
  const disabled = disabledProp ?? ctx?.disabled ?? false;
  const id = idProp ?? ctx?.id;

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = useControllableState<Date | undefined>({
    prop: props.value,
    defaultProp: props.defaultValue,
    onChange: props.onValueChange,
  });

  const handleSelect = (date: Date | undefined): void => {
    setValue(date);
    if (date) setOpen(false);
  };

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger
        id={id}
        type="button"
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
        <span className={cn('truncate text-left', !value && 'text-foreground-subtle')}>
          {value ? formatDate(value) : placeholder}
        </span>
        <CalendarIcon />
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={4}
          className={cn(
            'z-50 overflow-hidden bg-canvas text-foreground',
            'border border-border-default rounded-none shadow-md',
          )}
        >
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleSelect}
            disabled={disabledDates}
            initialFocus
          />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
