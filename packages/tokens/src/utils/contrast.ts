/**
 * WCAG 2.1 색대비 유틸.
 *
 * sRGB hex(`#RRGGBB`) 두 색의 대비 비율(1~21)을 계산합니다.
 * 기준:
 *  - 본문 텍스트(AA): 4.5
 *  - 큰 텍스트(AA) / UI 요소: 3.0
 *  - 본문 텍스트(AAA): 7.0
 *
 * 외부 노출은 색대비 테스트 용도로 한정합니다 — 패키지 public API에는 포함하지 않습니다.
 */

interface Rgb {
  r: number;
  g: number;
  b: number;
}

function hexToRgb(hex: string): Rgb {
  const cleaned = hex.replace('#', '');
  if (cleaned.length !== 6) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  return {
    r: parseInt(cleaned.slice(0, 2), 16),
    g: parseInt(cleaned.slice(2, 4), 16),
    b: parseInt(cleaned.slice(4, 6), 16),
  };
}

/**
 * sRGB 채널 값(0~255)을 선형 휘도(0~1)로 변환.
 */
function srgbToLinear(channel: number): number {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * sRGB 색의 상대 휘도(0~1)를 반환.
 * WCAG 2.1 정의: L = 0.2126 R + 0.7152 G + 0.0722 B.
 */
export function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

/**
 * 두 색의 WCAG 명도 대비(1~21)를 계산.
 * 순서 무관 — `(L_lighter + 0.05) / (L_darker + 0.05)`.
 */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}
