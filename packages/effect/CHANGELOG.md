# @baneung-pack/effect

## 0.1.0

### Minor Changes

- 신규 패키지 `@baneung-pack/effect` 초도 출시 — React 비주얼 이펙트 라이브러리.

  # 텍스트 모션 (13)

  Typewriter · RotatingWords · ScrambleText · SplitTextReveal · CountUp · GradientText · BlurInText · WavyText · GlitchText · VariableFontHover · CircularText · GravityText · SpotlightText

  # 인터랙티브 이펙트 (2)
  - **Ripple** — 자식을 감싸 클릭 위치 물결 효과
  - **Confetti** — `<ConfettiProvider>` + `useConfetti()` 명령형 발사 (Canvas 입자 시뮬레이션)

  # 공통 인프라
  - 공통 훅: `useReducedMotion` (a11y) + `useInView` (스크롤 reveal)
  - 0-dependency 코어 — React peer만, Tailwind 비종속 (inline style 기반)
  - 모든 컴포넌트 `prefers-reduced-motion` 자동 존중
  - `aria-label`로 원문을 스크린리더에 노출, 애니메이션 span은 `aria-hidden`
  - ESM/CJS dual export + .d.ts, Next.js RSC 호환 (use client 자동 주입)
  - Apache-2.0 라이선스
