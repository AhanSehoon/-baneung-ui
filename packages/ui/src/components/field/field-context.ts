import * as React from 'react';

/**
 * Field 컴포넌트가 자식 input에 자동 주입하는 a11y 메타데이터.
 *
 * - `id`: 컨트롤의 id (Label.htmlFor와 매칭)
 * - `descriptionId` / `errorId`: aria-describedby 타깃
 * - `invalid`: aria-invalid
 * - `required`: aria-required
 * - `disabled`: 일괄 disabled
 *
 * 컨트롤(Input/Textarea 등)은 useFieldContext()로 이 값을 읽고,
 * 직접 props로 받은 값이 있으면 그쪽을 우선 적용합니다.
 */
export interface FieldContextValue {
  id: string;
  descriptionId: string;
  errorId: string;
  invalid: boolean;
  required: boolean;
  disabled: boolean;
}

export const FieldContext = React.createContext<FieldContextValue | null>(null);

export function useFieldContext(): FieldContextValue | null {
  return React.useContext(FieldContext);
}
