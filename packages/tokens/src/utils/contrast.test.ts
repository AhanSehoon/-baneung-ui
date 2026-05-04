import { describe, expect, it } from 'vitest';

import { contrastRatio, relativeLuminance } from './contrast';

describe('relativeLuminance', () => {
  it('white (#FFFFFF) is 1.0', () => {
    expect(relativeLuminance('#FFFFFF')).toBeCloseTo(1, 4);
  });

  it('black (#000000) is 0.0', () => {
    expect(relativeLuminance('#000000')).toBeCloseTo(0, 4);
  });

  it('throws on invalid hex', () => {
    expect(() => relativeLuminance('#FFF')).toThrow(/Invalid hex/);
    expect(() => relativeLuminance('not-a-color')).toThrow(/Invalid hex/);
  });
});

describe('contrastRatio', () => {
  it('white vs black is 21:1 (max)', () => {
    expect(contrastRatio('#FFFFFF', '#000000')).toBeCloseTo(21, 0);
  });

  it('same color is 1:1 (min)', () => {
    expect(contrastRatio('#5BA8A0', '#5BA8A0')).toBeCloseTo(1, 4);
  });

  it('is symmetric — order independent', () => {
    expect(contrastRatio('#1F2937', '#FFFFFF')).toBeCloseTo(contrastRatio('#FFFFFF', '#1F2937'), 6);
  });
});
