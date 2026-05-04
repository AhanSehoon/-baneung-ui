import * as React from 'react';

/**
 * 한글 IME 조합(composition) 상태 추적 훅.
 *
 * 한글/일본어/중국어 IME는 키 입력이 조합 단계를 거칩니다.
 * - `compositionstart`: 조합 시작
 * - `compositionend`: 조합 완료(글자가 확정됨)
 *
 * 조합 중(`isComposing === true`)에는 Enter로 인한 submit/select/close 같은
 * 액션을 무시해야 의도치 않은 입력 종료를 막을 수 있습니다.
 *
 * @example
 *   const { isComposing, handlers } = useComposition();
 *   <input
 *     {...handlers}
 *     onKeyDown={(e) => {
 *       if (e.key === 'Enter' && !isComposing) handleSubmit();
 *     }}
 *   />
 */

interface UseCompositionOptions<T extends Element = HTMLInputElement> {
  onCompositionStart?: (event: React.CompositionEvent<T>) => void;
  onCompositionEnd?: (event: React.CompositionEvent<T>) => void;
}

interface UseCompositionResult<T extends Element = HTMLInputElement> {
  /** 조합이 진행 중이면 true. Enter/submit 분기에 사용. */
  isComposing: boolean;
  /** 입력 요소에 그대로 spread 할 수 있는 핸들러 묶음. */
  handlers: {
    onCompositionStart: (event: React.CompositionEvent<T>) => void;
    onCompositionEnd: (event: React.CompositionEvent<T>) => void;
  };
}

export function useComposition<T extends Element = HTMLInputElement>(
  options: UseCompositionOptions<T> = {},
): UseCompositionResult<T> {
  const [isComposing, setIsComposing] = React.useState(false);

  // 콜백을 ref에 보관해 stale closure 방지 + handlers의 stable 참조 유지.
  const onStartRef = React.useRef(options.onCompositionStart);
  const onEndRef = React.useRef(options.onCompositionEnd);
  React.useEffect(() => {
    onStartRef.current = options.onCompositionStart;
    onEndRef.current = options.onCompositionEnd;
  });

  const onCompositionStart = React.useCallback((event: React.CompositionEvent<T>) => {
    setIsComposing(true);
    onStartRef.current?.(event);
  }, []);

  const onCompositionEnd = React.useCallback((event: React.CompositionEvent<T>) => {
    setIsComposing(false);
    onEndRef.current?.(event);
  }, []);

  return {
    isComposing,
    handlers: { onCompositionStart, onCompositionEnd },
  };
}
