/**
 * 타이포그래피 토큰.
 *
 * - 한·영 단일 폰트: Pretendard Variable
 * - 모노: JetBrains Mono
 * - 한글에서 깨지지 않는 line-height(1.4 본문, 1.2 헤딩)
 */

export const typography = {
  fontFamily: {
    sans: '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Malgun Gothic", system-ui, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  /**
   * px 환산 — 12 / 13 / 14 / 16 / 18 / 20 / 24 / 30 / 36 / 48 / 60.
   * rem 기반(1rem=16px)으로 표기.
   */
  fontSize: {
    xs: '0.75rem',
    sm: '0.8125rem',
    base: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    heading: '1.2',
    snug: '1.3',
    body: '1.4',
    relaxed: '1.6',
  },
  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.02em',
  },
} as const;

export type Typography = typeof typography;
