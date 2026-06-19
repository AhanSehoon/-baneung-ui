# @baneung-pack/ui

> 바능(Baneung) 디자인 시스템 — 각진 디자인의 React 컴포넌트 라이브러리

[![npm](https://img.shields.io/npm/v/@baneung-pack/ui.svg)](https://www.npmjs.com/package/@baneung-pack/ui)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://github.com/BaneungCop/-baneung-ui/blob/master/LICENSE)

**📖 데모 / 컴포넌트 카탈로그**: https://ui.baneung.com

Radix UI primitives 위에 바능 브랜드(각진 디자인, 절제된 컬러, 강한 타이포 위계)를 입힌 React 컴포넌트 라이브러리. **WCAG 2.1 AA 접근성 협상 불가**.

## 설치

```bash
pnpm add @baneung-pack/ui
# or: npm install @baneung-pack/ui / yarn add @baneung-pack/ui
```

Peer dependencies:

- React `^18 || ^19`
- React DOM `^18 || ^19`

## 사용

```tsx
// app/layout.tsx — 한 번만 로드
import '@baneung-pack/ui/styles.css';

// 어디서나
import { Button, Heading } from '@baneung-pack/ui';

export default function Page() {
  return (
    <main>
      <Heading level={1}>안녕하세요</Heading>
      <Button>저장</Button>
    </main>
  );
}
```

별도의 Tailwind 설정·CSS 변수 정의 **필요 없음** — `dist/styles.css` 한 줄이면 끝.

### 트리쉐이킹 친화 subpath import

```tsx
import { Button } from '@baneung-pack/ui/button';
import { Calendar } from '@baneung-pack/ui/calendar';
```

각 컴포넌트는 `@baneung-pack/ui/<name>` subpath로도 접근 가능 — 사용하지 않는 컴포넌트는 번들에 포함되지 않습니다.

### 다크 모드

`<html data-theme="dark">`만 토글하면 모든 토큰이 자동 cascade.

```tsx
document.documentElement.dataset.theme = 'dark';
```

### CSS 격리 (Cascade Layers)

라이브러리의 모든 스타일(preflight + 토큰 + 컴포넌트 utility)은 `@layer baneung` 안에 격리되어 있습니다. 소비자 프로젝트가 자체 Tailwind/글로벌 CSS를 함께 쓸 때 발생하는 두 가지 충돌 패턴을 정리합니다.

#### 패턴 A — 소비자가 라이브러리를 override 가능 (일반적)

소비자의 글로벌 CSS를 `@layer app`으로 감싸 명시 순서를 선언합니다.

```tsx
// app/layout.tsx
import '@baneung-pack/ui/styles.css'; // 먼저 — baneung 등록
import './globals.css'; // 나중 — app 등록
```

```css
/* globals.css 최상단 */
@layer baneung, app;

@layer app {
  /* 본인 글로벌 스타일 — 라이브러리를 override */
  body {
    background: #f5f5f5;
  }
}
```

결과: `[baneung=0, app=1]` → **app(소비자) 우선**. 의도된 override만 적용되고 그 외는 라이브러리 기본값 유지.

#### 패턴 B — 소비자도 Tailwind를 쓰는 경우 (권장)

소비자가 자체 Tailwind를 임포트해서 페이지 layout(`mx-auto`, `md:flex` 등) 유틸리티를 쓰면, 같은 utility(예: `.hidden`)가 라이브러리 번들에도 들어 있어 cross-layer로 충돌합니다. `hidden md:flex` 같은 반응형 패턴이 깨질 수 있습니다.

해결책: 소비자는 **preflight를 제외**하고 Tailwind를 import합니다 (preflight는 라이브러리가 이미 제공).

```tsx
// app/layout.tsx (Next.js 예시)
import '@baneung-pack/ui/styles.css';
import './globals.css';
```

```css
/* globals.css */
@import 'tailwindcss/theme';
@import 'tailwindcss/utilities';
/* @import 'tailwindcss/preflight'; ← 의도적으로 제외 */

@source "./app/**/*.{ts,tsx}";
@source "./components/**/*.{ts,tsx}";
```

이 구성에서:

- **preflight 충돌 없음**: docs preflight↔library button utility 충돌이 발생하지 않음 (preflight가 한쪽에만 존재)
- **반응형 정상 동작**: 소비자 utility는 unlayered → CSS 표준상 layered 라이브러리 utility를 자연스럽게 override → `md:flex`가 `hidden`을 정상적으로 이김

> **핵심**: CSS Cascade Layer는 처음 등록된 시점의 위치가 우선순위를 결정합니다. 라이브러리가 `@layer baneung`에 격리되어 있는 한, unlayered 소비자 CSS는 항상 라이브러리를 이깁니다 — 이게 isolation의 본질입니다. 패턴 A(`@layer app`)는 본인 글로벌 CSS를 명시적으로 통제하고 싶을 때, 패턴 B는 페이지 layout 용 utility만 추가로 쓰고 싶을 때 사용하세요.

## 컴포넌트 (58)

| 카테고리          | 컴포넌트                                                                                           |
| ----------------- | -------------------------------------------------------------------------------------------------- |
| Foundation        | Typography · Separator · AspectRatio · Skeleton · Spinner · Empty · Avatar · Badge · Kbd · Label   |
| Buttons & Toggles | Button · ButtonGroup · Toggle · ToggleGroup                                                        |
| Inputs            | Input · InputGroup · InputOTP · Textarea · Field · Checkbox · RadioGroup · Switch · Slider         |
| Selection         | Select (single/multi/searchable) · NativeSelect · Combobox · Command · Calendar · DatePicker       |
| Layout            | Card · Item · Sidebar · Resizable · ScrollArea · Direction                                         |
| Navigation        | Tabs · Breadcrumb · Pagination · NavigationMenu · Menubar                                          |
| Overlay           | Dialog · AlertDialog · Drawer · Sheet · Popover · HoverCard · Tooltip · DropdownMenu · ContextMenu |
| Feedback          | Alert · Toast · Sonner · Progress                                                                  |
| Data Display      | Accordion · Collapsible · Table · DataTable · Carousel                                             |

## 보장

- **접근성**: WCAG 2.1 AA 색대비 자동 검증, axe-core 0 violations, IME(한글 조합) 안전, 모바일 터치 44×44px
- **번들**: ESM/CJS dual, 트리쉐이커블, subpath import 지원
- **호환**: React 18 / 19

## 디자인 토큰

스타일 토큰은 별도 패키지로 제공 — [@baneung-pack/tokens](https://www.npmjs.com/package/@baneung-pack/tokens)

## 링크

- **GitHub**: [BaneungCop/-baneung-ui](https://github.com/BaneungCop/-baneung-ui)
- **Issues**: [Bug & Feature requests](https://github.com/BaneungCop/-baneung-ui/issues)
- **CHANGELOG**: [최신 변경사항](https://github.com/BaneungCop/-baneung-ui/blob/master/packages/ui/CHANGELOG.md)

## 라이선스

[Apache-2.0](https://github.com/BaneungCop/-baneung-ui/blob/master/LICENSE) © 바능(Baneung)
