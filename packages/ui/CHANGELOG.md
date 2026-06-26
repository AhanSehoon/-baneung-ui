# @baneung-pack/ui

## 2.0.0

### Major Changes

- # BREAKING — Calendar 재구현

  기존 `Calendar`(react-day-picker 단순 래퍼)를 제거하고, **월간 일정 캘린더**(Google Calendar 월간 뷰 스타일)로 교체.

  ## Before (v1.x)

  ```tsx
  <Calendar mode="single" selected={date} onSelect={setDate} />
  ```

  ## After (v2.x)

  ```tsx
  <Calendar
    events={[
      { id: '1', start, end, title: '회의', color: 'blue' },
      { id: '2', start, end, title: '워크샵', color: 'green' },
    ]}
    onEventClick={(e) => ...}
    onEventMove={(e, start, end) => ...}
  />
  ```

  ## 마이그레이션
  - 날짜 선택(date picking) 용도라면 **`DatePicker` 컴포넌트 사용** — 내부적으로 date-picking grid 유지.
  - 일정 표시 용도라면 신규 Calendar API로 — `events` prop 필수.

  ## Calendar 신규 기능
  - 1일 일정 + 다일 range 일정 (가로 막대) + 주 경계 ◀/▶ 분할 + greedy lane 알고리즘 (다중 일정 세로 스택)
  - "+N 더보기" Popover · HTML5 드래그-드롭 이동 (`onEventMove`)
  - 한글 기본 + `locale: 'ko' | 'en' | 'ja' | 'zh-CN' | date-fns Locale`
  - 년/월 변경 — 토큰화 Radix Popover 드롭다운 (✓ 체크 / 자동 스크롤 / 토큰 스크롤바)
  - 일/토 색상 구분, 오늘 강조, outside days 회색

  ## DatePicker 캡션 일관화
  - 자체 `MonthCaption` 적용 — `‹ / 2026년 ▾ / 6월 ▾ / ›` 한 줄 가로 정렬
  - 같은 Popover 드롭다운 디자인 공유 (Calendar와 일관)

  ***

  # 새 컴포넌트 — `@baneung-pack/effect`에서 통합 이전 (7+)
  - **AnimatedButton** — idle → loading → success/error 모핑 (Promise 자동 처리)
  - **AnimatedTabs** — 활성 인디케이터 슬라이드 탭 + Arrow 키
  - **CopyButton** — 클립보드 복사 + 아이콘 모핑 + 툴팁
  - **LikeButton** — 하트 + burst 입자 + 카운트
  - **StarRating** — 별점 (half/hover/키보드/readOnly)
  - **Stepper** — 다단계 진행 표시기 (horizontal/vertical, 연결선 애니메이션)
  - **Dots / Bars / Ring** — 추가 Loader 변형 (Spinner 외)
  - **Skeleton 강화** — `variant='shimmer'` 추가 + `SkeletonText` · `SkeletonCircle` 헬퍼

  ***

  # 수정 / 개선

  ## globals.css — focus 시각 분리
  - 전역 `:focus-visible { outline }` 규칙을 `:not(input):not(textarea):not(select)`로 범위 축소 → form 컨트롤은 wrapper/컴포넌트가 자체 포커스 시각 책임
  - `input/textarea/select` native focus outline 제거 + caret-color 토큰화
  - 데이터 컴포넌트가 일관된 focus indicator를 제공하도록 디자인 시스템 일관성 회복

  ## Select — `ring-inset` 시각 + accent bar
  - 강조된 옵션이 보더 클리핑되지 않게 좌측 accent bar 패턴 적용

  ## Command — 검색 입력 outline 제거
  - Wrapper의 `focus-within:border-ring` 으로 포커스 시각화 — 상단 클리핑 이슈 해결

  ## NavigationMenu — Viewport / Content 위치 수정
  - Viewport wrapper `inset-x-0` + Viewport `w-full md:w-(--radix-...)` — sm 화면에서 viewport가 0px로 잘리는 버그 수정
  - Content `md:absolute md:w-auto` — 트리거와 겹치지 않게 데스크톱에서 Viewport에 portal
  - 불안정한 motion 애니메이션 제거 → opacity 0 잔류 버그 해결

## 1.0.12

### Patch Changes

- 5565f16: `Select`: Dialog/Sheet/Drawer 내부에서 옵션 리스트의 휠 스크롤이 동작하지 않던 버그 수정.

  # 원인

  Radix Dialog(및 그 위에 빌드된 Sheet)는 `react-remove-scroll`을 적용해
  document-level capture 단계에서 자기 트리 밖의 wheel/touchmove 이벤트를
  `preventDefault()` 처리한다. `Select`의 옵션 리스트는 `Popover.Portal`로
  `document.body`에 portal되어 Dialog의 scroll-lock 허용 영역 **밖**에 위치 →
  CommandList의 `overflow-y-auto`가 휠로는 작동하지 않았다.

  # 수정

  트리거의 가장 가까운 `[role="dialog"]` 조상을 찾아, 있으면 그 요소를
  `Popover.Portal`의 `container`로 지정. Dialog 트리 내부면 react-remove-scroll이
  허용한다. Dialog/Sheet/Drawer(vaul도 `role="dialog"`) 모두에 적용.
  일반 컨텍스트에선 `container=undefined` → 기본 `document.body`로 portal되어
  기존 동작 그대로 유지.

## 1.0.11

### Patch Changes

- README 데모 사이트 URL을 새 커스텀 도메인으로 갱신:
  - 이전: https://baneung-ui-docs-op7v.vercel.app
  - 변경: https://ui.baneung.com

  코드 변경 없음. README 링크 한 줄 갱신.

## 1.0.10

### Patch Changes

- 라이선스를 Apache-2.0으로 통일.

  # 공통 변경
  - README의 라이선스 배지/푸터 MIT → Apache-2.0

  # `@baneung-pack/grid`만 추가
  - `autoSize` prop 신규 — 부모 컨테이너에 꽉 맞춰 자동 리사이즈
    (활성 시 outer가 `h-full w-full`, scroll이 `flex-1 min-h-0` →
    부모 div 크기에 따라 그리드가 자동 확장)

  # `@baneung-pack/tokens`만 추가
  - `package.json#license: "Apache-2.0"` 신규 추가 (이전엔 license 필드 누락)
  - 패키지 루트에 LICENSE 파일 동봉

  # `@baneung-pack/ui`
  - 코드 변경 없음. README 배지 업데이트만.

## 1.0.9

### Patch Changes

- 라이선스를 **Apache-2.0**으로 명시.

  # 변경
  - `package.json#license: "Apache-2.0"` 추가
  - 패키지 루트에 `LICENSE` 파일 (Apache-2.0 전문) 추가
  - `package.json#files`에 LICENSE 명시 포함

  npmjs.com 패키지 페이지에서 라이선스가 Apache-2.0으로 표시됨.

## 1.0.8

### Patch Changes

- Select 키보드 네비게이션 — Dialog/Drawer/Sheet 등 부모 FocusScope 안에서도 ↑↓ 동작.

  # 문제

  Select가 Dialog/Drawer/Sheet 등의 안에 있을 때, Popover.Content가 portal로
  document.body에 렌더되므로 부모 FocusScope가 "범위 밖"으로 인지하고 cmdk Input에서
  trigger 버튼으로 포커스를 되돌림 → 방향키 무반응.

  # 수정 (2단계 방어)
  1. **다단계 강제 포커스** — onOpenAutoFocus에서 즉시 + requestAnimationFrame +
     setTimeout 3번 포커스 호출. 부모 FocusScope의 보정 timing race를 모두 커버.
  2. **키 이벤트 캡처 fallback** — Popover.Content에서 ↑↓/Enter/Home/End/PageUp/PageDown
     입력 시 Input이 활성 상태가 아니면 포커스 옮기고 같은 키 이벤트를 Input에 재dispatch.
     첫 키 입력도 손실 없이 처리.

## 1.0.7

### Patch Changes

- Select 키보드 네비게이션 수정 — `searchable=false` 모드에서도 ↑↓ 방향키와 Enter로 옵션 순회·선택이 가능합니다.

  # 문제

  cmdk + Radix Popover 조합에서 Popover.Content가 열릴 때 자기 자신에게 포커스를 잡아
  cmdk Input/Command가 키보드 이벤트(↑↓, Enter)를 받지 못함. 특히 `searchable=false`에선
  CommandInput이 아예 렌더되지 않아 키 이벤트를 처리할 노드가 없었음.

  # 수정
  - `CommandInput`을 항상 DOM에 유지 — `searchable=false`일 땐 `sr-only`로 시각적으로만 숨김
  - `Popover.Content`의 `onOpenAutoFocus`에서 `preventDefault()` 후 input으로 포커스 위임
  - `shouldFilter={searchable}` — 비검색 모드는 필터링 비활성화 (Input은 키 이벤트 캐처 역할)
  - 검색어 state controlled — popover 닫힐 때 자동 리셋

  # 검증
  - 신규 키보드 네비게이션 테스트 2개 (검색/비검색 양쪽)
  - 기존 Select 테스트 11개 전부 통과

## 1.0.6

### Patch Changes

- `'use client'` 주입을 React/Radix import가 있는 파일에만 선택적으로 적용 (1.0.5 / 0.8.1 회귀 수정).

  # 문제

  1.0.5 / 0.8.1에서 dist의 모든 .js/.cjs 파일에 무차별로 `'use client'`를 주입했더니
  `cn` 같은 순수 유틸리티까지 client-only가 되어 Next.js 서버 컴포넌트에서 호출 불가:

  ```
  Error: Attempted to call cn() from the server but cn is on the client.
  ```

  # 수정

  `react` / `react-dom` / `react/jsx-runtime` / `@radix-ui/*` / `@tanstack/react-*` /
  `sonner` / `lucide-react` / `cmdk` / `vaul` 중 하나라도 import하는 파일에만
  `'use client'`를 주입.
  - 컴포넌트 chunk (Radix 기반, hook 사용) → 주입 ✅
  - 유틸리티 chunk (cn, 순수 함수) → 미주입 ✅
  - 서버 컴포넌트에서 `cn`, 타입 export 등 직접 호출 가능

## 1.0.5

### Patch Changes

- 1b22226: Next.js App Router (RSC) 호환 — 빌드 출력물에 `'use client';` 디렉티브 주입.

  대부분 컴포넌트가 Radix UI 기반(내부 hook) 또는 자체 hook을 사용하므로 Next.js
  서버 컴포넌트에서 직접 import 시 런타임 오류가 발생하던 문제를 해결.

  # 변경
  - `tsup` `onSuccess`에서 `dist/**/*.{js,cjs}` 모든 파일의 최상단에 `'use client';` 삽입
  - ESM/CJS 양쪽 + 코드 스플리팅 chunk 파일 모두 적용
  - 소비자 측에서 추가 설정 없이 RSC 환경에서 그대로 사용 가능

## 1.0.4

### Patch Changes

- README의 "CSS 격리 (Cascade Layers)" 섹션을 실전 검증 기반으로 재작성.

  이전 안내(`@layer app, baneung;` + import 순서 swap으로 라이브러리 강제 우선)는
  같은 utility(예: `.hidden` ↔ `.md:flex`)가 양쪽 번들에 존재할 때 cross-layer로
  충돌해 반응형 패턴이 깨지는 함정이 있음. 새 README에서는:
  - 패턴 A: 소비자가 본인 글로벌 CSS를 `@layer app`으로 감싸 라이브러리 override
  - 패턴 B (권장): 소비자가 Tailwind를 함께 쓸 때 preflight를 제외하고 import해
    preflight↔utility 충돌 자체를 회피하고, unlayered utility로 자연스럽게
    layered 라이브러리 utility를 override

  데모 사이트(apps/docs)도 패턴 B로 적용 검증 완료.

## 1.0.3

### Patch Changes

- README의 "CSS 격리 (Cascade Layers)" 섹션 보강. CSS Cascade Layer는 처음
  등록된 시점의 위치가 우선순위를 결정하기 때문에 layer 선언 순서뿐 아니라
  import 순서도 함께 맞춰야 한다는 점을 명시. 두 시나리오(소비자 override /
  라이브러리 강제 우선) 각각의 import + layer 선언 패턴을 예시로 안내.

## 1.0.2

### Patch Changes

- CSS Cascade Layers로 스타일 격리: 라이브러리의 모든 스타일을
  `@layer baneung` 안에 wrap. 소비자 프로젝트의 글로벌 CSS가 의도치 않게
  컴포넌트 스타일을 덮어쓰는 문제 해결. 자세한 사용법은 README의
  "CSS 격리 (Cascade Layers)" 섹션 참고.

  README에 데모 사이트 링크 추가: https://ui.baneung.com

## 1.0.1

### Patch Changes

- 각 패키지에 npm 페이지용 README 추가. 설치/사용법/컴포넌트 목록(@baneung-pack/ui),
  토큰 카테고리(@baneung-pack/tokens) 안내. 코드 변경 없음.

## 1.0.0

### Major Changes

- e57ce1b: # 1.0.0 — 초기 출시

  바능 디자인 시스템의 첫 안정 버전입니다.

  ## @baneung-pack/ui (58 컴포넌트)
  - **Foundation**: Typography(Heading/Text/Lead/Muted/Code), Separator, AspectRatio, Skeleton, Spinner, Empty, Avatar, Badge, Kbd, Label
  - **Buttons & Toggles**: Button(asChild·loading·variants·cursor-pointer), ButtonGroup, Toggle, ToggleGroup
  - **Inputs**: Input(좌/우 adornment 고정폭), InputGroup, InputOTP, Textarea, Field(컨텍스트 자동 a11y), Checkbox(indeterminate), RadioGroup(horizontal/vertical), Switch, Slider
  - **Selection**: Select(single+multi+searchable, "X 외 N개" 라벨), NativeSelect, Combobox, Command, Calendar(en/ko 로케일 + 월/년 dropdown), DatePicker
  - **Layout**: Card, Item, Sidebar, Resizable, ScrollArea, Direction
  - **Navigation**: Tabs, Breadcrumb, Pagination(uncontrolled 기본 1, ellipsis 압축), NavigationMenu, Menubar
  - **Overlay**: Dialog, AlertDialog, Drawer(vaul), Sheet, Popover, HoverCard, Tooltip, DropdownMenu, ContextMenu
  - **Feedback**: Alert(stacked title/description), Toast(sonner), Sonner, Progress
  - **Data Display**: Accordion(w-full 고정), Collapsible, Table, DataTable(@tanstack/react-table), Carousel(embla)

  ## @baneung-pack/tokens
  - 컬러: `bg`/`text`/`border`/`focus`/`status` 시맨틱 + `neutral`/`baneungNavy`/`baneungTeal` primitive
  - 라이트/다크 두 세트 — `[data-theme="dark"]` cascade
  - 타이포(Pretendard Variable), 스페이싱(4px 베이스), 라디우스(0/2/4 강제), 모션, z-index, breakpoint
  - 산출물: `tokens.css` / `tokens.json` / `tokens.js`

  ## 보장
  - WCAG 2.1 AA 색대비 자동 검증 (전수 bg×text 조합 라이트/다크)
  - axe-core 0 violations (모든 컴포넌트 테스트)
  - 한글 IME composition 안전성 (Input, Textarea, InputOTP, Select 검색)
  - React 18 / 19 호환 (`peerDependencies`)
  - 트리쉐이커블 ESM/CJS dual + subpath import 지원
