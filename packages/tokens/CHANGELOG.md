# @baneung-pack/tokens

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
