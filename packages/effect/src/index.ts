/**
 * @baneung-pack/effect — 바능 디자인 시스템 비주얼 이펙트 라이브러리.
 *
 * 텍스트 모션 + 인터랙티브 이펙트 (Ripple, Confetti).
 * 인터랙션 컴포넌트(Toast, Skeleton, Loaders, Toggle, Checkbox, ProgressBar,
 * AnimatedButton/Tabs, CopyButton, LikeButton, StarRating, Stepper)는
 * `@baneung-pack/ui`로 이전되었습니다 (v1.0.13 이상).
 *
 * # 텍스트 모션 (13)
 *   - Typewriter / RotatingWords / ScrambleText / SplitTextReveal / CountUp
 *   - GradientText / BlurInText / WavyText / GlitchText
 *   - VariableFontHover / CircularText / GravityText / SpotlightText
 *
 * # 인터랙티브 이펙트 (2)
 *   - Ripple (자식을 감싸 클릭 위치 물결)
 *   - Confetti (Provider + useConfetti 명령형 발사)
 *
 * # peer dependencies
 *   - react ^18 || ^19
 *   - react-dom ^18 || ^19
 */

// ── 텍스트 모션 ─────────────────────────────────────────────────────────────
export * from './components/typewriter';
export * from './components/rotating-words';
export * from './components/scramble-text';
export * from './components/split-text-reveal';
export * from './components/count-up';
export * from './components/gradient-text';
export * from './components/blur-in-text';
export * from './components/wavy-text';
export * from './components/glitch-text';
export * from './components/variable-font-hover';
export * from './components/circular-text';
export * from './components/gravity-text';
export * from './components/spotlight-text';

// ── 인터랙티브 이펙트 ────────────────────────────────────────────────────────
export * from './components/ripple';
export * from './components/confetti';
