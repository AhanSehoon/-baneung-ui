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
  current: '1.0.10',
  npmUrl: 'https://www.npmjs.com/package/@baneung-pack/ui',
  entries: [
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
  current: '1.0.3',
  npmUrl: 'https://www.npmjs.com/package/@baneung-pack/tokens',
  entries: [
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
  current: '0.8.4',
  npmUrl: 'https://www.npmjs.com/package/@baneung-pack/grid',
  entries: [
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
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <Heading level={2} className="text-2xl">
          {history.pkg}
        </Heading>
        <div className="flex items-center gap-2">
          <Muted className="text-xs">
            현재: <strong className="text-foreground">v{history.current}</strong>
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
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>Versions</Heading>
        <Lead>
          바능 디자인 시스템 패키지의 릴리스 히스토리. 첫 출시부터 현재까지 각 버전에서 어떤 것들이
          추가/변경됐는지 정리.
        </Lead>
        <Muted className="text-xs">
          버전 표기: 빨강 = MAJOR (호환성 깨짐) · 회색 = MINOR (기능 추가) · 외곽선 = PATCH (버그
          수정/문서).
        </Muted>
      </header>

      <Separator />

      <PackageHistorySection history={uiHistory} />
      <Separator />
      <PackageHistorySection history={gridHistory} />
      <Separator />
      <PackageHistorySection history={tokensHistory} />
    </div>
  );
}
