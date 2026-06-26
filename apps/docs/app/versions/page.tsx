'use client';

import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Heading,
  Lead,
  Muted,
  Separator,
} from '@baneung-pack/ui';

import { useI18n } from '@/components/i18n-provider';

type VersionType = 'major' | 'minor' | 'patch';

interface VersionEntry {
  version: string;
  type: VersionType;
  summary: string;
  details: string[];
}

interface PackageHistory {
  pkg: string;
  current: string;
  npmUrl: string;
  entries: VersionEntry[];
}

// ─────────────────────────────────────────────────────────────────────────────
// 데이터 — 각 패키지 CHANGELOG.md 기반. 최신이 위.
// ─────────────────────────────────────────────────────────────────────────────

const uiHistory: PackageHistory = {
  pkg: '@baneung-pack/ui',
  current: '1.0.12',
  npmUrl: 'https://www.npmjs.com/package/@baneung-pack/ui',
  entries: [
    {
      version: '1.0.12',
      type: 'patch',
      summary: 'Select: Dialog/Sheet/Drawer 내부에서 옵션 휠 스크롤 동작 수정',
      details: [
        '원인: Radix Dialog의 react-remove-scroll이 트리 밖 wheel/touchmove를 preventDefault → Popover.Portal로 document.body에 띄운 옵션 리스트가 휠 무반응',
        '수정: 트리거에서 가장 가까운 [role="dialog"] 조상을 찾아 Popover.Portal의 container로 지정 — Dialog/Sheet/Drawer(vaul 포함) 모두 적용',
        '일반 컨텍스트(Dialog 밖)에서는 기존대로 document.body에 portal',
      ],
    },
    {
      version: '1.0.11',
      type: 'patch',
      summary: 'README 데모 사이트 URL을 새 커스텀 도메인으로 갱신',
      details: [
        '이전: https://baneung-ui-docs-op7v.vercel.app',
        '변경: https://ui.baneung.com',
        '코드 변경 없음. README 링크 한 줄 갱신.',
      ],
    },
    {
      version: '1.0.10',
      type: 'patch',
      summary: 'README 라이선스 배지 Apache-2.0으로 통일 (코드 변경 없음)',
      details: [
        'README의 MIT 배지·푸터를 Apache-2.0으로 교체',
        'npmjs.com 페이지에 노출되는 라이선스 표기 일관성',
      ],
    },
    {
      version: '1.0.9',
      type: 'patch',
      summary: '라이선스를 Apache-2.0으로 명시',
      details: [
        'package.json#license: "Apache-2.0" 추가',
        '패키지 루트에 LICENSE 파일 (Apache-2.0 전문) 동봉',
        'npmjs.com 페이지에 라이선스 표시됨',
      ],
    },
    {
      version: '1.0.8',
      type: 'patch',
      summary: 'Select 키보드 네비게이션 — Dialog/Drawer/Sheet 등 popup 안에서도 ↑↓ 동작',
      details: [
        'Popover.Content가 portal로 body에 렌더 → 부모 FocusScope가 trigger로 포커스 되돌리던 문제',
        '다단계 강제 포커스 — 즉시 + rAF + setTimeout 3번 호출로 race 커버',
        '키 이벤트 캡처 fallback — Input이 비활성 상태일 때 포커스 옮기고 키 이벤트 재dispatch',
      ],
    },
    {
      version: '1.0.7',
      type: 'patch',
      summary: 'Select 키보드 네비게이션 수정 — searchable=false에서도 ↑↓·Enter 동작',
      details: [
        'cmdk + Radix Popover 조합에서 Popover.Content가 자기 자신에게 포커스를 잡아 키 이벤트가 cmdk에 전달되지 않던 문제',
        'CommandInput을 항상 DOM에 유지(searchable=false일 땐 sr-only) → 키 이벤트 캐처 역할',
        'Popover.Content.onOpenAutoFocus에서 input으로 포커스 위임',
        'shouldFilter={searchable}로 비검색 모드는 필터링 비활성화',
        '신규 키보드 네비게이션 테스트 2개 (검색/비검색 양쪽)',
      ],
    },
    {
      version: '1.0.6',
      type: 'patch',
      summary: "'use client' 주입을 React/Radix 사용 파일에만 선택적으로 적용 (1.0.5 회귀 수정)",
      details: [
        "1.0.5에서 cn 같은 순수 유틸리티까지 client-only가 되어 'Attempted to call cn() from the server' 에러 발생",
        'react / react-dom / @radix-ui / @tanstack/react-* / sonner / lucide-react / cmdk / vaul import가 있는 파일에만 주입',
        '서버 컴포넌트에서 cn, 타입 등 직접 호출 가능',
      ],
    },
    {
      version: '1.0.5',
      type: 'patch',
      summary:
        "Next.js App Router (RSC) 호환 — 빌드 출력물에 'use client' 디렉티브 주입 (1.0.6에서 회귀 수정)",
      details: [
        '대부분 컴포넌트가 Radix UI 기반(내부 hook) 또는 자체 hook 사용 → 서버 컴포넌트에서 직접 import 시 런타임 오류 발생하던 문제 해결',
        'tsup onSuccess에서 dist 출력물 모든 .js / .cjs 파일 최상단에 자동 주입',
        '단, 무차별 주입으로 cn 유틸리티가 깨지는 문제가 있어 1.0.6에서 선택적 주입으로 보강',
      ],
    },
    {
      version: '1.0.4',
      type: 'patch',
      summary: 'README "CSS 격리 (Cascade Layers)" 섹션을 실전 검증 기반으로 재작성',
      details: [
        '패턴 A: 소비자가 본인 글로벌 CSS를 @layer app으로 감싸 라이브러리 override',
        '패턴 B (권장): 소비자가 Tailwind를 함께 쓸 때 preflight 제외 import해 preflight↔utility 충돌 회피',
        '데모 사이트(apps/docs)도 패턴 B로 적용 검증 완료',
      ],
    },
    {
      version: '1.0.3',
      type: 'patch',
      summary: 'README "CSS 격리" 섹션 보강 — layer 등록 시점 + import 순서 명시',
      details: [
        'CSS Cascade Layer는 처음 등록된 시점의 위치가 우선순위를 결정',
        '두 시나리오(소비자 override / 라이브러리 강제 우선) 각각의 import + layer 선언 패턴 예시',
      ],
    },
    {
      version: '1.0.2',
      type: 'patch',
      summary: 'CSS Cascade Layers로 스타일 격리 (@layer baneung)',
      details: [
        '라이브러리 모든 스타일을 @layer baneung 안에 wrap',
        '소비자 글로벌 CSS의 의도치 않은 override 문제 해결',
        'README에 데모 사이트 링크 추가',
      ],
    },
    {
      version: '1.0.1',
      type: 'patch',
      summary: 'npm 페이지용 README 추가 (코드 변경 없음)',
      details: [
        '각 패키지에 설치/사용법/컴포넌트 목록 README 추가',
        'npmjs.com에 표시될 페이지 콘텐츠',
      ],
    },
    {
      version: '1.0.0',
      type: 'major',
      summary: '초기 출시 — 58개 React 컴포넌트 (Radix UI 기반)',
      details: [
        'Foundation: Typography · Separator · AspectRatio · Skeleton · Spinner · Empty · Avatar · Badge · Kbd · Label',
        'Buttons & Toggles: Button(asChild·loading·variants) · ButtonGroup · Toggle · ToggleGroup',
        'Inputs: Input(좌/우 adornment) · InputGroup · InputOTP · Textarea · Field · Checkbox(indeterminate) · RadioGroup · Switch · Slider',
        'Selection: Select(single/multi/searchable) · NativeSelect · Combobox · Command · Calendar · DatePicker',
        'Layout: Card · Item · Sidebar · Resizable · ScrollArea · Direction',
        'Navigation: Tabs · Breadcrumb · Pagination · NavigationMenu · Menubar',
        'Overlay: Dialog · AlertDialog · Drawer · Sheet · Popover · HoverCard · Tooltip · DropdownMenu · ContextMenu',
        'Feedback: Alert · Toast · Sonner · Progress',
        'Data Display: Accordion · Collapsible · Table · DataTable · Carousel',
        'WCAG 2.1 AA · axe-core 0 violations · 한글 IME 안전 · React 18/19 호환 · 트리쉐이커블 ESM/CJS',
      ],
    },
  ],
};

const tokensHistory: PackageHistory = {
  pkg: '@baneung-pack/tokens',
  current: '1.0.4',
  npmUrl: 'https://www.npmjs.com/package/@baneung-pack/tokens',
  entries: [
    {
      version: '1.0.4',
      type: 'patch',
      summary: 'README 데모 사이트 URL을 새 커스텀 도메인으로 갱신',
      details: [
        '이전: https://baneung-ui-docs-op7v.vercel.app',
        '변경: https://ui.baneung.com',
        '코드 변경 없음.',
      ],
    },
    {
      version: '1.0.3',
      type: 'patch',
      summary: '라이선스를 Apache-2.0으로 명시',
      details: [
        'package.json#license: "Apache-2.0" 신규 추가 (이전엔 license 필드 누락)',
        '패키지 루트에 LICENSE 파일 (Apache-2.0 전문) 동봉',
        'README의 MIT 배지·푸터를 Apache-2.0으로 교체',
        'npmjs.com 페이지에 라이선스 표시됨',
      ],
    },
    {
      version: '1.0.2',
      type: 'patch',
      summary: 'CSS Cascade Layers로 스타일 격리 (@layer baneung)',
      details: ['ui와 같이 @layer baneung에 래핑', '데모 사이트 링크 추가'],
    },
    {
      version: '1.0.1',
      type: 'patch',
      summary: 'npm 페이지용 README 추가',
      details: ['토큰 카테고리 안내. 코드 변경 없음'],
    },
    {
      version: '1.0.0',
      type: 'major',
      summary: '초기 출시 — CSS / JSON / TS 토큰 SSOT',
      details: [
        '컬러: bg/text/border/focus/status 시맨틱 + neutral/baneungNavy/baneungTeal primitive',
        '라이트/다크 두 세트 — [data-theme="dark"] cascade',
        '타이포(Pretendard Variable) · 스페이싱(4px) · 라디우스(0/2/4) · 모션 · z-index · breakpoint',
        '산출물: tokens.css / tokens.json / tokens.js',
      ],
    },
  ],
};

const gridHistory: PackageHistory = {
  pkg: '@baneung-pack/grid',
  current: '0.9.1',
  npmUrl: 'https://www.npmjs.com/package/@baneung-pack/grid',
  entries: [
    {
      version: '0.9.1',
      type: 'patch',
      summary: 'README 데모 사이트 URL을 새 커스텀 도메인으로 갱신',
      details: [
        '이전: https://baneung-ui-docs-op7v.vercel.app',
        '변경: https://ui.baneung.com',
        '코드 변경 없음.',
      ],
    },
    {
      version: '0.9.0',
      type: 'minor',
      summary: '관리자 화면 · 대용량 · Excel 환경 핵심 기능 대규모 추가',
      details: [
        'XLSX 내보내기 (exportXlsx ref API) — exceljs 동적 로드, 번들 미포함',
        'Excel 호환 Ctrl+C/V 클립보드 (clipboard prop, TSV 직렬화)',
        '빠른 검색 (quickFilter) — 모든 visible 컬럼 부분 일치',
        '다중 컬럼 정렬 (Shift+클릭) + 헤더 순서 번호 표시',
        '컬럼 폭 드래그 조절 (resizable + onColumnResize)',
        '컬럼 고정 좌/우 (column.pin) — 가로 스크롤 시 sticky',
        '컬럼 순서 변경 (reorderable) — 헤더 drag&drop, pin 경계 유지',
        '컬럼 표시/숨김 (showColumnMenu + columnVisibility)',
        '합계 행 (showFooter + column.aggregate) — sum/avg/count/min/max/함수',
        '조건부 셀 스타일 (column.cellStyle / cellClassName)',
        '키보드 네비게이션 — 화살표/Tab/Enter/Home·End/Ctrl+Home·End',
        '우클릭 컨텍스트 메뉴 (contextMenu) — 기본 또는 함수형 커스텀',
        '설정 자동 저장 (viewKey) — 정렬/폭/표시/순서 localStorage 영속화',
        'editCell stale closure 버그 fix (paste 같은 다중 컬럼 동시 입력 정확)',
      ],
    },
    {
      version: '0.8.4',
      type: 'patch',
      summary: 'autoSize prop 신규 — 부모 컨테이너에 꽉 맞춰 자동 리사이즈',
      details: [
        '활성 시 outer가 h-full w-full + scroll이 flex-1 min-h-0 → 부모 div 100% 채움',
        '페이지네이션 푸터는 자동으로 바닥에 고정',
        '부모 크기 변경 시 자동 반영 (virtualizer 내장 ResizeObserver)',
        'height prop은 무시. 기본 false → 기존 동작 그대로 (backwards-compatible)',
        'README의 MIT 배지·푸터를 Apache-2.0으로 함께 교체',
      ],
    },
    {
      version: '0.8.3',
      type: 'patch',
      summary: '라이선스를 Apache-2.0으로 명시',
      details: [
        'package.json#license: "Apache-2.0" 추가',
        '패키지 루트에 LICENSE 파일 (Apache-2.0 전문) 동봉',
        'npmjs.com 페이지에 라이선스 표시됨',
      ],
    },
    {
      version: '0.8.2',
      type: 'patch',
      summary: "'use client' 주입을 React/Radix 사용 파일에만 선택적으로 적용 (0.8.1 회귀 수정)",
      details: [
        '0.8.1의 무차별 주입으로 순수 유틸리티(csv 빌더 등)까지 client-only가 되던 문제 수정',
        'react / @radix-ui / @tanstack/react-* import가 있는 파일에만 주입',
      ],
    },
    {
      version: '0.8.1',
      type: 'patch',
      summary:
        "Next.js App Router (RSC) 호환 — 빌드 출력물에 'use client' 디렉티브 주입 (0.8.2에서 회귀 수정)",
      details: [
        '가상화/state/ref 전반 사용 → RSC 환경에서 client 필수',
        'tsup onSuccess에서 dist 출력물 모든 .js / .cjs 파일 최상단에 자동 주입',
        '무차별 주입으로 순수 유틸리티가 깨지는 문제는 0.8.2에서 선택적 주입으로 수정',
      ],
    },
    {
      version: '0.8.0',
      type: 'minor',
      summary: 'CSV 다운로드 — GridHandle.exportCsv',
      details: [
        'exportCsv(filename?, options?) — UTF-8 BOM + Excel 호환',
        'options.rows로 명시 행만 export (변경분만 / 외부 필터 결과 등)',
        '미지정 시 getSavedData() 사용 (편집 반영, 삭제 제외)',
        '새 helper: buildCsv, downloadCsv (csv.ts)',
      ],
    },
    {
      version: '0.7.0',
      type: 'minor',
      summary: 'Filter popover Portal · cell-selection · row add/remove · Delete 키',
      details: [
        'Filter popover: react-dom Portal로 document.body 렌더 → 스크롤 컨테이너에 안 잘림',
        'cellSelection: "none" | "single" | "multi" (드래그 사각형 영역 다중 선택)',
        'addRow(row, position): "first" | "last" | "above-active" | "below-active"',
        'removeSelectedRows() / clearSelectedCells()',
        'clearOnDelete: Delete/Backspace로 선택 셀 값 클리어',
      ],
    },
    {
      version: '0.6.0',
      type: 'minor',
      summary: '필터 UX를 Excel/AUIGrid 스타일 popover로 교체',
      details: [
        '헤더에 funnel 아이콘 → 클릭 시 popover',
        '"필터 초기화" + 검색 + "(전체선택)" + 각 값 + "(필드 값 없음)" 체크박스',
        '확인(적용) / 취소(폐기) 버튼',
        '외부 클릭 / Escape로 닫힘 (draft 폐기)',
      ],
    },
    {
      version: '0.5.0',
      type: 'minor',
      summary: '헤더 정렬(sort) + 필터(filter)',
      details: [
        'column.sortable — 헤더 클릭으로 3-state (↕ → ▲ asc → ▼ desc → 해제)',
        'column.filterable — 헤더 아래 input (부분 일치, case-insensitive)',
        '값 비교: null 후순위, Date timestamp, number 산술, 그 외 localeCompare(numeric)',
        '트리 모드는 sort skip (hierarchy 보존)',
      ],
    },
    {
      version: '0.4.1',
      type: 'patch',
      summary: '진행률 바 fill 색이 표시되지 않던 문제 수정',
      details: [
        'grid의 @theme inline에 status 컬러(--color-success/danger/warning/info) 매핑 누락',
        'bg-success utility가 색을 못 받아 fill 바가 투명했음',
      ],
    },
    {
      version: '0.4.0',
      type: 'minor',
      summary: '빌트인 셀 에디터 (dropdown · date · number) + 렌더러 (progress · date)',
      details: [
        "column.editor: 'text' | 'number' | 'date' | 'dropdown' (네이티브 input)",
        "column.renderer: 'progress' (진행률 바) / 'date' (포맷팅)",
        'column.options / min / max / dateFormat 필드 추가',
        'aria-progressbar / aria-valuenow / combobox role 표준',
      ],
    },
    {
      version: '0.3.0',
      type: 'minor',
      summary: 'Tree (계층) 모드',
      details: [
        'tree prop + getChildren으로 중첩 데이터 계층 표시',
        '첫 컬럼에 caret(▶/▼) + 들여쓰기 자동 삽입',
        "defaultExpandedIds: 'all' | 'none' | id 배열",
        '가상화·페이지네이션 호환',
      ],
    },
    {
      version: '0.2.0',
      type: 'minor',
      summary: '초기 publish — 가상화 · 페이지네이션 · 인라인 편집 · 행 선택 · ref API',
      details: [
        '가상화 토글 (virtualized) — @tanstack/react-virtual 기반',
        '내장 페이지네이션 + 외부 페이징 controlled 모드',
        '인라인 편집 (editable: true) + 한글 IME 안전',
        '행 선택 체크박스 (selectable)',
        'Imperative API: getSavedData / getChangedData / getDeletedData / deleteSelected / clearSelection / reset',
        '@layer baneung에 격리',
      ],
    },
  ],
};

const chartHistory: PackageHistory = {
  pkg: '@baneung-pack/chart',
  current: '0.3.0',
  npmUrl: 'https://www.npmjs.com/package/@baneung-pack/chart',
  entries: [
    {
      version: '0.3.0',
      type: 'minor',
      summary: '웹 접근성(WCAG 2.1 AA) + 한글 숫자 포맷 + FlowChart 추가',
      details: [
        '신규 FlowChart — SVG 기반 노드-엣지 그래프 (chart.js 무관)',
        'FlowChart edge 4종 내장: straight / bezier / step / smoothstep',
        'FlowChart 사용자 정의 edge — edgeTypes prop에 SVG path 함수 등록',
        'FlowChart pan + zoom (마우스 드래그, 휠 in/out 커서 위치 기준)',
        'FlowChart 화살표 머리, edge 라벨, 흐름 애니메이션, 점선 옵션',
        '모든 차트에 a11yTable prop (기본 true) — sr-only <table>로 데이터 노출, 스크린리더 호환 (WCAG 1.1.1)',
        'a11yCaption prop — 표 caption (스크린리더가 먼저 읽음)',
        '모든 차트에 valueFormat prop — tooltip · 데이터 라벨 · y축 tick 일관 적용',
        "valueFormat='korean' → 125만 · 1.2억 · 1.5조 자동 변환",
        "valueFormat='comma' → 1,250,000 천 단위 콤마",
        '사용자 정의 함수: (n) => string 지원',
        'MapChart 삭제 — d3-geo, topojson-client peer dep 제거 (chart 패키지 범위 밖으로 판단)',
        'peer dep 5개 → 3개 감소 (chart.js, react-chartjs-2, chartjs-plugin-datalabels)',
      ],
    },
    {
      version: '0.2.0',
      type: 'minor',
      summary: '렌더링 엔진 교체: SVG(recharts) → Canvas(chart.js)',
      details: [
        '대용량 데이터 포인트에서 Canvas 기반이 메모리/페인트 비용이 낮음',
        'chart.js는 자체적으로 controller/scale/plugin tree-shaking 지원',
        'SVG DOM 트리 생성 비용 제거',
        'BREAKING: peer dep 교체 — recharts ^2.12.0 → chart.js ^4.4.0 + react-chartjs-2 ^5.2.0',
        'BREAKING: PieChart.outerRadius deprecated (chart.js 반응형 — px 외부 반지름 미지원)',
        'BREAKING: PieChart.innerRadius는 px 대신 0~1 비율로 변경 (chart.js cutout 매핑)',
        '공통 props는 시그니처 그대로 유지 — 마이그레이션은 dependencies 교체만으로 대부분 동작',
        'lib/chartjs-setup.ts에서 controller/scale/plugin 일괄 register (사용자 코드 register 불필요)',
        '"use client" 자동 주입 패턴 유지 (RSC 호환)',
      ],
    },
    {
      version: '0.1.0',
      type: 'minor',
      summary: '초도 출시 — recharts 기반 차트 라이브러리 (0.2.0에서 chart.js로 교체됨)',
      details: [
        'BarChart · LineChart · AreaChart · PieChart · DoughnutChart · ScatterChart · RadarChart · WaterfallChart · MixedChart 9종 (당시 recharts 기반)',
        '공통 props: data / xKey / yKeys / nameKey / valueKey / labels / colors / height / showGrid / showLegend / showTooltip / emptyState / className',
        '@baneung-pack/tokens 공유로 디자인 일관성',
      ],
    },
  ],
};

const editorHistory: PackageHistory = {
  pkg: '@baneung-pack/editor',
  current: '0.1.1',
  npmUrl: 'https://www.npmjs.com/package/@baneung-pack/editor',
  entries: [
    {
      version: '0.1.1',
      type: 'patch',
      summary: 'package.json description / keywords 갱신 (npm 검색 노출 보강)',
      details: [
        'description의 일부 표현 수정',
        'keywords 신규 추가: WYSIWYG · editor · rich-text-editor · react · contenteditable · design-system · baneung',
        'README에 키워드 강조 한 줄 추가',
        '소스/dist 변경 없음. npm 페이지 메타데이터만 업데이트.',
      ],
    },
    {
      version: '0.1.0',
      type: 'minor',
      summary: '초도 출시 — contentEditable 기반 리치 텍스트 WYSIWYG 에디터',
      details: [
        '풀스택 WYSIWYG 툴바: 굵게/기울임/밑줄/취소선, 글자색·형광펜, 글자 크기, 제목·인용구·코드 블록, 목록/들여쓰기, 정렬, 링크, 구분선, undo/redo, 서식 지우기, HTML 소스, 전체 화면',
        '이미지 클립보드 붙여넣기 · 드래그앤드롭 · 파일 선택 (기본 base64 인라인, onImageUpload로 서버 업로드 연동)',
        '제어/비제어 지원 — value/onChange 또는 defaultValue',
        'ref 명령형 API — getHTML · setHTML · insertHTML · focus',
        '반응형 — 툴바 자동 줄바꿈, 이미지 max-width:100%',
        '런타임 의존성 0 (clsx·tailwind-merge만) + @baneung-pack/tokens 공유',
        'React 18 / 19 호환, ESM/CJS dual export',
        '17개 단위 테스트 + axe-core 접근성 0 위반',
      ],
    },
  ],
};

const effectHistory: PackageHistory = {
  pkg: '@baneung-pack/effect',
  current: '0.1.0',
  npmUrl: 'https://www.npmjs.com/package/@baneung-pack/effect',
  entries: [
    {
      version: '0.1.0',
      type: 'minor',
      summary: '초도 출시 — 13개 React 비주얼 이펙트 (Tier 1 + 2 + 3)',
      details: [
        // Tier 1
        'Typewriter — 글자 타이핑 + 깜빡이는 커서 (1회 / 무한 loop), 크기·색·굵기·커서 글자 커스터마이즈',
        'RotatingWords — "We build [apps]" 단어 슬라이드+페이드 순환 (grid template-areas로 폭 자동 측정)',
        'ScrambleText — 해킹/디코딩 스타일, 글자 풀 커스텀 (카타카나/HEX/바이너리)',
        'SplitTextReveal — 글자/단어 단위 순차 페이드+슬라이드, mount/inView 트리거',
        'CountUp — 숫자 카운터 (천 단위·소수점·prefix/suffix·감소 카운트), easeOutCubic',
        // Tier 2
        'GradientText — flow / shimmer 모드, 색상 배열·방향 커스터마이즈',
        'BlurInText — 흐릿→선명 등장, by char/word/all, mount/inView 트리거',
        'WavyText — 글자가 파도치거나 통통 튐, 위상 차이로 자연스러운 파동',
        'GlitchText — RGB 채널 어긋남 글리치, intensity 조절·hover-only 옵션',
        // Tier 3
        'VariableFontHover — 커서 주변 글자만 굵어짐 (가변 폰트 보간, smoothstep falloff)',
        'CircularText — 원형 경로 회전 텍스트 (배지/도장 스타일)',
        'GravityText — 글자가 중력에 떨어지거나 흩어짐 (mount/hover/inView)',
        'SpotlightText — 커서 주변만 밝아지는 스포트라이트 (radial-gradient mask)',
        // 공통 인프라
        '공통 훅: useReducedMotion (a11y) + useInView (스크롤 reveal 표준화)',
        '0-dependency 코어 — React peer만, Tailwind 비종속 (inline style 기반)',
        '모든 컴포넌트 prefers-reduced-motion 자동 존중 (모션 줄임 시 정적 표시)',
        'aria-label로 원문을 스크린리더에 노출, 애니메이션 span은 aria-hidden',
        'ESM/CJS dual export + .d.ts, Next.js RSC 호환 (use client 자동 주입)',
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 렌더링
// ─────────────────────────────────────────────────────────────────────────────

function VersionTypeBadge({ type }: { type: VersionType }) {
  const variant = type === 'major' ? 'danger' : type === 'minor' ? 'secondary' : 'outline';
  const label = type === 'major' ? 'MAJOR' : type === 'minor' ? 'MINOR' : 'PATCH';
  return (
    <Badge variant={variant} className="text-[10px]">
      {label}
    </Badge>
  );
}

function PackageHistorySection({ history }: { history: PackageHistory }) {
  const { t } = useI18n();
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <Heading level={2} className="text-2xl">
          {history.pkg}
        </Heading>
        <div className="flex items-center gap-2">
          <Muted className="text-xs">
            {t('versions.current')}: <strong className="text-foreground">v{history.current}</strong>
          </Muted>
          <a
            href={history.npmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-foreground-muted underline hover:text-foreground"
          >
            npm
          </a>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {history.entries.map((entry) => (
          <Card key={entry.version} variant="outlined">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">v{entry.version}</CardTitle>
                <VersionTypeBadge type={entry.type} />
              </div>
              <CardDescription className="text-sm text-foreground">{entry.summary}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-foreground-muted">
                {entry.details.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default function VersionsPage() {
  const { t } = useI18n();
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>{t('versions.title')}</Heading>
        <Lead>{t('versions.lead')}</Lead>
      </header>

      <Separator />

      <PackageHistorySection history={uiHistory} />
      <Separator />
      <PackageHistorySection history={gridHistory} />
      <Separator />
      <PackageHistorySection history={chartHistory} />
      <Separator />
      <PackageHistorySection history={editorHistory} />
      <Separator />
      <PackageHistorySection history={effectHistory} />
      <Separator />
      <PackageHistorySection history={tokensHistory} />
    </div>
  );
}
