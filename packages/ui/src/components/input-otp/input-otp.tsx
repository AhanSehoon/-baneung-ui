import * as React from 'react';

import { cn } from '../../lib/cn';
import { useControllableState } from '../../lib/use-controllable-state';

export interface InputOTPProps {
  /** 슬롯 개수. 기본 6. */
  length?: number;
  /** controlled 값 (대문자 영문 + 숫자). */
  value?: string;
  /** uncontrolled 초기값. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** 정규식. 기본 `^[0-9]$` (숫자만). 영숫자 OTP는 `/^[0-9A-Za-z]$/` 등으로 override. */
  pattern?: RegExp;
  /** 입력 완료(value.length === length) 시 호출. */
  onComplete?: (value: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  /** 그룹 라벨링 (스크린리더용). */
  'aria-label'?: string;
  /** Field 또는 Label과 연결할 id. */
  id?: string;
  className?: string;
}

const NUMERIC = /^[0-9]$/;

/**
 * InputOTP — 코드(예: 6자리 숫자 OTP) 입력.
 *
 * - 한 슬롯에 한 글자, 입력 시 다음 슬롯으로 자동 이동
 * - Backspace는 비어있을 때 이전 슬롯으로 이동, 차있을 때 비움
 * - Paste 시 분배 입력 (앞에서부터 슬롯에 채움)
 * - 좌/우 화살표로 슬롯 이동
 *
 * 한글 IME 환경에서는 의도치 않은 한글이 들어오지 않도록 pattern으로 필터링합니다.
 */
export const InputOTP = React.forwardRef<HTMLDivElement, InputOTPProps>(function InputOTP(
  {
    length = 6,
    value: valueProp,
    defaultValue,
    onValueChange,
    pattern = NUMERIC,
    onComplete,
    disabled = false,
    autoFocus = false,
    id,
    className,
    'aria-label': ariaLabel,
  },
  ref,
) {
  const [value, setValue] = useControllableState<string>({
    prop: valueProp,
    defaultProp: defaultValue ?? '',
    onChange: onValueChange,
  });

  const slotsRef = React.useRef<(HTMLInputElement | null)[]>([]);
  const onCompleteRef = React.useRef(onComplete);
  React.useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  const setSlotRef = React.useCallback(
    (index: number) => (el: HTMLInputElement | null) => {
      slotsRef.current[index] = el;
    },
    [],
  );

  const focusSlot = (index: number): void => {
    const el = slotsRef.current[Math.max(0, Math.min(length - 1, index))];
    el?.focus();
    el?.select();
  };

  const update = (next: string): void => {
    const trimmed = next.slice(0, length);
    setValue(trimmed);
    if (trimmed.length === length) {
      onCompleteRef.current?.(trimmed);
    }
  };

  const handleChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // 마지막으로 추가된 한 글자만 사용 (브라우저가 maxLength=1 보장하지만 안전하게)
    const ch = raw.slice(-1);
    if (ch && !pattern.test(ch)) {
      return; // 패턴 불일치 시 무시 — 한글 IME 등
    }
    const current = value ?? '';
    const next = current.slice(0, index) + ch + current.slice(index + 1);
    update(next);
    if (ch && index < length - 1) {
      focusSlot(index + 1);
    }
  };

  const handleKeyDown = (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    const current = value ?? '';
    if (e.key === 'Backspace') {
      if (current[index]) {
        // 현재 슬롯 비우기
        const next = current.slice(0, index) + current.slice(index + 1);
        update(next);
      } else if (index > 0) {
        // 이전 슬롯으로 이동 + 비우기
        const next = current.slice(0, index - 1) + current.slice(index);
        update(next);
        focusSlot(index - 1);
      }
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      focusSlot(index - 1);
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      focusSlot(index + 1);
      e.preventDefault();
    }
  };

  const handlePaste = (index: number) => (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text');
    const filtered = Array.from(text)
      .filter((ch) => pattern.test(ch))
      .join('');
    if (!filtered) return;
    const current = value ?? '';
    const next = (current.slice(0, index) + filtered).slice(0, length);
    update(next);
    focusSlot(Math.min(length - 1, index + filtered.length));
    e.preventDefault();
  };

  const slots = Array.from({ length }, (_, i) => (value ?? '')[i] ?? '');

  return (
    <div
      ref={ref}
      role="group"
      aria-label={ariaLabel}
      className={cn('inline-flex items-center gap-2', className)}
    >
      {slots.map((ch, i) => (
        <input
          key={i}
          ref={setSlotRef(i)}
          id={i === 0 ? id : undefined}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          disabled={disabled}
          // 사용자가 OTP 입력 시점에 명시적으로 opt-in 한 경우에만 첫 슬롯에 포커스 부여.
          // 모달이 열린 직후 등 분명한 컨텍스트에서만 사용해야 한다.
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={autoFocus && i === 0}
          aria-label={`${ariaLabel ?? '코드'} ${i + 1}/${length}`}
          value={ch}
          onChange={handleChange(i)}
          onKeyDown={handleKeyDown(i)}
          onPaste={handlePaste(i)}
          className={cn(
            'size-10 text-center text-base font-medium',
            'bg-canvas text-foreground border border-border-default rounded-none',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
            'disabled:cursor-not-allowed disabled:opacity-60',
          )}
        />
      ))}
    </div>
  );
});
InputOTP.displayName = 'InputOTP';
