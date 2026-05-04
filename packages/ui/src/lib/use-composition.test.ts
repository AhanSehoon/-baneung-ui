import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useComposition } from './use-composition';

import type { CompositionEvent } from 'react';

/**
 * 실제 CompositionEvent를 만들기 어렵지만, 핸들러는 event 인자를 직접 사용하지 않으므로
 * 빈 객체를 unknown 경유로 캐스팅해 호출한다.
 */
function fakeCompositionEvent<T extends Element>(): CompositionEvent<T> {
  return {} as unknown as CompositionEvent<T>;
}

describe('useComposition', () => {
  it('starts with isComposing=false', () => {
    const { result } = renderHook(() => useComposition());
    expect(result.current.isComposing).toBe(false);
  });

  it('toggles isComposing across compositionstart → compositionend', () => {
    const { result } = renderHook(() => useComposition());

    act(() => {
      result.current.handlers.onCompositionStart(fakeCompositionEvent());
    });
    expect(result.current.isComposing).toBe(true);

    act(() => {
      result.current.handlers.onCompositionEnd(fakeCompositionEvent());
    });
    expect(result.current.isComposing).toBe(false);
  });

  it('forwards user-supplied composition callbacks', () => {
    const onCompositionStart = vi.fn();
    const onCompositionEnd = vi.fn();
    const { result } = renderHook(() => useComposition({ onCompositionStart, onCompositionEnd }));

    act(() => {
      result.current.handlers.onCompositionStart(fakeCompositionEvent());
    });
    expect(onCompositionStart).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.handlers.onCompositionEnd(fakeCompositionEvent());
    });
    expect(onCompositionEnd).toHaveBeenCalledTimes(1);
  });

  it('keeps handler references stable across renders', () => {
    const { result, rerender } = renderHook(() => useComposition());
    const first = result.current.handlers;
    rerender();
    expect(result.current.handlers.onCompositionStart).toBe(first.onCompositionStart);
    expect(result.current.handlers.onCompositionEnd).toBe(first.onCompositionEnd);
  });
});
