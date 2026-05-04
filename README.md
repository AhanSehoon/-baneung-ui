# @baneung-pack/ui

> 바능(Baneung) 디자인 시스템 — 각진 디자인의 React 컴포넌트 라이브러리

[![CI](https://github.com/baneung-developer/-baneung-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/baneung-developer/-baneung-ui/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

`@baneung-pack/ui`는 바능 브랜드 가이드라인을 따르는 React 컴포넌트 라이브러리입니다.
Radix UI primitives 위에 바능의 톤(각진 디자인, 절제된 컬러, 강한 타이포 위계)을 입혔고,
WCAG 2.1 AA 접근성을 협상 불가 요건으로 합니다.

## 사용자용 (npm 소비)

```bash
pnpm add @baneung-pack/ui
# or: npm install @baneung-pack/ui / yarn add @baneung-pack/ui
```

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

### Peer dependencies

- React `^18 || ^19`
- React DOM `^18 || ^19`

별도의 Tailwind 설정·CSS 변수 정의 **필요 없음** — `dist/styles.css` 한 줄이면 끝.

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

전체 라이브 프리뷰: [데모 사이트](./apps/docs) (`pnpm --filter docs dev`).

---

## 기여자용 (모노레포 개발)

### 사전 요구사항

- **Node 24+**
- **pnpm 9** (corepack 권장)

```bash
corepack enable
corepack prepare pnpm@9.15.0 --activate
```

### 모노레포 구조

```
baneung-ui/
├── apps/
│   └── docs/                     # Next.js 15 데모/문서 사이트
├── packages/
│   ├── ui/                       # @baneung-pack/ui — 메인 컴포넌트 라이브러리
│   ├── tokens/                   # @baneung-pack/tokens — 디자인 토큰 (CSS/JSON/TS)
│   ├── tailwind-config/          # @baneung-pack/tailwind-config — 공유 프리셋
│   ├── tsconfig/                 # @baneung-pack/tsconfig — 공유 tsconfig
│   └── eslint-config/            # @baneung-pack/eslint-config — 공유 ESLint 설정
├── .changeset/                   # Changesets 버전 관리
└── CONTRIBUTING.md               # 기여 가이드 (PR 절차, 커밋 규약, 릴리스)
```

### 시작

```bash
git clone <repo> baneung-ui
cd baneung-ui
pnpm install
pnpm dev          # 데모 앱 + 패키지 watch 동시 실행
```

### 주요 명령어

| 명령어                                | 설명                                     |
| ------------------------------------- | ---------------------------------------- |
| `pnpm dev`                            | 데모 앱 + 패키지 watch                   |
| `pnpm build`                          | 모든 패키지 빌드                         |
| `pnpm test`                           | 단위·접근성 테스트 (Vitest + axe-core)   |
| `pnpm lint`                           | ESLint                                   |
| `pnpm typecheck`                      | TypeScript 검증                          |
| `pnpm format`                         | Prettier 포맷팅                          |
| `pnpm --filter @baneung-pack/ui size` | 번들 사이즈 검증 (size-limit)            |
| `pnpm changeset`                      | 변경사항 기록 (사용자 노출 변경 시 필수) |
| `pnpm changeset version`              | 버전 bump + CHANGELOG 생성               |
| `pnpm release`                        | 빌드 + npm publish                       |

### 컨벤션

- [CONTRIBUTING.md](./CONTRIBUTING.md) — PR 절차, 커밋 규약, 릴리스 프로세스
- 코딩 규칙 요약: TypeScript strict (`any` 금지) · `forwardRef` + `displayName` 필수 · 파일당 500줄 이하 · CSS 변수 우선 (하드코딩 금지) · 각진 디자인 (`border-radius`는 토큰 0/2/4만)
- 접근성: WCAG 2.1 AA 협상 불가 — 키보드 전용 동작 · `:focus-visible` · ARIA · 색대비 · `axe-core` 자동 통과 · IME(한글 조합) 안전 · 모바일 터치 44×44px

### 검증

CI에서 모든 PR은 다음을 통과해야 머지 가능:

- `pnpm -w lint` — ESLint (max-warnings 0)
- `pnpm -w typecheck` — TypeScript strict
- `pnpm -w test` — Vitest (axe-core 포함)
- `pnpm -w build` — tsup + Next.js 빌드
- `pnpm --filter @baneung-pack/ui size` — 번들 사이즈 회귀 차단

---

## 라이선스

[MIT](./LICENSE) © 바능(Baneung)
