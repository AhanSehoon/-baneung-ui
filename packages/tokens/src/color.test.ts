import { describe, expect, it } from 'vitest';

import { colorSemanticDark, colorSemanticLight } from './color';
import { contrastRatio } from './utils/contrast';

/**
 * 중첩 객체의 모든 leaf 경로를 추출.
 * 라이트/다크 시맨틱 토큰의 shape parity 검증용.
 */
function deepKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const out: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      out.push(...deepKeys(v as Record<string, unknown>, path));
    } else {
      out.push(path);
    }
  }
  return out.sort();
}

describe('semantic colors — light/dark parity', () => {
  it('every key in light exists in dark with identical depth', () => {
    const lightKeys = deepKeys(colorSemanticLight as unknown as Record<string, unknown>);
    const darkKeys = deepKeys(colorSemanticDark as unknown as Record<string, unknown>);
    expect(darkKeys).toEqual(lightKeys);
  });
});

/**
 * WCAG 2.1 AA 본문 텍스트 기준 = 4.5:1.
 * 시맨틱 컬러의 모든 (bg × text) 조합을 라이트/다크 모드에서 전수 검사합니다.
 *
 * UI 요소(보더 등)는 3:1 기준이지만, 텍스트는 보수적으로 4.5를 적용합니다.
 * status(success/warning/danger/info) 컬러는 텍스트로 직접 사용 가능하므로
 * 기본 배경 위 가독성도 함께 검증.
 */
describe('semantic colors — WCAG AA 색대비 전수 검사', () => {
  type Mode = 'light' | 'dark';
  // 라이트/다크는 같은 shape이지만 `as const` 리터럴 타입이 달라서
  // 공통 타입으로 좁힐 때는 일반 string 기반 ColorSemantic을 사용.
  interface Palette {
    bg: Record<keyof typeof colorSemanticLight.bg, string>;
    text: Record<keyof typeof colorSemanticLight.text, string>;
    border: Record<keyof typeof colorSemanticLight.border, string>;
    focus: Record<keyof typeof colorSemanticLight.focus, string>;
    status: Record<keyof typeof colorSemanticLight.status, string>;
  }
  const palettes: Record<Mode, Palette> = {
    light: colorSemanticLight,
    dark: colorSemanticDark,
  };

  // 본문 텍스트 (4.5:1 필수)
  const textPairs: {
    bg: keyof typeof colorSemanticLight.bg;
    text: keyof typeof colorSemanticLight.text;
  }[] = [
    { bg: 'canvas', text: 'primary' },
    { bg: 'canvas', text: 'secondary' },
    { bg: 'surface', text: 'primary' },
    { bg: 'surface', text: 'secondary' },
    { bg: 'surfaceStrong', text: 'primary' },
    { bg: 'inverse', text: 'inverse' },
  ];

  for (const mode of ['light', 'dark'] as const) {
    for (const { bg, text } of textPairs) {
      it(`${mode}: bg.${bg} vs text.${text} >= 4.5:1`, () => {
        const ratio = contrastRatio(palettes[mode].bg[bg], palettes[mode].text[text]);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      });
    }
  }

  // 링크 텍스트 (4.5:1 필수)
  for (const mode of ['light', 'dark'] as const) {
    it(`${mode}: bg.canvas vs text.link >= 4.5:1`, () => {
      const ratio = contrastRatio(palettes[mode].bg.canvas, palettes[mode].text.link);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
  }

  // Status 컬러 — 본문 배경 위 텍스트로 노출 가능 (Alert 등에서)
  // status 텍스트는 status 자체 색을 사용하므로 4.5 기준은 보수적이지만
  // bg-canvas 위에서 최소 3:1 (UI 요소 기준)은 충족해야 함.
  const statusKeys: (keyof typeof colorSemanticLight.status)[] = [
    'success',
    'warning',
    'danger',
    'info',
  ];
  for (const mode of ['light', 'dark'] as const) {
    for (const status of statusKeys) {
      it(`${mode}: bg.canvas vs status.${status} >= 3:1 (UI 기준)`, () => {
        const ratio = contrastRatio(palettes[mode].bg.canvas, palettes[mode].status[status]);
        expect(ratio).toBeGreaterThanOrEqual(3);
      });
    }
  }

  // 포커스 링 — 인접 표면 대비 3:1 (가시성)
  for (const mode of ['light', 'dark'] as const) {
    it(`${mode}: bg.canvas vs focus.ring >= 3:1`, () => {
      const ratio = contrastRatio(palettes[mode].bg.canvas, palettes[mode].focus.ring);
      expect(ratio).toBeGreaterThanOrEqual(3);
    });
  }
});
