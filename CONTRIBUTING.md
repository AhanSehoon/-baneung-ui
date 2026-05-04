# Contributing to @baneung-pack/ui

기여해 주셔서 감사합니다. 본 문서는 PR 절차·커밋 규약·릴리스 프로세스를 정리합니다.

---

## 시작 전 읽어주세요

- [`CLAUDE.md`](./CLAUDE.md) — 코딩 규칙(주석, import 순서, TypeScript 정책, 접근성 체크리스트). 충돌 시 이 문서가 우선합니다.
- [`PROJECT_PLAN.md`](./PROJECT_PLAN.md) — 디자인 원칙, 로드맵, 토큰 규약.

---

## 환경

- Node 24+ / pnpm 9.15+
- corepack로 활성화: `corepack enable && corepack prepare pnpm@9.15.0 --activate`
- 의존성: `pnpm install`

---

## 변경 절차

### 1. 이슈 또는 RFC 먼저

- 신규 컴포넌트, 디자인 토큰 신규/수정, 의존성 추가, 폴더 구조 변경처럼 **영향 범위가 큰 변경**은 PR 전에 GitHub Issue/Discussion으로 RFC를 올려 의견을 수렴합니다.
- 버그 픽스, 비공개 리팩터, 작은 prop 추가는 RFC 없이 PR로 진행 가능합니다.

### 2. 브랜치

```bash
git checkout -b feat/component-name
# 또는: fix/..., docs/..., refactor/..., chore/...
```

### 3. 개발

- **CLAUDE.md 컨벤션을 엄격하게 따릅니다** — JSDoc, import 순서, 파일당 500줄, 네이밍 등.
- 모든 컴포넌트는 다음을 포함:
  - `forwardRef` + `displayName`
  - `{ComponentName}Props` 타입 export
  - 토큰 CSS 변수만 사용 (하드코딩 금지)
  - 단위 테스트 3+ (렌더 / 인터랙션 / a11y)
  - axe-core 0 violations

### 4. Changeset 추가

사용자에게 노출되는 변경(신규 컴포넌트, props 추가/변경, 토큰 변경, 시각 변경 등)은 반드시:

```bash
pnpm changeset
```

으로 변경 종류를 기록합니다. 룰:

- **patch** — 버그 수정, 내부 리팩터, 비파괴
- **minor** — 신규 컴포넌트, 신규 props (비파괴)
- **major** — Breaking change (props 시그니처 변경, 토큰 이름 변경, 컴포넌트 제거)

### 5. 커밋 — Conventional Commits

```
<type>(<scope>): <subject>

<body>

<footer>
```

`type`은 다음 중 하나:

| Type       | 설명                         |
| ---------- | ---------------------------- |
| `feat`     | 신규 기능                    |
| `fix`      | 버그 수정                    |
| `docs`     | 문서만 변경                  |
| `style`    | 코드 의미 변경 없는 포맷팅   |
| `refactor` | 기능 변경 없는 코드 재구조화 |
| `perf`     | 성능 개선                    |
| `test`     | 테스트 추가/수정             |
| `build`    | 빌드 시스템/외부 의존성      |
| `ci`       | CI 설정/스크립트             |
| `chore`    | 그 외 자잘한 작업            |

예시:

- `feat(button): add asChild support`
- `fix(select): handle IME composition during search`
- `docs(readme): update install instructions`

### 6. PR 체크리스트

머지 전 다음을 모두 통과해야 합니다 (CI가 자동 검증):

- [ ] `pnpm -w lint` 통과 (max-warnings 0)
- [ ] `pnpm -w typecheck` 통과
- [ ] `pnpm -w test` 통과 (axe-core 포함)
- [ ] `pnpm -w build` 성공
- [ ] `pnpm --filter @baneung-pack/ui size` 회귀 없음
- [ ] Changeset 추가됨 (사용자 노출 변경의 경우)
- [ ] 데모 사이트에 새 컴포넌트/변경 반영
- [ ] CLAUDE.md 컨벤션 준수 (주석, import, 네이밍)

PR 설명에는 다음을 포함:

- 변경 요약 + 동기
- 시각 변경 시 before/after 스크린샷
- Breaking change 시 마이그레이션 가이드

---

## 릴리스 프로세스

릴리스는 [Changesets](https://github.com/changesets/changesets)로 자동화되어 있습니다.

### 자동 (권장)

1. PR이 main에 머지되면 GitHub Actions가 "Version Packages" PR을 자동 생성
2. 해당 PR에 누적된 changeset이 CHANGELOG.md로 변환
3. PR 머지 시 자동으로 npm publish + GitHub Release 작성

### 수동 (긴급 패치 등)

```bash
pnpm changeset version       # 누적 changeset → 버전 bump + CHANGELOG
git add . && git commit -m "chore: version packages"
pnpm release                 # 빌드 + npm publish
git tag -a v$(version)
git push --follow-tags
```

---

## 디자인 결정 이의 제기

- 새 의존성 추가는 [CLAUDE.md §3 표](./CLAUDE.md#3-기술-스택-확정)에 등재된 것만. 추가 필요 시 PR 전에 RFC 필수.
- 디자인 토큰 신규/수정은 PROJECT_PLAN §7 토큰 규약을 준수하되, 영향 범위 분석을 PR에 포함.
- 라디우스는 `0` / `2px` / `4px` 외 추가 금지 (각진 디자인 강제).

---

## 질문 / 도움

GitHub Discussions에 자유롭게 글 남기거나, 이슈를 열어 주세요.
