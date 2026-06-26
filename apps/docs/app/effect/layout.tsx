import { buildPageMetadata } from '@/lib/page-metadata';

import type { Metadata } from 'next';

/**
 * /effect/* 섹션 기본 메타데이터.
 * 개별 effect 페이지가 자체 metadata를 export하면 override (현재는 client-only).
 */
export const metadata: Metadata = buildPageMetadata({
  title: 'Effect — 비주얼 이펙트',
  description:
    '@baneung-pack/effect — Typewriter · RotatingWords · ScrambleText · SplitTextReveal · CountUp · GradientText · BlurInText · WavyText · GlitchText · VariableFontHover · CircularText · GravityText · SpotlightText 13개 React 모션/타이포 이펙트. 0-dependency, Tailwind 비종속, prefers-reduced-motion 자동 존중.',
  path: '/effect/typewriter',
});

export default function EffectLayout({ children }: { children: React.ReactNode }) {
  return children;
}
