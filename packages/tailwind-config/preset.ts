/**
 * @baneung-pack/tailwind-config — Tailwind v4 프리셋(TS 데이터).
 *
 * Tailwind v4는 CSS-first 설계라 실제 컴파일은 `@theme` 블록이 담당하지만
 * (참고: @baneung-pack/ui/src/styles/globals.css), 본 TS 객체는:
 *  - 타 도구(Storybook 토큰 패널, 디자인 도구 export 등)에서 토큰 매핑을 일관되게 참조
 *  - Tailwind v3 backport 시 그대로 사용
 *  하기 위해 함께 export 합니다.
 *
 * 다크 모드는 **`[data-theme="dark"]`** 셀렉터를 표준으로 합니다.
 * (`class` 전략은 사용하지 않음 — 토큰 시스템이 데이터 속성 기반)
 */

import {
  breakpoint,
  colorPrimitive,
  colorSemanticLight,
  motion,
  radius,
  shadow,
  spacing,
  typography,
} from '@baneung-pack/tokens';

export const baneungPreset = {
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    /**
     * 컬러 — primitive(브랜드/중립 팔레트) + semantic(역할 기반).
     * 컴포넌트 스타일은 semantic을, 데모/스토리는 primitive를 직접 참조해도 무방.
     */
    colors: {
      'baneung-navy': colorPrimitive.baneungNavy,
      'baneung-teal': colorPrimitive.baneungTeal,
      neutral: colorPrimitive.neutral,
      bg: colorSemanticLight.bg,
      text: colorSemanticLight.text,
      border: colorSemanticLight.border,
      focus: colorSemanticLight.focus,
      status: colorSemanticLight.status,
    },
    spacing,
    borderRadius: radius,
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight,
    lineHeight: typography.lineHeight,
    letterSpacing: typography.letterSpacing,
    boxShadow: shadow,
    transitionDuration: motion.duration,
    transitionTimingFunction: motion.easing,
    screens: breakpoint,
  },
} as const;

export default baneungPreset;
