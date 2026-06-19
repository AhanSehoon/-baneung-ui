# @baneung-pack/tokens

## 1.0.3

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

## 1.0.2

### Patch Changes

- CSS Cascade Layers로 스타일 격리: 라이브러리의 모든 스타일을
  `@layer baneung` 안에 wrap. 소비자 프로젝트의 글로벌 CSS가 의도치 않게
  컴포넌트 스타일을 덮어쓰는 문제 해결. 자세한 사용법은 README의
  "CSS 격리 (Cascade Layers)" 섹션 참고.

  README에 데모 사이트 링크 추가: https://baneung-ui-docs-op7v.vercel.app

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
