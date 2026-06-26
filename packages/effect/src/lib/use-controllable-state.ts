import * as React from 'react';

interface UseControllableStateOptions<T> {
  /** Controlled value — 정의되어 있으면 외부 제어 모드. */
  value?: T;
  /** Uncontrolled 초기값. value 미정의일 때만 사용. */
  defaultValue?: T;
  /**
   * 값 변경 콜백. controlled / uncontrolled 양 모드 모두 호출.
   * 매 렌더마다 새 함수 identity여도 setValue identity는 안정적.
   */
  onChange?: (next: T) => void;
}

/**
 * Controlled / uncontrolled 패턴을 통합 처리하는 훅.
 *
 * Toggle · Checkbox · StarRating · AnimatedTabs 등 상태가 있는 모든
 * 상호작용 컴포넌트가 공유. 컴포넌트는 이 훅 하나로 양쪽 모드를 동시 지원한다.
 *
 * # 동작
 * - `value`가 정의 → controlled. 항상 외부 value 반환, 내부 state 무시.
 * - `value`가 undefined → uncontrolled. `defaultValue`로 시작해 내부 state 추적.
 * - `setValue(next)` 호출:
 *   - 두 모드 모두 `onChange(next)`를 즉시 호출
 *   - uncontrolled면 내부 state도 업데이트
 *
 * # identity 안정성
 * - `onChange` 함수 identity가 매 렌더 바뀌어도 (인라인 화살표 함수 케이스)
 *   반환되는 `setValue`는 항상 같은 reference → 자식 컴포넌트의 useEffect dep,
 *   useCallback dep 등에서 불필요한 재실행을 일으키지 않음.
 *
 * @example
 *   function Toggle({ checked, defaultChecked, onCheckedChange, ...rest }) {
 *     const [value, setValue] = useControllableState({
 *       value: checked,
 *       defaultValue: defaultChecked ?? false,
 *       onChange: onCheckedChange,
 *     });
 *     return <button role="switch" aria-checked={value} onClick={() => setValue(!value)} />;
 *   }
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateOptions<T>): [T, (next: T) => void] {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState<T | undefined>(defaultValue);

  // 현재 값 — controlled면 외부 value, 아니면 내부 state.
  // defaultValue와 value 둘 다 undefined면 사용자 잘못 — T undefined로 noop.
  const current = (isControlled ? value : internal) as T;

  // onChange identity 변화를 ref로 흡수해 setValue identity 안정화.
  const onChangeRef = React.useRef(onChange);
  React.useEffect(() => {
    onChangeRef.current = onChange;
  });

  const setValue = React.useCallback(
    (next: T) => {
      if (!isControlled) {
        setInternal(next);
      }
      // ref로 호출 → 매 렌더 변경되는 onChange도 항상 최신 버전 호출.
      onChangeRef.current?.(next);
    },
    [isControlled],
  );

  return [current, setValue];
}
