import * as React from 'react';

import { cn } from '../../lib/cn';
import { useFieldContext } from '../field/field-context';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** 콘텐츠에 따라 높이 자동 조정. */
  autoResize?: boolean;
  /** autoResize=true일 때 최대 행 수. 기본 8. */
  maxRows?: number;
}

/**
 * Textarea — 다중 라인 텍스트 입력.
 *
 * - 부모 `<Field>`가 있으면 id, aria-invalid, aria-describedby, aria-required, disabled 자동 주입
 * - `autoResize`: 내용에 맞춰 높이 조절(최대 `maxRows`행)
 * - 한글 IME: composition 이벤트는 native 그대로 통과
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    className,
    autoResize = false,
    maxRows = 8,
    rows = 3,
    id: idProp,
    'aria-invalid': ariaInvalidProp,
    'aria-describedby': describedByProp,
    'aria-required': requiredProp,
    disabled: disabledProp,
    onChange,
    ...props
  },
  ref,
) {
  const ctx = useFieldContext();
  const id = idProp ?? ctx?.id;
  const invalid = ariaInvalidProp ?? ctx?.invalid;
  const describedBy =
    describedByProp ??
    (ctx
      ? [ctx.descriptionId, invalid ? ctx.errorId : undefined].filter(Boolean).join(' ') ||
        undefined
      : undefined);
  const required = requiredProp ?? ctx?.required;
  const disabled = disabledProp ?? ctx?.disabled;

  const innerRef = React.useRef<HTMLTextAreaElement | null>(null);
  React.useImperativeHandle(ref, () => innerRef.current as HTMLTextAreaElement);

  const resize = React.useCallback(() => {
    const el = innerRef.current;
    if (!el || !autoResize) return;
    el.style.height = 'auto';
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight || '20');
    const maxHeight = lineHeight * maxRows;
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }, [autoResize, maxRows]);

  React.useEffect(() => {
    if (autoResize) resize();
  }, [autoResize, resize, props.value]);

  return (
    <textarea
      ref={innerRef}
      id={id}
      rows={rows}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      aria-required={required || undefined}
      disabled={disabled}
      onChange={(e) => {
        onChange?.(e);
        if (autoResize) resize();
      }}
      className={cn(
        'flex w-full min-w-0 bg-canvas text-foreground',
        'border border-border-default rounded-none',
        'px-3 py-2 text-sm leading-[1.4]',
        'placeholder:text-foreground-subtle',
        'transition-colors duration-base ease-standard',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        'disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-surface',
        'aria-[invalid=true]:border-danger',
        autoResize && 'resize-none',
        className,
      )}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';
