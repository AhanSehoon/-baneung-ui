import * as React from 'react';

/**
 * controlled / uncontrolled 모두 지원하는 상태 동기화 훅.
 *
 * - `prop`이 `undefined`가 아니면 controlled — 외부 값을 그대로 노출하고 내부 상태는 무시
 * - 그렇지 않으면 uncontrolled — `defaultProp`으로 초기화한 내부 state를 사용
 * - 어느 모드든 setter는 `onChange`를 호출 (controlled 부모가 값을 반영)
 *
 * 입력성 컴포넌트(Input, Select 등)에서 표준으로 사용합니다.
 */

interface UseControllableStateProps<T> {
  /** 외부에서 제어하는 값. `undefined`면 uncontrolled로 동작. */
  prop?: T | undefined;
  /** uncontrolled 모드의 초기값. */
  defaultProp?: T | undefined;
  /** 값이 바뀔 때 부모에 통지. controlled/uncontrolled 모두에서 호출됨. */
  onChange?: (value: T) => void;
}

type SetStateAction<T> = T | ((prev: T | undefined) => T);

export function useControllableState<T>({
  prop,
  defaultProp,
  onChange,
}: UseControllableStateProps<T>): readonly [T | undefined, (next: SetStateAction<T>) => void] {
  const [uncontrolled, setUncontrolled] = React.useState<T | undefined>(defaultProp);
  const isControlled = prop !== undefined;
  const value = isControlled ? prop : uncontrolled;

  // onChange의 stale closure 방지 — ref에 최신 콜백을 보관.
  const onChangeRef = React.useRef(onChange);
  React.useEffect(() => {
    onChangeRef.current = onChange;
  });

  const setValue = React.useCallback(
    (next: SetStateAction<T>) => {
      const resolved =
        typeof next === 'function'
          ? (next as (prev: T | undefined) => T)(isControlled ? prop : uncontrolled)
          : next;

      if (!isControlled) {
        setUncontrolled(resolved);
      }
      onChangeRef.current?.(resolved);
    },
    [isControlled, prop, uncontrolled],
  );

  return [value, setValue] as const;
}
