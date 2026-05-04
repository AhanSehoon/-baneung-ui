import { describe, expect, it } from 'vitest';

import { cn } from './cn';

describe('cn', () => {
  it('merges plain class strings', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('handles conditional classes (clsx semantics)', () => {
    expect(cn('a', false && 'b', null, undefined, 'c')).toBe('a c');
  });

  it('flattens arrays', () => {
    expect(cn(['a', 'b'], 'c')).toBe('a b c');
  });

  it('flattens object shorthand', () => {
    expect(cn({ a: true, b: false, c: true })).toBe('a c');
  });

  it('resolves Tailwind utility conflicts (last wins)', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('respects user-provided className override', () => {
    const base = 'rounded-none px-2 py-1 bg-bg-canvas';
    const override = 'px-4';
    expect(cn(base, override)).toBe('rounded-none py-1 bg-bg-canvas px-4');
  });

  it('returns empty string for no input', () => {
    expect(cn()).toBe('');
  });
});
