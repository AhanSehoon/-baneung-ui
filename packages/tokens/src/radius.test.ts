import { describe, expect, it } from 'vitest';

import { radius } from './radius';

/**
 * 각진 디자인 강제 가드.
 * 라디우스에 0/2px/4px 외 값이 들어가면 즉시 실패해야 한다.
 */
describe('radius', () => {
  it('only contains 각진 디자인 허용 값(0 / 2px / 4px)', () => {
    const allowed = new Set(['0', '2px', '4px']);
    for (const value of Object.values(radius)) {
      expect(allowed.has(value)).toBe(true);
    }
  });

  it('has exactly 3 entries (none / sm / md)', () => {
    expect(Object.keys(radius).sort()).toEqual(['md', 'none', 'sm']);
  });

  it('does not include any "lg" / "xl" / "full" / "pill" tokens', () => {
    const forbidden = ['lg', 'xl', '2xl', '3xl', 'full', 'pill', 'round'];
    for (const k of forbidden) {
      expect(k in radius).toBe(false);
    }
  });
});
