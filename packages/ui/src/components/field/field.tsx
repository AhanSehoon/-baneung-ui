import * as React from 'react';

import { cn } from '../../lib/cn';
import { Label } from '../label';
import { FieldContext, type FieldContextValue, useFieldContext } from './field-context';

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 컨트롤 id를 외부에서 강제 지정. 미지정 시 자동 생성. */
  id?: string;
  /** 검증 실패 — 컨트롤에 aria-invalid + Field.Error를 aria-describedby로 연결. */
  invalid?: boolean;
  /** 필수 입력 — 컨트롤에 aria-required. 라벨에 시각 표시도 함께 적용. */
  required?: boolean;
  /** Field 안 모든 컨트롤을 일괄 disable. */
  disabled?: boolean;
}

/**
 * Field — 라벨 / 설명 / 에러 메시지 / 컨트롤을 묶는 표준 폼 래퍼.
 *
 * Field가 React Context로 id와 a11y 메타데이터를 제공하고, 자식 컨트롤
 * (Input, Textarea, Checkbox 등)이 자동으로 픽업합니다 — 사용자가
 * `htmlFor`/`id`/`aria-*`을 일일이 잇지 않아도 됩니다.
 *
 * @example
 *   <Field invalid>
 *     <Field.Label>이메일</Field.Label>
 *     <Field.Description>업무용 이메일을 입력하세요.</Field.Description>
 *     <Input type="email" />
 *     <Field.Error>유효한 이메일이 아닙니다.</Field.Error>
 *   </Field>
 */
const FieldRoot = React.forwardRef<HTMLDivElement, FieldProps>(function Field(
  { id: idProp, invalid = false, required = false, disabled = false, className, ...props },
  ref,
) {
  const fallbackId = React.useId();
  const id = idProp ?? fallbackId;

  const value = React.useMemo<FieldContextValue>(
    () => ({
      id,
      descriptionId: `${id}-description`,
      errorId: `${id}-error`,
      invalid,
      required,
      disabled,
    }),
    [id, invalid, required, disabled],
  );

  return (
    <FieldContext.Provider value={value}>
      <div ref={ref} className={cn('flex flex-col gap-1.5', className)} {...props} />
    </FieldContext.Provider>
  );
});

/**
 * Field.Label — 폼 컨트롤 라벨. Field context의 id로 htmlFor를 자동 매칭.
 * 클릭 시 컨트롤로 포커스가 이전됩니다.
 */
export const FieldLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(function FieldLabel({ className, htmlFor, children, ...props }, ref) {
  const ctx = useFieldContext();
  return (
    <Label ref={ref} htmlFor={htmlFor ?? ctx?.id} className={className} {...props}>
      {children}
      {ctx?.required ? (
        <span aria-hidden="true" className="ml-0.5 text-danger">
          *
        </span>
      ) : null}
    </Label>
  );
});
FieldLabel.displayName = 'FieldLabel';

/**
 * Field.Description — 보조 설명. Field가 자식 컨트롤의 aria-describedby에 연결.
 */
export const FieldDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(function FieldDescription({ id, className, ...props }, ref) {
  const ctx = useFieldContext();
  return (
    <p
      ref={ref}
      id={id ?? ctx?.descriptionId}
      className={cn('text-sm text-foreground-muted', className)}
      {...props}
    />
  );
});
FieldDescription.displayName = 'FieldDescription';

/**
 * Field.Error — 에러 메시지. role="alert"으로 즉시 안내.
 * Field가 invalid 상태일 때 자식 컨트롤의 aria-describedby에 추가됩니다.
 */
export const FieldError = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(function FieldError({ id, className, ...props }, ref) {
  const ctx = useFieldContext();
  return (
    <p
      ref={ref}
      id={id ?? ctx?.errorId}
      role="alert"
      className={cn('text-sm text-danger', className)}
      {...props}
    />
  );
});
FieldError.displayName = 'FieldError';

/**
 * 합성 패턴 dot 표기 — `<Field.Label>` 등.
 * 트리쉐이크 친화 named exports와 병행 제공합니다.
 */
type FieldComponent = typeof FieldRoot & {
  Label: typeof FieldLabel;
  Description: typeof FieldDescription;
  Error: typeof FieldError;
};

export const Field = FieldRoot as FieldComponent;
Field.Label = FieldLabel;
Field.Description = FieldDescription;
Field.Error = FieldError;
Field.displayName = 'Field';
