import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useControllableState } from './use-controllable-state';

describe('useControllableState — uncontrolled mode', () => {
  it('initializes with defaultProp', () => {
    const { result } = renderHook(() => useControllableState<string>({ defaultProp: 'a' }));
    expect(result.current[0]).toBe('a');
  });

  it('updates internal state when set', () => {
    const { result } = renderHook(() => useControllableState<string>({ defaultProp: 'a' }));
    act(() => {
      result.current[1]('b');
    });
    expect(result.current[0]).toBe('b');
  });

  it('calls onChange when set', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useControllableState<number>({ defaultProp: 0, onChange }));
    act(() => {
      result.current[1](42);
    });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(42);
  });

  it('supports updater function', () => {
    const { result } = renderHook(() => useControllableState<number>({ defaultProp: 1 }));
    act(() => {
      result.current[1]((prev) => (prev ?? 0) + 1);
    });
    expect(result.current[0]).toBe(2);
  });
});

describe('useControllableState — controlled mode', () => {
  it('returns prop value, ignores internal state', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useControllableState<string>({ prop: value }),
      { initialProps: { value: 'x' } },
    );
    expect(result.current[0]).toBe('x');

    rerender({ value: 'y' });
    expect(result.current[0]).toBe('y');
  });

  it('does not update internal value on set, but notifies onChange', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useControllableState<string>({ prop: 'fixed', onChange }));
    act(() => {
      result.current[1]('attempted');
    });
    expect(onChange).toHaveBeenCalledWith('attempted');
    expect(result.current[0]).toBe('fixed');
  });
});
