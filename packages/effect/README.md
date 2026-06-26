# @baneung-pack/effect

바능 디자인 시스템 비주얼 이펙트 라이브러리 — 가벼운 React 모션/타이포 이펙트 모음.

- 🪶 **0-dependency 코어** — peer는 React/React-DOM뿐
- 🎨 **Tailwind 비종속** — inline style 기반, 어떤 React 앱에서도 즉시 사용
- ♿ **접근성 일급** — `prefers-reduced-motion` 자동 존중, `aria-label`로 스크린리더 친화
- 📦 **트리쉐이커블** — 사용하는 컴포넌트만 번들에 포함
- ⚡ **Next.js RSC 호환** — 'use client' 자동 주입

## 설치

```bash
npm install @baneung-pack/effect
# or
pnpm add @baneung-pack/effect
```

## 컴포넌트

### `Typewriter`

한 글자씩 등장하는 텍스트 + 깜빡이는 커서.

```tsx
import { Typewriter } from '@baneung-pack/effect';

// 1회 타이핑 (기본)
<Typewriter text="Hello, world!" />

// 무한 루프 (타이핑 → 3초 멈춤 → 지움 → 다시)
<Typewriter text="문의해 주세요" loop />

// 크기/색/굵기 커스터마이즈
<Typewriter
  text="BANEUNG"
  loop
  fontSize={32}
  color="#1F2937"
  fontWeight={700}
/>

// 언더스코어 커서
<Typewriter text="$ npm install" cursorChar="_" cursorColor="#16A34A" />

// 커서 숨김
<Typewriter text="..." showCursor={false} />
```

### Props

| Prop                | Type                          | Default      | 설명                              |
| ------------------- | ----------------------------- | ------------ | --------------------------------- |
| `text`              | `string`                      | —            | 표시할 텍스트 (필수)              |
| `loop`              | `boolean`                     | `false`      | 무한 반복 여부                    |
| `speedMs`           | `number`                      | `50`         | 타이핑 속도(ms/char)              |
| `eraseSpeedMs`      | `number`                      | `24`         | 지우는 속도(ms/char)              |
| `pauseAfterTypeMs`  | `number`                      | `3000`       | 다 친 뒤 대기(ms)                 |
| `pauseAfterEraseMs` | `number`                      | `450`        | 다 지운 뒤 대기(ms)               |
| `resetKey`          | `number\|string`              | —            | 값 변경 시 처음부터 재시작        |
| `fontSize`          | `string\|number`              | —            | 폰트 크기 (number는 px)           |
| `fontWeight`        | `CSSProperties['fontWeight']` | —            | 폰트 굵기                         |
| `color`             | `string`                      | —            | 텍스트 색 (CSS color)             |
| `showCursor`        | `boolean`                     | `true`       | 커서 표시 여부                    |
| `cursorColor`       | `string`                      | currentColor | 커서 색                           |
| `cursorWidth`       | `number`                      | `2`          | 막대 커서 두께(px)                |
| `cursorChar`        | `string`                      | —            | 커서 글자(미지정 시 막대)         |
| `className`         | `string`                      | —            | 추가 클래스                       |
| `style`             | `CSSProperties`               | —            | 인라인 style(위 props 오버라이드) |

## 접근성

- `prefers-reduced-motion: reduce` 시 애니메이션을 끄고 즉시 전체 텍스트 표시
- `aria-label`에 전체 텍스트 전달 — 스크린리더가 한 글자씩 읽지 않음
- 커서는 `aria-hidden="true"` — 보조 기술에 노출되지 않음

### `RotatingWords`

고정 문구 뒤의 단어만 위로 슬라이드 + 페이드로 순환. 히어로 카피의 "We build [apps]" 패턴.

```tsx
import { RotatingWords } from '@baneung-pack/effect';

<span>
  We build{' '}
  <RotatingWords
    words={['apps', 'agents', 'websites']}
    fontSize={24}
    color="#3B716C"
    fontWeight={700}
  />
</span>;
```

| Prop                  | Type                          | Default | 설명                                      |
| --------------------- | ----------------------------- | ------- | ----------------------------------------- |
| `words`               | `string[]`                    | —       | 순환할 단어 배열 (필수, 최소 1개)         |
| `intervalMs`          | `number`                      | `2000`  | 단어 하나가 보이는 시간(ms)               |
| `transitionMs`        | `number`                      | `400`   | 전환 애니메이션 시간(ms)                  |
| `loop`                | `boolean`                     | `true`  | true면 무한 반복, false면 마지막에서 정지 |
| `fontSize`            | `string\|number`              | —       | 폰트 크기                                 |
| `fontWeight`          | `CSSProperties['fontWeight']` | —       | 폰트 굵기                                 |
| `color`               | `string`                      | —       | 텍스트 색                                 |
| `className` / `style` | —                             | —       | HTML 표준                                 |

### `ScrambleText`

랜덤 글자가 빠르게 깜빡이다가 한 글자씩 자리를 찾아가는 해킹/디코딩 효과.

```tsx
import { ScrambleText } from '@baneung-pack/effect';

<ScrambleText text="ACCESS GRANTED" color="#16A34A" fontSize={24} />

// 매트릭스 (카타카나 + 루프)
<ScrambleText text="THE MATRIX" characters="ｱｲｳｴｵｶｷｸｹｺ..." loop color="#22C55E" />
```

| Prop                                | Type             | Default      | 설명                            |
| ----------------------------------- | ---------------- | ------------ | ------------------------------- |
| `text`                              | `string`         | —            | 최종 표시할 텍스트 (필수)       |
| `characters`                        | `string`         | A-Z 0-9 기호 | 스크램블에 사용할 글자 풀       |
| `revealSpeed`                       | `number`         | `60`         | 글자 자리잡힘 속도 (ms/char)    |
| `scrambleSpeed`                     | `number`         | `35`         | 스크램블 갱신 주기 (ms)         |
| `loop`                              | `boolean`        | `false`      | 다 푼 뒤 잠시 멈췄다 다시       |
| `pauseAfterRevealMs`                | `number`         | `2500`       | loop 모드의 reveal 후 대기 시간 |
| `resetKey`                          | `number\|string` | —            | 값 변경 시 처음부터 재시작      |
| `fontSize` / `fontWeight` / `color` | —                | —            | 시각 커스터마이즈               |
| `className` / `style`               | —                | —            | HTML 표준                       |

### `SplitTextReveal`

글자 또는 단어 단위로 순차 페이드 + 슬라이드 인. 마운트 또는 스크롤 진입 시 발사.

```tsx
import { SplitTextReveal } from '@baneung-pack/effect';

// 마운트 즉시
<SplitTextReveal text="Hello, BANEUNG!" fontSize={28} fontWeight={700} />

// 단어 단위 + 스크롤 트리거
<SplitTextReveal
  text="We build apps for the modern web."
  by="word"
  trigger="inView"
  stagger={80}
/>
```

| Prop                                | Type                  | Default   | 설명                           |
| ----------------------------------- | --------------------- | --------- | ------------------------------ |
| `text`                              | `string`              | —         | 표시할 텍스트 (필수)           |
| `by`                                | `'char' \| 'word'`    | `'char'`  | 분할 단위                      |
| `stagger`                           | `number`              | `30`      | 항목 간 시작 시차 (ms)         |
| `duration`                          | `number`              | `400`     | 항목 하나 애니메이션 시간 (ms) |
| `trigger`                           | `'mount' \| 'inView'` | `'mount'` | 발사 시점                      |
| `threshold`                         | `number`              | `0.15`    | inView 임계값 (0~1)            |
| `fontSize` / `fontWeight` / `color` | —                     | —         | 시각 커스터마이즈              |
| `className` / `style`               | —                     | —         | HTML 표준                      |

### `CountUp`

숫자가 부드럽게 증가/감소하는 카운터. 통계 섹션·KPI·achievement 카드.

```tsx
import { CountUp } from '@baneung-pack/effect';

// 기본 — 천 단위 콤마 자동
<CountUp to={1234567} fontSize={48} fontWeight={800} />

// 소수점 + 퍼센트
<CountUp to={99.9} decimals={1} suffix="%" />

// 화폐 + 스크롤 트리거
<CountUp to={89000000} prefix="₩" trigger="inView" />

// 감소 카운트 (60 → 0)
<CountUp from={60} to={0} suffix="s" duration={2000} />
```

| Prop                                | Type                  | Default   | 설명                                  |
| ----------------------------------- | --------------------- | --------- | ------------------------------------- |
| `from`                              | `number`              | `0`       | 시작 숫자                             |
| `to`                                | `number`              | —         | 목표 숫자 (필수)                      |
| `duration`                          | `number`              | `1500`    | 애니메이션 시간 (ms)                  |
| `separator`                         | `string`              | `','`     | 천 단위 구분자 (빈 문자열 = 미적용)   |
| `decimals`                          | `number`              | `0`       | 소수점 자리수                         |
| `decimalSeparator`                  | `string`              | `'.'`     | 소수점 구분자                         |
| `prefix` / `suffix`                 | `string`              | `''`      | 숫자 앞/뒤 문자열 (`$`, `%`, `명` 등) |
| `trigger`                           | `'mount' \| 'inView'` | `'mount'` | 발사 시점                             |
| `threshold`                         | `number`              | `0.3`     | inView 임계값 (0~1)                   |
| `fontSize` / `fontWeight` / `color` | —                     | —         | 시각 커스터마이즈                     |
| `className` / `style`               | —                     | —         | HTML 표준                             |

### `GradientText`

그라데이션이 글자 위를 흐르거나 반짝이며 지나가는 효과. 히어로 타이틀·CTA 강조용.

```tsx
import { GradientText } from '@baneung-pack/effect';

// flow — 브랜드 색 순환
<GradientText text="BANEUNG" fontSize={48} fontWeight={900} />

// flow — 커스텀 색상
<GradientText
  text="React · TypeScript"
  colors={['#FF2D78', '#A21CAF', '#3D5BFF', '#FF2D78']}
  durationMs={4000}
/>

// shimmer — 반짝이는 빛
<GradientText text="PREMIUM" mode="shimmer" baseColor="#1F2937" shimmerColor="#FFD700" />
```

| Prop                      | Type                                       | Default        | 설명                     |
| ------------------------- | ------------------------------------------ | -------------- | ------------------------ |
| `text`                    | `string`                                   | —              | 표시할 텍스트 (필수)     |
| `mode`                    | `'flow' \| 'shimmer'`                      | `'flow'`       | 효과 모드                |
| `colors`                  | `string[]`                                 | navy → teal    | flow 모드 색상 배열      |
| `direction`               | `'horizontal' \| 'vertical' \| 'diagonal'` | `'horizontal'` | 흐름 방향                |
| `durationMs`              | `number`                                   | `3000`         | 한 cycle 완료 시간       |
| `shimmerColor`            | `string`                                   | `'#ffffff'`    | shimmer 빛 색상          |
| `baseColor`               | `string`                                   | currentColor   | shimmer 베이스 텍스트 색 |
| `fontSize` / `fontWeight` | —                                          | —              | 시각 커스터마이즈        |
| `className` / `style`     | —                                          | —              | HTML 표준                |

### `BlurInText`

흐릿한 상태에서 선명해지며 등장하는 텍스트.

```tsx
import { BlurInText } from '@baneung-pack/effect';

// 단어 단위 (기본)
<BlurInText text="Hello, BANEUNG world!" fontSize={32} fontWeight={700} />

// 글자 단위 + 강한 blur
<BlurInText text="ANGULAR" by="char" stagger={60} blurAmount={14} />

// 전체 한 덩어리 + 스크롤 트리거
<BlurInText text="조용히 등장" by="all" trigger="inView" />
```

| Prop                                | Type                        | Default   | 설명                                 |
| ----------------------------------- | --------------------------- | --------- | ------------------------------------ |
| `text`                              | `string`                    | —         | 표시할 텍스트 (필수)                 |
| `by`                                | `'char' \| 'word' \| 'all'` | `'word'`  | 분할 단위                            |
| `stagger`                           | `number`                    | `50`      | 항목 간 시차 (ms). by="all"이면 무시 |
| `duration`                          | `number`                    | `600`     | 항목 하나 애니메이션 시간 (ms)       |
| `blurAmount`                        | `number`                    | `8`       | 시작 blur 강도 (px)                  |
| `trigger`                           | `'mount' \| 'inView'`       | `'mount'` | 발사 시점                            |
| `threshold`                         | `number`                    | `0.15`    | inView 임계값 (0~1)                  |
| `fontSize` / `fontWeight` / `color` | —                           | —         | 시각 커스터마이즈                    |
| `className` / `style`               | —                           | —         | HTML 표준                            |

### `WavyText`

글자가 파도치거나 통통 튀는 무한 애니메이션.

```tsx
import { WavyText } from '@baneung-pack/effect';

// 기본 wave
<WavyText text="BANEUNG WAVE" fontSize={36} fontWeight={800} color="#3B716C" />

// bounce 모드
<WavyText text="BOUNCE!" mode="bounce" amplitude={0.4} duration={1200} />

// 큰 진폭 + 느린 속도
<WavyText text="ocean" amplitude={0.6} duration={3500} />
```

| Prop                                | Type                 | Default  | 설명                               |
| ----------------------------------- | -------------------- | -------- | ---------------------------------- |
| `text`                              | `string`             | —        | 표시할 텍스트 (필수)               |
| `mode`                              | `'wave' \| 'bounce'` | `'wave'` | 움직임 곡선                        |
| `amplitude`                         | `number`             | `0.25`   | 진폭 (em)                          |
| `duration`                          | `number`             | `2000`   | 한 사이클 시간 (ms)                |
| `phaseStep`                         | `number`             | `0.08`   | 글자 간 위상 차이 (한 사이클 비율) |
| `fontSize` / `fontWeight` / `color` | —                    | —        | 시각 커스터마이즈                  |
| `className` / `style`               | —                    | —        | HTML 표준                          |

### `GlitchText`

RGB 채널이 어긋나는 글리치 효과. 적/청 두 채널 레이어를 mix-blend-mode로 합성.

```tsx
import { GlitchText } from '@baneung-pack/effect';

// 기본 글리치
<GlitchText text="SYSTEM FAILURE" intensity={0.6} />

// hover 시에만 트리거
<GlitchText text="HOVER ME" triggerOn="hover" intensity={0.7} />

// 커스텀 채널 색
<GlitchText
  text="BANEUNG"
  redChannelColor="#FF2D78"
  cyanChannelColor="#5BA8A0"
/>
```

| Prop                                | Type                  | Default     | 설명                        |
| ----------------------------------- | --------------------- | ----------- | --------------------------- |
| `text`                              | `string`              | —           | 표시할 텍스트 (필수)        |
| `intensity`                         | `number`              | `0.5`       | 글리치 강도 (0~1)           |
| `triggerOn`                         | `'always' \| 'hover'` | `'always'`  | 항상 / hover 시에만         |
| `speedMs`                           | `number`              | `2200`      | 베이스 애니메이션 시간 (ms) |
| `redChannelColor`                   | `string`              | `'#ff003c'` | 적색 채널 색상              |
| `cyanChannelColor`                  | `string`              | `'#00fbff'` | 청록 채널 색상              |
| `fontSize` / `fontWeight` / `color` | —                     | —           | 시각 커스터마이즈           |
| `className` / `style`               | —                     | —           | HTML 표준                   |

### `VariableFontHover`

마우스 커서가 지나가는 글자만 굵어지는 효과 (가변 폰트 친화).

```tsx
import { VariableFontHover } from '@baneung-pack/effect';

<VariableFontHover
  text="HOVER ME"
  minWeight={300}
  maxWeight={900}
  radius={80}
  fontFamily='"Pretendard Variable", system-ui'
/>;
```

| Prop                                | Type     | Default | 설명                       |
| ----------------------------------- | -------- | ------- | -------------------------- |
| `text`                              | `string` | —       | 표시할 텍스트 (필수)       |
| `minWeight`                         | `number` | `300`   | 기본/멀리 있을 때 굵기     |
| `maxWeight`                         | `number` | `900`   | 커서 바로 위 굵기          |
| `radius`                            | `number` | `80`    | 영향 반경 (px)             |
| `transitionMs`                      | `number` | `220`   | font-weight 보간 시간 (ms) |
| `fontSize` / `color` / `fontFamily` | —        | —       | 시각 커스터마이즈          |
| `className` / `style`               | —        | —       | HTML 표준                  |

### `CircularText`

원형 경로를 따라 배치된 텍스트가 회전. 배지·도장·CD 라벨 등에.

```tsx
import { CircularText } from '@baneung-pack/effect';

<CircularText text="BANEUNG · PACK · " radius={70} fontSize={16} fontWeight={700} />

// 반시계 + 느린 속도
<CircularText text="DESIGN · SYSTEM · " direction="ccw" durationMs={15000} />

// 정지 (정적 배지)
<CircularText text="STATIC · BADGE · " durationMs={0} />
```

| Prop                                | Type            | Default | 설명                              |
| ----------------------------------- | --------------- | ------- | --------------------------------- |
| `text`                              | `string`        | —       | 표시할 텍스트 (필수, 8~20자 권장) |
| `radius`                            | `number`        | `80`    | 원 반지름 (px)                    |
| `durationMs`                        | `number`        | `12000` | 한 바퀴 시간 (ms). 0 이하면 정지  |
| `direction`                         | `'cw' \| 'ccw'` | `'cw'`  | 회전 방향                         |
| `startAngleDeg`                     | `number`        | `0`     | 시작 각도 (0 = 12시)              |
| `fontSize` / `fontWeight` / `color` | —               | —       | 시각 커스터마이즈                 |
| `className` / `style`               | —               | —       | HTML 표준                         |

### `GravityText`

글자가 중력에 떨어지거나 흩어지는 물리 효과.

```tsx
import { GravityText } from '@baneung-pack/effect';

// mount 시 1회 떨어짐
<GravityText text="FALLING" />

// hover 시 흩어졌다 복귀
<GravityText text="Hover Me" trigger="hover" />

// 강한 흩어짐 + 큰 회전
<GravityText text="SCATTER" spread={1} rotation={300} gravity={400} />

// 스크롤 진입 시 1회
<GravityText text="ON SCROLL" trigger="inView" />
```

| Prop                                | Type                             | Default   | 설명                   |
| ----------------------------------- | -------------------------------- | --------- | ---------------------- |
| `text`                              | `string`                         | —         | 표시할 텍스트 (필수)   |
| `trigger`                           | `'mount' \| 'hover' \| 'inView'` | `'mount'` | 발사 시점              |
| `duration`                          | `number`                         | `1400`    | 낙하 시간 (ms)         |
| `stagger`                           | `number`                         | `30`      | 글자 간 시차 (ms)      |
| `spread`                            | `number`                         | `0.5`     | 가로 흩어짐 강도 (0~1) |
| `gravity`                           | `number`                         | `320`     | 낙하 거리 (px)         |
| `rotation`                          | `number`                         | `90`      | 회전 최대 각도 (deg)   |
| `threshold`                         | `number`                         | `0.2`     | inView 임계값 (0~1)    |
| `fontSize` / `fontWeight` / `color` | —                                | —         | 시각 커스터마이즈      |
| `className` / `style`               | —                                | —         | HTML 표준              |

### `SpotlightText`

커서 주변의 글자만 밝아지고 나머지는 어두워지는 스포트라이트 효과. 다크 배경에서 가장 인상적.

```tsx
import { SpotlightText } from '@baneung-pack/effect';

// 다크 배경에서 사용 권장
<SpotlightText text="HOVER ME" fontSize={32} color="#ffffff" fontWeight={800} />

// 컬러 하이라이트
<SpotlightText text="BANEUNG" highlightColor="#5BA8A0" color="#ffffff" />

// 강한 dim — 거의 안 보이다가 커서 주변만 빛남
<SpotlightText text="DARK MODE" dimOpacity={0.05} highlightColor="#FFD700" />
```

| Prop                                | Type     | Default                 | 설명                     |
| ----------------------------------- | -------- | ----------------------- | ------------------------ |
| `text`                              | `string` | —                       | 표시할 텍스트 (필수)     |
| `radius`                            | `number` | `120`                   | 스포트라이트 반경 (px)   |
| `dimOpacity`                        | `number` | `0.15`                  | 어두운 영역 투명도 (0~1) |
| `highlightColor`                    | `string` | `color` or currentColor | 스포트라이트 안 글자 색  |
| `fontSize` / `fontWeight` / `color` | —        | —                       | 시각 커스터마이즈        |
| `className` / `style`               | —        | —                       | HTML 표준                |

## 피드백 / 마이크로 인터랙션

### `Toast` + `useToast`

명령형 트리거 토스트. Provider + 훅 패턴. 자동/수동/스와이프 닫기, 액션 버튼, ARIA `status`/`alert` 분리.

```tsx
import { ToastProvider, useToast } from '@baneung-pack/effect';

// 1. 앱 루트에 Provider 마운트
<ToastProvider position="top-right" maxStack={5}>
  {children}
</ToastProvider>;

// 2. 컴포넌트에서 호출
const toast = useToast();
toast.success('저장 완료');
toast.error('네트워크 오류', {
  action: { label: '재시도', onClick: retry },
});
const id = toast.info('업로드 중…', { duration: 0 }); // 수동 닫기 전까지
toast.dismiss(id);
```

**`<ToastProvider>` props**

| Prop              | Type                                                                                              | Default       | 설명                      |
| ----------------- | ------------------------------------------------------------------------------------------------- | ------------- | ------------------------- |
| `position`        | `'top-left' \| 'top-center' \| 'top-right' \| 'bottom-left' \| 'bottom-center' \| 'bottom-right'` | `'top-right'` | 화면 모서리 위치          |
| `maxStack`        | `number`                                                                                          | `5`           | 동시 표시 최대 개수       |
| `defaultDuration` | `number`                                                                                          | `5000`        | 기본 자동 닫힘 (ms)       |
| `offset`          | `number`                                                                                          | `16`          | 뷰포트 가장자리 간격 (px) |

**`useToast()` API**: `success(msg, opts)` · `error` · `info` · `warning` · `custom` · `dismiss(id)` · `dismissAll()` — 호출은 toast id 반환.

**`ToastOptions`** (각 호출에 전달): `duration` · `className` · `style` · `onDismiss` · `icon` · `action: { label, onClick }`.

### `Skeleton` / `SkeletonText` / `SkeletonCircle`

로딩 중 콘텐츠 자리를 차지하는 회색 placeholder. shimmer / pulse 두 가지 애니메이션.

```tsx
import { Skeleton, SkeletonText, SkeletonCircle } from '@baneung-pack/effect';

<Skeleton width="200px" height={20} />
<SkeletonText lines={3} />
<SkeletonCircle size={48} />
<Skeleton variant="pulse" width="100%" height={120} />
```

**Skeleton**: `width` · `height` · `variant: 'shimmer' \| 'pulse'` · `borderRadius` · `className` · `style`
**SkeletonText**: `lines` (3) · `lineHeight` (14) · `gap` (8) · `lastLineWidthRatio` (0.6) · `variant`
**SkeletonCircle**: `size` (40) · `variant`

`aria-busy="true"` + `aria-hidden="true"` 적용. `prefers-reduced-motion` 시 정적 회색 블록.

### Loaders — `Spinner` / `Dots` / `Bars` / `Ring`

4가지 스피너 변형. 모두 같은 공통 props (`size` · `color` · `label` · `duration`).

```tsx
import { Spinner, Dots, Bars, Ring } from '@baneung-pack/effect';

<Spinner size="md" color="#3B716C" />
<Dots size="lg" color="#5BA8A0" />
<Bars size={48} />
<Ring size="md" label="저장 중" />
```

| Prop                  | Type                             | Default      | 설명                      |
| --------------------- | -------------------------------- | ------------ | ------------------------- |
| `size`                | `'sm' \| 'md' \| 'lg' \| number` | `'md'`       | sm=16, md=24, lg=36 (px)  |
| `color`               | `string`                         | currentColor | CSS color                 |
| `label`               | `string`                         | `'로딩 중'`  | 스크린리더 라벨 (sr-only) |
| `duration`            | `number`                         | 컴포넌트별   | cycle 시간 (ms)           |
| `className` / `style` | —                                | —            | HTML 표준                 |

모두 `role="status"`. `prefers-reduced-motion` 시 정적 표시.

### `AnimatedButton`

idle → loading → success/error 상태가 모핑되는 버튼. Promise 자동 처리 OR 외부 status 제어.

```tsx
import { AnimatedButton } from '@baneung-pack/effect';

// Promise 자동 모드
<AnimatedButton onClick={async () => await api.save()}>저장</AnimatedButton>

// 커스텀 텍스트
<AnimatedButton
  loadingText="업로드 중…"
  successText="완료"
  onClick={async () => await api.upload(file)}
>
  업로드
</AnimatedButton>

// 외부 제어
<AnimatedButton status={status} variant="danger">삭제</AnimatedButton>
```

| Prop                                        | Type                                              | Default     | 설명                                        |
| ------------------------------------------- | ------------------------------------------------- | ----------- | ------------------------------------------- |
| `onClick`                                   | `(e) => void \| Promise<unknown>`                 | —           | Promise면 자동 loading → success/error      |
| `status`                                    | `'idle' \| 'loading' \| 'success' \| 'error'`     | —           | 외부 제어 (자동 모드 우회)                  |
| `resetMs`                                   | `number`                                          | `1800`      | success/error 자동 idle 복귀 (ms, 0=비활성) |
| `variant`                                   | `'primary' \| 'secondary' \| 'ghost' \| 'danger'` | `'primary'` | 색상                                        |
| `size`                                      | `'sm' \| 'md' \| 'lg'`                            | `'md'`      | 크기                                        |
| `loadingText` / `successText` / `errorText` | `ReactNode`                                       | —           | 상태별 텍스트 override                      |
| `disabled`                                  | `boolean`                                         | `false`     | 비활성화                                    |

`aria-busy` · `aria-live="polite"` 적용. `prefers-reduced-motion` 시 즉시 전환.

### `CopyButton`

클립보드 복사 + 아이콘 모핑 (copy → check) + 자동 복원.

```tsx
import { CopyButton } from '@baneung-pack/effect';

<CopyButton value="hello world">Copy</CopyButton>

// 아이콘만 + 툴팁 (코드 블록 우측 상단 패턴)
<CopyButton value={code} iconOnly />

// 콜백
<CopyButton
  value={url}
  onCopied={(v) => log('copied:', v)}
  onError={(e) => log('failed:', e)}
>
  링크 복사
</CopyButton>
```

| Prop                           | Type                       | Default          | 설명                      |
| ------------------------------ | -------------------------- | ---------------- | ------------------------- |
| `value`                        | `string`                   | —                | 복사할 텍스트 (필수)      |
| `onCopied`                     | `(value: string) => void`  | —                | 복사 완료 콜백            |
| `onError`                      | `(error: unknown) => void` | —                | clipboard 실패 콜백       |
| `duration`                     | `number`                   | `1800`           | copied 상태 유지 (ms)     |
| `size`                         | `'sm' \| 'md' \| 'lg'`     | `'md'`           | 크기                      |
| `iconOnly`                     | `boolean`                  | `false`          | true면 정사각 아이콘 버튼 |
| `showTooltip` / `tooltipLabel` | —                          | true / 'Copied!' | 툴팁 옵션                 |

`aria-label` 동적 변경 + `aria-live`. `prefers-reduced-motion` 시 즉시 전환.

### `Toggle` / Switch

thumb가 부드럽게 미끄러지는 on/off 스위치. controlled/uncontrolled, Space/Enter 키, role="switch" + aria-checked.

```tsx
import { Toggle } from '@baneung-pack/effect';

// Controlled
<Toggle checked={enabled} onCheckedChange={setEnabled} label="이메일 알림" />

// Uncontrolled
<Toggle defaultChecked label="다크 모드" onCheckedChange={save} />

// 커스텀 색
<Toggle onColor="#16A34A" defaultChecked label="success" />
```

| Prop                                  | Type                         | Default             | 설명                                 |
| ------------------------------------- | ---------------------------- | ------------------- | ------------------------------------ |
| `checked` / `defaultChecked`          | `boolean`                    | — / `false`         | Controlled / Uncontrolled            |
| `onCheckedChange`                     | `(checked: boolean) => void` | —                   | 변경 콜백                            |
| `disabled`                            | `boolean`                    | `false`             | 비활성화                             |
| `size`                                | `'sm' \| 'md' \| 'lg'`       | `'md'`              | 크기                                 |
| `onColor` / `offColor` / `thumbColor` | `string`                     | navy / gray / white | 색상                                 |
| `label`                               | `ReactNode`                  | —                   | 옆에 표시할 라벨 (htmlFor 자동 연결) |
| `aria-label`                          | `string`                     | —                   | label 없을 때 필수                   |

### `Checkbox`

체크 표시가 그려지듯 draw-in되는 체크박스. indeterminate 지원.

```tsx
import { Checkbox } from '@baneung-pack/effect';

// Controlled
<Checkbox checked={agreed} onCheckedChange={setAgreed} label="동의" />

// Indeterminate (부모-자식 패턴)
<Checkbox checked="indeterminate" onCheckedChange={toggleAll} label="전체 선택" />

// Form
<Checkbox name="terms" value="agreed" defaultChecked label="약관" />
```

| Prop                                                   | Type                         | Default     | 설명                    |
| ------------------------------------------------------ | ---------------------------- | ----------- | ----------------------- |
| `checked` / `defaultChecked`                           | `boolean \| 'indeterminate'` | — / `false` | controlled/uncontrolled |
| `onCheckedChange`                                      | `(checked: boolean) => void` | —           | 변경 콜백               |
| `disabled` / `size` / `color` / `checkColor` / `label` | —                            | —           | 시각 + 비활성           |
| `name` / `value`                                       | `string`                     | —           | form 제출 호환          |

`role="checkbox"` + `aria-checked={true|false|'mixed'}` (W3C 표준). Space 키 토글.

### `ProgressBar`

determinate (value) / indeterminate (value 미지정) 두 모드.

```tsx
import { ProgressBar } from '@baneung-pack/effect';

// Determinate
<ProgressBar value={75} label="업로드 중" showPercent />

// Indeterminate — 진행률 모를 때
<ProgressBar label="처리 중…" />

// Variant
<ProgressBar value={90} variant="success" />

// Pill
<ProgressBar value={50} borderRadius={999} />
```

| Prop                        | Type                                                       | Default     | 설명                           |
| --------------------------- | ---------------------------------------------------------- | ----------- | ------------------------------ |
| `value`                     | `number`                                                   | —           | 0~max. 미지정 시 indeterminate |
| `max`                       | `number`                                                   | `100`       | 최댓값                         |
| `size`                      | `'sm' \| 'md' \| 'lg'`                                     | `'md'`      | 높이                           |
| `variant`                   | `'primary' \| 'success' \| 'warning' \| 'error' \| 'info'` | —           | 색상                           |
| `color` / `trackColor`      | `string`                                                   | — / gray    | 바/트랙 색                     |
| `label` / `showPercent`     | —                                                          | — / `false` | 라벨 + 퍼센트                  |
| `borderRadius` / `duration` | `number`                                                   | `0` / `300` | 모서리 / transition            |

`role="progressbar"` + `aria-valuenow/min/max`. indeterminate는 `aria-valuenow` 생략.

### `Ripple`

자식 요소를 감싸 클릭 위치에서 물결이 퍼지는 효과를 입혀주는 래퍼.

```tsx
import { Ripple } from '@baneung-pack/effect';

<Ripple color="rgba(255,255,255,0.45)">
  <button>클릭</button>
</Ripple>

<Ripple color="rgba(0,0,0,0.08)" duration={800}>
  <div role="button" tabIndex={0}>카드 전체에 ripple</div>
</Ripple>
```

| Prop       | Type        | Default      | 설명                  |
| ---------- | ----------- | ------------ | --------------------- |
| `children` | `ReactNode` | —            | 감쌀 요소             |
| `color`    | `string`    | currentColor | ripple 색 (rgba 권장) |
| `duration` | `number`    | `600`        | 시간 (ms)             |
| `opacity`  | `number`    | `0.35`       | 시작 opacity          |
| `disabled` | `boolean`   | `false`      | 효과 비활성화         |

`pointer-events: none` overlay라 자식 클릭 이벤트 그대로. `prefers-reduced-motion` 시 비활성.

### `AnimatedTabs`

활성 탭 인디케이터가 부드럽게 미끄러지는 탭. controlled/uncontrolled, Arrow 키 이동.

```tsx
import { AnimatedTabs } from '@baneung-pack/effect';

const TABS = [
  { value: 'overview', label: 'Overview', content: <p>...</p> },
  { value: 'features', label: 'Features', content: <p>...</p> },
  { value: 'old', label: 'Deprecated', content: <p>...</p>, disabled: true },
];

// Uncontrolled
<AnimatedTabs items={TABS} defaultValue="features" />

// Controlled
<AnimatedTabs items={TABS} value={active} onValueChange={setActive} />

// Vertical + 색
<AnimatedTabs items={TABS} orientation="vertical" indicatorColor="#3B716C" />
```

| Prop                             | Type                         | Default        | 설명                                   |
| -------------------------------- | ---------------------------- | -------------- | -------------------------------------- |
| `items`                          | `AnimatedTabItem[]`          | —              | `{ value, label, content, disabled? }` |
| `value` / `defaultValue`         | `string`                     | — / 첫 enabled | controlled/uncontrolled                |
| `onValueChange`                  | `(v: string) => void`        | —              | 변경 콜백                              |
| `orientation`                    | `'horizontal' \| 'vertical'` | `'horizontal'` | 방향                                   |
| `size`                           | `'sm' \| 'md' \| 'lg'`       | `'md'`         | 크기                                   |
| `indicatorColor` / `activeColor` | `string`                     | navy / navy    | 색                                     |
| `duration`                       | `number`                     | `250`          | 인디케이터 슬라이드 (ms)               |

`role="tablist/tab/tabpanel"` + `aria-selected/controls/labelledby` 완비. ArrowLeft/Right (horizontal) · ArrowUp/Down (vertical) · Home/End. disabled 자동 skip.

### `Confetti` + `useConfetti`

명령형 컨페티. Provider + 훅 패턴. Canvas 기반 입자 시뮬레이션 (0 dependency).

```tsx
import { ConfettiProvider, useConfetti } from '@baneung-pack/effect';

// 1. 앱 루트
<ConfettiProvider>{children}</ConfettiProvider>;

// 2. 호출
const confetti = useConfetti();
confetti.fire(); // 기본 — 화면 가운데 하단에서
confetti.fire({ particleCount: 200, colors: ['#FF3D8E', '#5BA8A0'] });
confetti.fire({ origin: buttonRef.current }); // 버튼 위치에서
confetti.fire({ origin: { ratioX: 0.1, ratioY: 0.5 }, angle: 60 }); // 왼쪽에서
```

**`<ConfettiProvider>` props**: `children` · `zIndex` (기본 max)

**`useConfetti()`**: `{ fire(options?) }` — 동시 호출 가능 (양쪽에서 동시 발사 등)

**`ConfettiFireOptions`**: `origin` · `particleCount` (80) · `colors` · `shape` (square/circle/ribbon) · `spread` (60°) · `angle` (90°=위) · `velocity` (14) · `gravity` (0.5) · `ticks` (130) · `size` (10)

`aria-hidden` 데코라티브. `prefers-reduced-motion: reduce` 시 발사 자체 무시.

### `LikeButton`

좋아요 클릭 시 하트 채움 + 주변 입자 burst.

```tsx
import { LikeButton } from '@baneung-pack/effect';

// Controlled + count
<LikeButton liked={liked} onLikedChange={setLiked} count={count} size="lg" />

// Uncontrolled
<LikeButton defaultLiked count={42} />

// 커스텀 색
<LikeButton color="#F59E0B" burstColor="#FFD93D" />
```

| Prop                                  | Type                       | Default                  | 설명                    |
| ------------------------------------- | -------------------------- | ------------------------ | ----------------------- |
| `liked` / `defaultLiked`              | `boolean`                  | — / `false`              | controlled/uncontrolled |
| `onLikedChange`                       | `(liked: boolean) => void` | —                        | 변경 콜백               |
| `count`                               | `number`                   | —                        | 카운트 (선택)           |
| `size`                                | `'sm' \| 'md' \| 'lg'`     | `'md'`                   | 크기                    |
| `color` / `emptyColor` / `burstColor` | `string`                   | hot pink / gray / =color | 색상                    |
| `burstCount`                          | `number`                   | `6`                      | 입자 개수               |
| `disabled` / `aria-label`             | —                          | / `'좋아요'`             | 비활성/라벨             |

`aria-pressed={liked}` toggle 의미. Space/Enter 토글. `prefers-reduced-motion` 시 pop+burst 비활성.

### `StarRating`

별점 입력. half-star, hover preview, 키보드, readOnly.

```tsx
import { StarRating } from '@baneung-pack/effect';

<StarRating value={rating} onValueChange={setRating} half />
<StarRating max={10} defaultValue={7} half />
<StarRating value={4.5} half readOnly />  // 평균 평점 표시
<StarRating defaultValue={3} color="#3B716C" />
```

| Prop                     | Type                      | Default      | 설명                            |
| ------------------------ | ------------------------- | ------------ | ------------------------------- |
| `value` / `defaultValue` | `number`                  | — / `0`      | controlled/uncontrolled (0~max) |
| `onValueChange`          | `(value: number) => void` | —            | 변경 콜백                       |
| `max`                    | `number`                  | `5`          | 별 개수                         |
| `half`                   | `boolean`                 | `false`      | 0.5 단위 지원                   |
| `readOnly` / `disabled`  | `boolean`                 | `false`      | 표시 전용 / 비활성              |
| `size`                   | `'sm' \| 'md' \| 'lg'`    | `'md'`       | 크기                            |
| `color` / `emptyColor`   | `string`                  | amber / gray | 색상                            |
| `gap`                    | `number`                  | `4`          | 별 간격 (px)                    |

`role="slider"` + `aria-valuenow/min/max/valuetext`. ArrowLeft/Right(또는 Up/Down) ±step, Home/End. 같은 값 재클릭으로 reset (half=false).

### `Stepper`

다단계 진행 표시기. horizontal/vertical, 연결선 채움 애니메이션, 클릭 이동.

```tsx
import { Stepper } from '@baneung-pack/effect';

const STEPS = [
  { label: '장바구니', description: '상품 확인' },
  { label: '배송', description: '주소' },
  { label: '결제', description: '카드/계좌' },
  { label: '완료' },
];

<Stepper steps={STEPS} current={1} />
<Stepper steps={STEPS} current={2} orientation="vertical" />
<Stepper steps={STEPS} current={current} onStepClick={setCurrent} />
<Stepper steps={STEPS} current={1} activeColor="#3B716C" />
```

| Prop                            | Type                         | Default        | 설명                             |
| ------------------------------- | ---------------------------- | -------------- | -------------------------------- |
| `steps`                         | `StepperStep[]`              | —              | `{ label, description?, icon? }` |
| `current`                       | `number`                     | —              | 현재 인덱스 (0-based)            |
| `orientation`                   | `'horizontal' \| 'vertical'` | `'horizontal'` | 방향                             |
| `size`                          | `'sm' \| 'md' \| 'lg'`       | `'md'`         | 크기                             |
| `activeColor` / `inactiveColor` | `string`                     | navy / gray    | 색                               |
| `duration`                      | `number`                     | `400`          | 연결선 채움 시간 (ms)            |
| `onStepClick`                   | `(index: number) => void`    | —              | 있으면 단계가 button으로 렌더    |

`role="list/listitem"` + `aria-current="step"` (active일 때). 클릭 가능 시 native button → 키보드 자동.

## 향후 추가 예정

- Toggle / Checkbox / ProgressBar / Ripple / AnimatedTabs (Tier 2)
- Confetti / LikeButton / StarRating / Stepper (Tier 3)
- 추가 요청은 issue로 환영합니다.

## License

Apache-2.0
