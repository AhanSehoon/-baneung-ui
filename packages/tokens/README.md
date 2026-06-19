# @baneung-pack/tokens

> 바능(Baneung) 디자인 시스템 토큰 — CSS / JSON / TS 동시 export (Single Source of Truth)

[![npm](https://img.shields.io/npm/v/@baneung-pack/tokens.svg)](https://www.npmjs.com/package/@baneung-pack/tokens)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://github.com/BaneungCop/-baneung-ui/blob/master/LICENSE)

**📖 데모 / 컴포넌트 카탈로그**: https://ui.baneung.com

바능 디자인 시스템의 **단일 진실 공급원**(SSOT) 토큰 패키지. 같은 값을 CSS 변수, JSON, TypeScript 객체 세 형태로 동시에 제공해서 어떤 환경에서든 일관된 디자인을 보장합니다.

## 설치

```bash
pnpm add @baneung-pack/tokens
# or: npm install @baneung-pack/tokens / yarn add @baneung-pack/tokens
```

## 사용

### 1) CSS 변수 (가장 흔한 방식)

```css
/* app/global.css */
@import '@baneung-pack/tokens/css';
```

```css
/* 어디서나 var() 로 참조 */
.my-card {
  background: var(--color-bg-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-sm);
  padding: var(--space-4);
}
```

다크 모드는 `[data-theme="dark"]` cascade로 자동 적용:

```html
<html data-theme="dark">
  ...
</html>
```

### 2) TypeScript 객체 (런타임 참조)

```ts
import { tokens } from '@baneung-pack/tokens';

console.log(tokens.color.bg.canvas); // '#ffffff'
console.log(tokens.space[4]); // '16px'
console.log(tokens.radius.sm); // '2px'
```

타입 추론 완전 지원 — IDE 자동완성으로 모든 토큰 탐색 가능.

### 3) JSON (다른 도구 연동: Figma / Style Dictionary 등)

```ts
import tokensJson from '@baneung-pack/tokens/json';
```

또는 import 없이 파일 경로로 직접 사용:

```js
const path = require.resolve('@baneung-pack/tokens/json');
```

## 토큰 카테고리

| 카테고리              | 내용                                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------ |
| **Color (semantic)**  | `bg` / `text` / `border` / `focus` / `status` (success·warning·danger·info)                      |
| **Color (primitive)** | `neutral` / `baneungNavy` / `baneungTeal` 스케일                                                 |
| **Typography**        | Pretendard Variable (한·영) / JetBrains Mono / 사이즈 스케일 / 라인하이트 / 굵기                 |
| **Spacing**           | 4px 베이스 (`--space-1` ~ `--space-32`)                                                          |
| **Radius**            | `--radius-none: 0` · `--radius-sm: 2px` · `--radius-md: 4px` (각진 디자인 — 3개만)               |
| **Motion**            | `--duration-fast: 100ms` / `--duration-base: 150ms` / `--duration-slow: 250ms` / standard easing |
| **Z-index**           | dropdown / sticky / overlay / modal / popover / toast 레이어 정의                                |
| **Breakpoint**        | sm / md / lg / xl / 2xl                                                                          |

라이트/다크 두 세트 동시 제공.

## 보장

- **CSS / JSON / TS 일관성**: 같은 토큰 값이 세 형식으로 자동 동기화 (빌드 시 단일 소스에서 생성)
- **WCAG 2.1 AA 색대비**: 모든 시맨틱 컬러 조합 자동 검증
- **각진 디자인**: `border-radius`는 0 / 2 / 4 세 값만 (강제)
- **트리쉐이커블**: ESM/CJS dual, 필요한 토큰만 import 가능

## 함께 쓰면 좋은 패키지

- **[@baneung-pack/ui](https://www.npmjs.com/package/@baneung-pack/ui)** — 이 토큰을 사용하는 React 컴포넌트 라이브러리

## 링크

- **GitHub**: [BaneungCop/-baneung-ui](https://github.com/BaneungCop/-baneung-ui)
- **Issues**: [Bug & Feature requests](https://github.com/BaneungCop/-baneung-ui/issues)
- **CHANGELOG**: [최신 변경사항](https://github.com/BaneungCop/-baneung-ui/blob/master/packages/tokens/CHANGELOG.md)

## 라이선스

[Apache-2.0](https://github.com/BaneungCop/-baneung-ui/blob/master/LICENSE) © 바능(Baneung)
