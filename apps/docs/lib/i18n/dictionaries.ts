/**
 * 다국어 사전 — 한국어(ko) / 영어(en) 키-값 매핑.
 *
 * 키 네이밍: `<영역>.<항목>` (예: `nav.gettingStarted`, `header.search`).
 * 누락된 키는 자동으로 ko 값으로 fallback.
 */

export type Locale = 'ko' | 'en';

type Dict = Record<string, string>;

const ko: Dict = {
  // 사이드바 섹션
  'nav.gettingStarted': '시작하기',
  'nav.packages': '패키지',
  'nav.guide': '가이드',
  // 시작하기
  'nav.intro': '소개',
  'nav.install': 'Install',
  'nav.tokens': '디자인 토큰',
  // UI 자식
  'nav.catalog': '카탈로그 (전체 보기)',
  // Grid 자식
  'nav.grid.props': 'Props',
  'nav.grid.basic': '기본 사용',
  'nav.grid.customRenderer': '커스텀 렌더러',
  'nav.grid.virtualized': '가상화 모드',
  'nav.grid.pagination': '내장 페이지네이션',
  'nav.grid.externalPagination': '외부 페이지네이션',
  'nav.grid.editing': '인라인 편집 · 선택 · ref API',
  'nav.grid.tree': 'Tree (계층) 모드',
  'nav.grid.editorsSortFilter': '빌트인 에디터 · 정렬 · 필터',
  'nav.grid.rowOperations': '행 추가 · 삭제 · 다중 셀 선택',
  'nav.grid.csvExport': 'CSV 다운로드',
  'nav.grid.quickFilter': '빠른 검색',
  'nav.grid.multiSortResize': '다중 정렬 · 컬럼 폭 조절',
  'nav.grid.columnVisibility': '컬럼 표시 설정',
  'nav.grid.columnPin': '컬럼 고정 (좌/우)',
  'nav.grid.columnReorder': '컬럼 순서 변경',
  'nav.grid.footerAggregate': '합계 행',
  'nav.grid.conditionalStyle': '조건부 셀 강조',
  'nav.grid.keyboardNav': '키보드로 셀 이동',
  'nav.grid.contextMenu': '우클릭 메뉴',
  'nav.grid.excel': 'Excel 내보내기 · 클립보드',
  'nav.grid.saveView': '설정 자동 저장',
  'nav.grid.allFeatures': '관리자 화면 통합 예제',
  // Chart 자식 (2-level: 차트 종류 > 변형)
  'nav.chart.props': 'Props',
  'nav.chart.bar': '막대 차트',
  'nav.chart.bar.basic': '기본',
  'nav.chart.bar.stacked': '누적',
  'nav.chart.bar.horizontal': '가로 막대',
  'nav.chart.bar.positiveNegative': '양수/음수',
  'nav.chart.bar.koreanFormat': '한글 숫자 포맷',
  'nav.chart.bar.mixed': '혼합 (Pareto)',
  'nav.chart.bar.mixedSimple': '혼합 (단순)',
  'nav.chart.line': '선 차트',
  'nav.chart.line.basic': '기본',
  'nav.chart.line.smooth': '곡선 보간',
  'nav.chart.area': '영역 차트',
  'nav.chart.area.basic': '기본',
  'nav.chart.area.stacked': '누적',
  'nav.chart.scatter': '산점도 차트',
  'nav.chart.scatter.basic': '기본',
  'nav.chart.scatter.shapes': '모양 변형',
  'nav.chart.radar': '레이더 차트',
  'nav.chart.radar.basic': '기본',
  'nav.chart.radar.filled': '채움만',
  'nav.chart.radar.outline': '외곽선만',
  'nav.chart.waterfall': '폭포 차트',
  'nav.chart.flow': '플로우 차트',
  'nav.chart.flow.basic': '기본',
  'nav.chart.flow.custom': '커스텀 엣지',
  'nav.chart.flow.workflow': '워크플로',
  'nav.chart.pie': '파이 차트',
  'nav.chart.doughnut': '도넛 차트',
  // Editor 자식
  'nav.editor.props': 'Props',
  'nav.editor.basic': '기본 사용',
  'nav.editor.controlled': '제어 · HTML 출력',
  'nav.editor.image': '이미지 붙여넣기 · 드롭',
  'nav.editor.customToolbar': '커스텀 툴바',
  'nav.editor.readonly': '읽기 전용',
  'nav.editor.full': '전체 기능 · ref API',
  // Effect 패키지
  'nav.effect.typewriter': 'Typewriter',
  'nav.effect.rotatingWords': 'RotatingWords',
  'nav.effect.scrambleText': 'ScrambleText',
  'nav.effect.splitTextReveal': 'SplitTextReveal',
  'nav.effect.countUp': 'CountUp',
  'nav.effect.gradientText': 'GradientText',
  'nav.effect.blurInText': 'BlurInText',
  'nav.effect.wavyText': 'WavyText',
  'nav.effect.glitchText': 'GlitchText',
  'nav.effect.variableFontHover': 'VariableFontHover',
  'nav.effect.circularText': 'CircularText',
  'nav.effect.gravityText': 'GravityText',
  'nav.effect.spotlightText': 'SpotlightText',
  'nav.effect.ripple': 'Ripple',
  'nav.effect.confetti': 'Confetti',
  // 가이드
  'nav.accessibility': '접근성',
  'nav.versions': 'Versions',
  // 헤더
  'header.search': '검색',
  'header.themeToggle': '테마 토글',
  'header.languageToggle': '언어 토글',
  'header.openMenu': '메뉴 열기',
  'header.contact': '프로젝트 문의',
  // 프로젝트 문의 다이얼로그
  'contact.title': '함께 만들 프로젝트가 있으신가요?',
  'contact.copy':
    'AI Agent · React · Java · C++ · Flutter · Python등 다양한 언어의 개발을 진행합니다. 지금 바로 문의해 주세요.',
  'contact.company': '주식회사 바능',
  'contact.homepageBadge': '홈페이지 바로가기',
  'contact.fieldTitle': '제목',
  'contact.fieldTitlePlaceholder': '예) 디자인 시스템 도입 컨설팅 요청',
  'contact.fieldContent': '내용',
  'contact.fieldContentPlaceholder':
    '프로젝트 개요, 기간, 예산, 연락 가능 시간 등을 자유롭게 작성해주세요.',
  'contact.fieldEmail': '답장 받을 이메일',
  'contact.fieldEmailHint': '답장이 필요하면 이메일을 남겨주세요. 미입력 시 회신이 어렵습니다.',
  'contact.optional': '선택',
  'contact.send': '보내기',
  'contact.sending': '보내는 중…',
  'contact.cancel': '취소',
  'contact.close': '닫기',
  'contact.successTitle': '문의가 정상적으로 접수되었습니다.',
  'contact.successBody': '빠른 시일 내에 답변 드리겠습니다. 감사합니다.',
  'contact.errorGeneric': '발송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
  'contact.errorNetwork': '네트워크 오류 — 잠시 후 다시 시도해 주세요.',
  // 공통
  'common.koLabel': '한국어',
  'common.enLabel': 'English',
  // 페이지: 인트로 (/)
  'intro.title': '바능 디자인 시스템',
  'intro.lead':
    '바능(Baneung) 브랜드 가이드라인을 따르는 React 디자인 시스템. 각진 디자인, 절제된 컬러, 강한 타이포 위계.',
  // 페이지: Install
  'install.title': 'Install',
  'install.lead': '바능 디자인 시스템 패키지 설치 가이드. 필요한 패키지만 골라서 설치하세요.',
  'install.packagesOverview': '패키지 개요',
  'install.commonPeerDeps': '공통 peer deps: React ^18 || ^19, React DOM ^18 || ^19.',
  'install.usage': '사용',
  'install.styleImport': '스타일 임포트',
  'install.cssIsolation': 'CSS 격리 (소비자 Tailwind 사용 시)',
  'install.basicUsage': '기본 사용',
  'install.nextSteps': '다음 단계',
  // 페이지: Versions
  'versions.title': 'Versions',
  'versions.lead': '각 패키지의 버전 변경 이력. 최신이 위에 표시됩니다.',
  'versions.current': '현재',
  'versions.viewOnNpm': 'npm에서 보기 →',
  // 페이지: Accessibility
  'a11y.title': '접근성',
  'a11y.lead': 'WCAG 2.1 AA 준수. 협상 불가 — 모든 컴포넌트는 키보드, 스크린리더, 색대비를 검증.',
  // 페이지: 디자인 토큰
  'tokens.title': '디자인 토큰',
  'tokens.lead':
    '컬러 · 타이포그래피 · 스페이싱 · 라디우스 · 모션의 단일 진실 공급원 (CSS / JSON / TS 동시 export).',
  // 컴포넌트 카탈로그
  'components.title': '컴포넌트',
  'components.leadSuffix':
    '개의 컴포넌트. 각 카드의 미리보기를 클릭하면 라이브 예제와 props API 표가 있는 상세 페이지로 이동합니다.',
  // Install 본문
  'install.tokensNote':
    'ui / grid / editor 패키지에 이미 포함돼 있어 별도 설치는 필요 없습니다. 토큰만 직접 쓰고 싶을 때만 단독 설치.',
  'install.uiLayerNote':
    'ui의 styles는 @layer baneung에 격리됩니다. Grid·Editor를 함께 쓰면 layer가 자동 머지됩니다.',
  'install.uiTailwindNote':
    '소비자가 Tailwind를 자체 임포트할 때 preflight↔라이브러리 utility 충돌을 회피하는 권장 패턴.',
  'install.gridDepsNote':
    '내부 의존: @tanstack/react-virtual (가상화), class-variance-authority, clsx, tailwind-merge. Excel 내보내기 사용 시 추가로 exceljs (peer-optional) 설치 권장.',
  'install.editorDepsNote':
    '외부 에디터 라이브러리 없이 동작 — 런타임 의존성은 clsx · tailwind-merge 둘뿐.',
  'install.editorClientNote':
    "Next.js App Router에서는 상태를 다루는 페이지/컴포넌트에 'use client'가 필요합니다 (패키지 자체에는 use client가 주입되어 있습니다).",
  'install.peerDeps': 'Peer dependencies',
  'install.commonOverview': '공통 peer deps',
  // Versions
  'versions.viewNpm': 'npm',
  // Accessibility 체크리스트
  'a11y.checklistTitle': '체크리스트',
  'a11y.checklistIntro': '모든 컴포넌트가 다음 항목을 충족하도록 검증됩니다.',
  'a11y.shortcutsTitle': '주요 키보드 단축키',
  'a11y.shortcutsIntro': '데모 사이트와 컴포넌트 공통 단축키.',
  // Grid 데모 lead
  'gridDemo.quickFilter':
    '모든 visible 컬럼에 대해 부분 일치(case-insensitive) 검색. 외부 input과 연결해 그리드에 quickFilter prop으로 전달합니다.',
  'gridDemo.multiSortResize':
    '헤더 클릭으로 단일 정렬, Shift+클릭으로 2차/3차 정렬 추가. 헤더 우측 경계 드래그로 컬럼 폭을 조절합니다. onColumnResize 콜백으로 localStorage 등에 영속화 가능.',
  'gridDemo.columnVisibility':
    'showColumnMenu=true 시 우상단 ⚙️ 버튼이 나오고 체크박스 popover로 컬럼 표시/숨김. column.hidden 또는 columnVisibility prop으로도 제어 가능합니다.',
  'gridDemo.columnPin':
    "column.pin: 'left' | 'right' 로 컬럼을 좌/우에 고정. 가로 스크롤해도 자리를 유지합니다. 보통 좌측은 ID/이름, 우측은 상태/액션 컬럼에 사용.",
  'gridDemo.columnReorder':
    'reorderable=true면 헤더를 드래그&드롭으로 순서 변경. 같은 pin 그룹 안에서만 이동되어 pin 경계는 유지됩니다.',
  'gridDemo.footerAggregate':
    'column.aggregate로 컬럼별 합계/평균/개수/최소/최대 또는 임의 함수를 푸터에 자동 표시. showFooter=true와 함께 사용하며, 필터·검색이 적용된 visible 행 기준으로 계산됩니다.',
  'gridDemo.conditionalStyle':
    'column.cellStyle (인라인 스타일) 또는 column.cellClassName (Tailwind 클래스)로 값/행에 따라 셀을 강조합니다. Excel의 조건부 서식과 같은 패턴.',
  'gridDemo.keyboardNav':
    "cellSelection이 'none'이 아닐 때 자동 활성. 화살표 / Tab / Enter / Home·End / Ctrl+Home·End로 셀 이동. active 셀이 화면 안으로 자동 스크롤됩니다.",
  'gridDemo.contextMenu':
    'contextMenu=true면 기본 메뉴 (복사·붙여넣기·셀 클리어·행 삭제·CSV/Excel). 함수로 넘기면 셀별로 동적 메뉴 항목을 생성할 수 있습니다.',
  'gridDemo.excel':
    'exportXlsx ref API로 .xlsx 다운로드 (exceljs 동적 로드, 번들 미포함). clipboard 옵션을 켜면 Ctrl+C/V로 Excel과 셀 범위를 호환되게 주고받을 수 있습니다 (TSV 직렬화).',
  'gridDemo.saveView':
    'viewKey만 지정하면 정렬·컬럼 폭·표시 여부·순서가 브라우저 localStorage에 자동 저장됩니다. 페이지를 떠났다 다시 와도 마지막 설정이 그대로 복원됩니다.',
  'gridDemo.allFeatures':
    '빠른 검색 · 다중 정렬 · 컬럼 폭 조절 · 표시 설정 · 순서 변경 · 컬럼 고정 · 합계 행 · 편집 · 다중 셀 선택 · 클립보드 · 우클릭 메뉴 · 설정 자동 저장. 실제 관리자 그리드 시나리오.',
  'gridDemo.basic': '컬럼 정의와 데이터만 전달해서 그리드를 그립니다. 좌/중/우 align 지원.',
  'gridDemo.customRenderer':
    'column.renderer로 셀 표시 방식 커스터마이즈 — Badge, 포맷된 숫자, 조건부 색 등.',
  'gridDemo.virtualized':
    '5,000행 데이터셋도 가상화 모드로 부드럽게 렌더. virtualized prop 한 줄로 전환.',
  'gridDemo.pagination': '페이지당 N행 — pageSize prop만 지정하면 페이지네이션 UI가 자동 노출.',
  'gridDemo.externalPagination':
    '외부 상태로 page/onPageChange controlled. showPagination={false}로 내장 UI 숨김.',
  'gridDemo.editing':
    '셀 더블클릭 → 인라인 편집. selectable, getSavedData/getChangedData/getDeletedData ref API.',
  'gridDemo.tree': 'tree mode — getChildren으로 자식 추출, defaultExpandedIds로 초기 펼침 상태.',
  'gridDemo.editorsSortFilter':
    '빌트인 에디터 (text/number/date/dropdown) + sortable + filterable (체크박스 popover).',
  'gridDemo.rowOperations':
    '행 추가 (above/below active) · 선택 행 삭제 · 다중 셀 드래그 선택 + Delete로 클리어.',
  'gridDemo.csvExport':
    'ref.exportCsv(filename) — 편집 반영 후 다운로드. 변경분만/전체 둘 다 export 가능.',
  // Chart 데모 lead
  'chartDemo.bar':
    '카테고리별 비교에 적합한 막대 차트. xKey + yKeys로 시리즈를 지정합니다. stacked / horizontal 옵션 지원.',
  'chartDemo.barStacked': '누적 막대 (stacked=true)',
  'chartDemo.barHorizontal': '가로 막대 (horizontal=true)',
  'chartDemo.barPositiveNegative':
    '양수/음수 혼합 — 데이터에 음수만 있으면 자동으로 0 기준선 아래로 그려짐',
  'chartDemo.barKoreanFormat':
    '한글 숫자 포맷 (valueFormat="korean") — 큰 수치를 자동으로 만/억/조 단위로 표시. tooltip · 막대 위 라벨 · y축 tick 모두 일관 적용. 접근성 sr-only 테이블도 자동 포함.',
  'chartDemo.line':
    '시계열 등 연속 데이터에 적합한 선 차트. smooth로 곡선 보간, showDots로 데이터 포인트 표시.',
  'chartDemo.lineSmooth': '곡선 보간 (smooth=true)',
  'chartDemo.area':
    '누적 추세·시장 점유율 변화 등에 적합한 영역 차트. stacked + fillOpacity 조절 가능.',
  'chartDemo.areaStacked': '누적 영역 (stacked=true)',
  'chartDemo.mixed':
    '막대 + 선 혼합 차트. 우측 보조 y축 옵션으로 Pareto, 매출+누적% 등 듀얼 스케일 표현 가능.',
  'chartDemo.mixedSimple': '듀얼 축 없는 단순 mix (좌측 축 공유)',
  'chartDemo.waterfall':
    '누적 변화 시각화 — 각 막대는 이전 누적값에서 시작해 양수(녹색)/음수(빨강)만큼 위·아래로 이동. 시작/끝 total(파랑)은 0부터 풀바.',
  'chartDemo.scatter':
    '산점도 — 두 변수의 상관관계 시각화. `groupKey`로 데이터를 자동 그룹핑해 시리즈별 다른 색 점으로 렌더.',
  'chartDemo.scatterShapes':
    '시리즈별 다른 모양 — `pointStyle` 배열로 색약 사용자도 형태로 구분 가능 (개발팀=▲, 디자인팀=◆)',
  'chartDemo.radar':
    '레이더 차트 — 여러 축의 값을 방사형으로 비교. 각 데이터 행이 하나의 radar 모양이 되며 시리즈별로 채움 영역이 겹쳐서 그려짐. 개발자 역량 평가 시나리오.',
  'chartDemo.radarFilled': '외곽선 없이 채움만 (showLine={false} + fillOpacity={0.45})',
  'chartDemo.radarOutline': '외곽선만 (fillOpacity={0}) — 시리즈 간 비교가 더 명확',
  'chartDemo.flow':
    '플로우 차트 — SVG 기반 노드-엣지 그래프. 내장 4종 edge(straight/bezier/step/smoothstep) + 사용자가 path 함수를 등록해 임의 모양 edge 추가. 마우스 드래그로 캔버스 pan 가능.',
  'chartDemo.flowCustom':
    '커스텀 edge — `edgeTypes` prop에 path 함수 등록 ({sourceX, sourceY, targetX, targetY, ...} → SVG path d). 여기선 wavy(사인파)와 arc(반원) 두 가지 사용자 정의.',
  'chartDemo.flowWorkflow':
    '분기/병합 워크플로 — 결제 승인 시나리오. 노드별 색상, animated edge로 진행 강조, dashed edge로 거절 경로 차별화.',
  'chartDemo.pie': '부분/전체 비율을 표시하는 파이 차트. innerRadius로 도넛 변환 가능.',
  'chartDemo.doughnut': '도넛 차트 — PieChart wrapper. thickness로 가운데 빈 비율 조절.',
  // Editor 데모 lead
  'editorDemo.basic':
    '컨트롤되지 않은 기본 사용 — defaultValue로 초기 HTML 설정. 사용자가 자유롭게 편집.',
  'editorDemo.controlled':
    'value / onChange로 외부 state와 동기화. HTML 출력을 그대로 다른 곳에 표시 가능.',
  'editorDemo.image':
    '클립보드 붙여넣기 · 드래그&드롭 · 파일 선택. 기본은 base64 인라인, onImageUpload로 서버 업로드 연동.',
  'editorDemo.customToolbar':
    'toolbar prop으로 표시할 도구만 선택. 기본 전체 도구 중 일부만 노출하거나 순서 재배치.',
  'editorDemo.readonly': 'readOnly={true} — 편집 불가, 표시 전용 모드.',
  'editorDemo.full': '모든 기능 활성 + ref API 시연 (getHTML / setHTML / insertHTML / focus).',
  'editorDemo.props': 'Editor 컴포넌트의 모든 props와 ref API.',
  // 컴포넌트 detail 페이지
  'componentShell.backToList': '← 컴포넌트 목록',
  'componentShell.exampleHeading': '예제',
  'componentShell.installHeading': '설치 / Import',
  'componentShell.apiHeading': 'API',
  'componentShell.subpathNote':
    '서브패스 import는 트리쉐이킹 친화 — 사용하지 않는 다른 컴포넌트는 번들에 포함되지 않습니다.',
  // API 표
  'api.property': 'Property',
  'api.description': '설명',
  'api.type': 'Type',
  'api.default': '기본값',
  'api.version': 'Version',
  'api.empty': '노출 props 없음 (children만 받습니다).',
  // 코드 보기 토글
  'exampleSection.showCode': '코드 보기',
  'exampleSection.hideCode': '코드 숨기기',
  // ── Install 본문 상세 ──
  'install.pkg.tokens': 'CSS / JSON / TS 디자인 토큰 (SSOT). 모든 패키지의 기반.',
  'install.pkg.ui': '58개 React 컴포넌트 (Radix 기반).',
  'install.pkg.grid': '데이터 그리드 (가상화, 정렬·필터, Excel 호환).',
  'install.pkg.editor': '리치 텍스트 WYSIWYG 에디터 (의존성 0).',
  'install.pkg.effect':
    'Typewriter · RotatingWords · ScrambleText · SplitTextReveal · CountUp 등 비주얼 이펙트 모음. 의존성 0, Tailwind 비종속.',
  'install.effectNote':
    '의존성 React peer만. inline style 기반이라 어떤 React 앱에서도 즉시 사용 가능. prefers-reduced-motion 자동 존중.',
  'install.pkg.chart':
    '차트 라이브러리 — Canvas(chart.js) 기반 (Bar / Line / Area / Pie / Doughnut).',
  'install.chartDepsNote':
    'chart.js ^4.4.0과 react-chartjs-2 ^5.2.0을 peer dependency로 함께 설치해야 합니다. Canvas 기반이라 대량 데이터 포인트에서 가볍게 동작합니다.',
  'install.next.catalog': '컴포넌트 카탈로그',
  'install.next.catalogDesc': 'UI 58개 컴포넌트',
  'install.next.grid': 'Grid 가이드',
  'install.next.gridDesc': '데이터 그리드 데모/Props',
  'install.next.editor': 'Editor 가이드',
  'install.next.editorDesc': '리치 텍스트 에디터 데모/Props',
  'install.next.tokens': '디자인 토큰',
  'install.next.tokensDesc': '컬러/스페이싱/타이포',
  // ── Tokens 본문 ──
  'tokens.semanticColorsHeading': '시맨틱 컬러',
  'tokens.semanticColorsDesc':
    '컴포넌트가 직접 참조하는 의미 단위. 라이트/다크 테마에서 같은 토큰이 다른 RGB로 매핑됩니다.',
  'tokens.typoHeading': '타이포그래피',
  'tokens.typoDesc': 'Pretendard Variable — 한·영 단일 폰트. 4px 베이스 스케일.',
  'tokens.radiusHeading': '라디우스',
  'tokens.radiusDesc':
    '바능의 각진 디자인 원칙 — 토큰은 0/2/4 세 개만 정의됩니다. 큰 라운드는 의도적으로 미정의.',
  'tokens.spacingHeading': '스페이싱',
  'tokens.spacingDesc': '4px 베이스 — 1=4px, 2=8px, 4=16px, 8=32px ...',
  'tokens.motionHeading': '모션',
  'tokens.motionDesc':
    'duration-fast 100ms · duration-base 150ms · duration-slow 250ms. prefers-reduced-motion 존중.',
  'tokens.color.canvas': '바탕',
  'tokens.color.surface': '표면',
  'tokens.color.surface-strong': '표면 강',
  'tokens.color.inverse': '반전',
  'tokens.color.foreground': '본문',
  'tokens.color.foreground-muted': '보조',
  'tokens.color.border-default': '보더',
  'tokens.color.ring': '포커스 링',
  'tokens.color.success': '성공',
  'tokens.color.warning': '경고',
  'tokens.color.danger': '오류',
  'tokens.color.info': '정보',
  // ── Accessibility 체크리스트 + 단축키 ──
  'a11y.checklist.0': '키보드만으로 모든 동작 가능 (Tab, Shift+Tab, Enter, Space, Esc, 화살표)',
  'a11y.checklist.1': ':focus-visible 스타일 명확 (2px 토큰 ring)',
  'a11y.checklist.2': '적절한 ARIA role/state/property',
  'a11y.checklist.3': '스크린리더 라벨 (aria-label / aria-labelledby)',
  'a11y.checklist.4': '색대비 WCAG AA — 본문 4.5:1, UI 3:1 (axe-core 검증)',
  'a11y.checklist.5': 'prefers-reduced-motion 존중 (모든 애니메이션 즉시화)',
  'a11y.checklist.6': 'IME(한글 입력) 도중 의도치 않은 submit 방지',
  'a11y.checklist.7': '모바일 터치 타겟 최소 44×44px',
  'a11y.shortcut.cmdK': '명령 팔레트 열기',
  'a11y.shortcut.esc': '오버레이 닫기',
  'a11y.shortcut.tab': '다음 포커스',
  'a11y.shortcut.shiftTab': '이전 포커스',
  'a11y.shortcut.space': '버튼/체크박스 활성',
  'a11y.shortcut.enter': '버튼 활성 / 옵션 선택',
  'a11y.shortcut.upDown': '메뉴/리스트 항목 이동',
  'a11y.shortcut.leftRight': '탭/슬라이더 이동',
  'a11y.shortcut.homeEnd': '처음/끝으로 이동',
  'a11y.shortcutKeyLabel': '키',
  'a11y.shortcutActionLabel': '동작',
  // Effect 패키지 — 모션 접근성
  'a11y.motionTitle': '모션 · 애니메이션 (@baneung-pack/effect)',
  'a11y.motionIntro':
    '13개 비주얼 이펙트 컴포넌트 모두 모션 줄임 사용자와 보조 기술 사용자에 대한 동일 원칙을 따릅니다.',
  'a11y.motion.reduced':
    '`prefers-reduced-motion: reduce` 자동 존중 — 모션 줄임 OS 설정 시 모든 애니메이션이 즉시 정적 상태로 표시됩니다 (등장 효과는 final state로 즉시 보임).',
  'a11y.motion.ariaLabel':
    '`aria-label`로 원문 텍스트를 스크린리더에 한 번에 전달 — 글자 단위로 쪼개진 span을 읽지 않습니다.',
  'a11y.motion.ariaHidden':
    '애니메이션을 위해 쪼개진 글자/채널 span은 `aria-hidden="true"` — 보조 기술에 노출되지 않습니다.',
  'a11y.motion.touch':
    'hover 기반 인터랙션(VariableFontHover/SpotlightText/GravityText hover trigger)은 터치 디바이스에서는 자연스럽게 비활성 — 콘텐츠 접근 불가능하게 만들지 않습니다.',
};

const en: Dict = {
  // Sidebar sections
  'nav.gettingStarted': 'Getting started',
  'nav.packages': 'Packages',
  'nav.guide': 'Guide',
  // Getting started
  'nav.intro': 'Introduction',
  'nav.install': 'Install',
  'nav.tokens': 'Design tokens',
  // UI children
  'nav.catalog': 'Catalog (all)',
  // Grid children
  'nav.grid.props': 'Props',
  'nav.grid.basic': 'Basic usage',
  'nav.grid.customRenderer': 'Custom renderer',
  'nav.grid.virtualized': 'Virtualized mode',
  'nav.grid.pagination': 'Built-in pagination',
  'nav.grid.externalPagination': 'External pagination',
  'nav.grid.editing': 'Inline edit · select · ref API',
  'nav.grid.tree': 'Tree mode',
  'nav.grid.editorsSortFilter': 'Built-in editors · sort · filter',
  'nav.grid.rowOperations': 'Row add · delete · multi-cell select',
  'nav.grid.csvExport': 'CSV download',
  'nav.grid.quickFilter': 'Quick search',
  'nav.grid.multiSortResize': 'Multi-sort · column resize',
  'nav.grid.columnVisibility': 'Column visibility',
  'nav.grid.columnPin': 'Column pinning (L/R)',
  'nav.grid.columnReorder': 'Column reorder',
  'nav.grid.footerAggregate': 'Aggregate footer',
  'nav.grid.conditionalStyle': 'Conditional cell style',
  'nav.grid.keyboardNav': 'Keyboard navigation',
  'nav.grid.contextMenu': 'Context menu',
  'nav.grid.excel': 'Excel export · clipboard',
  'nav.grid.saveView': 'Auto-save view',
  'nav.grid.allFeatures': 'Admin screen — all features',
  // Chart children
  'nav.chart.props': 'Props',
  'nav.chart.bar': 'Bar chart',
  'nav.chart.bar.basic': 'Basic',
  'nav.chart.bar.stacked': 'Stacked',
  'nav.chart.bar.horizontal': 'Horizontal',
  'nav.chart.bar.positiveNegative': 'Positive / negative',
  'nav.chart.bar.koreanFormat': 'Korean number format',
  'nav.chart.bar.mixed': 'Mixed (Pareto)',
  'nav.chart.bar.mixedSimple': 'Mixed (simple)',
  'nav.chart.line': 'Line chart',
  'nav.chart.line.basic': 'Basic',
  'nav.chart.line.smooth': 'Smooth interpolation',
  'nav.chart.area': 'Area chart',
  'nav.chart.area.basic': 'Basic',
  'nav.chart.area.stacked': 'Stacked',
  'nav.chart.scatter': 'Scatter chart',
  'nav.chart.scatter.basic': 'Basic',
  'nav.chart.scatter.shapes': 'Shape variants',
  'nav.chart.radar': 'Radar chart',
  'nav.chart.radar.basic': 'Basic',
  'nav.chart.radar.filled': 'Fill only',
  'nav.chart.radar.outline': 'Outline only',
  'nav.chart.waterfall': 'Waterfall chart',
  'nav.chart.flow': 'Flow chart',
  'nav.chart.flow.basic': 'Basic',
  'nav.chart.flow.custom': 'Custom edges',
  'nav.chart.flow.workflow': 'Workflow',
  'nav.chart.pie': 'Pie chart',
  'nav.chart.doughnut': 'Doughnut chart',
  // Editor children
  'nav.editor.props': 'Props',
  'nav.editor.basic': 'Basic usage',
  'nav.editor.controlled': 'Controlled · HTML output',
  'nav.editor.image': 'Image paste · drop',
  'nav.editor.customToolbar': 'Custom toolbar',
  'nav.editor.readonly': 'Read-only',
  'nav.editor.full': 'Full features · ref API',
  // Effect package
  'nav.effect.typewriter': 'Typewriter',
  'nav.effect.rotatingWords': 'RotatingWords',
  'nav.effect.scrambleText': 'ScrambleText',
  'nav.effect.splitTextReveal': 'SplitTextReveal',
  'nav.effect.countUp': 'CountUp',
  'nav.effect.gradientText': 'GradientText',
  'nav.effect.blurInText': 'BlurInText',
  'nav.effect.wavyText': 'WavyText',
  'nav.effect.glitchText': 'GlitchText',
  'nav.effect.variableFontHover': 'VariableFontHover',
  'nav.effect.circularText': 'CircularText',
  'nav.effect.gravityText': 'GravityText',
  'nav.effect.spotlightText': 'SpotlightText',
  'nav.effect.ripple': 'Ripple',
  'nav.effect.confetti': 'Confetti',
  // Guide
  'nav.accessibility': 'Accessibility',
  'nav.versions': 'Versions',
  // Header
  'header.search': 'Search',
  'header.themeToggle': 'Toggle theme',
  'header.languageToggle': 'Toggle language',
  'header.openMenu': 'Open menu',
  'header.contact': 'Project Inquiry',
  // Project inquiry dialog
  'contact.title': 'Got a project to build together?',
  'contact.copy':
    'We work across AI Agents · React · Java · C++ · Flutter · Python and more. Reach out and let’s talk.',
  'contact.company': 'Baneung Inc.',
  'contact.homepageBadge': 'Visit homepage',
  'contact.fieldTitle': 'Subject',
  'contact.fieldTitlePlaceholder': 'e.g. Design system adoption consulting',
  'contact.fieldContent': 'Message',
  'contact.fieldContentPlaceholder':
    'Tell us about the project: scope, timeline, budget, best time to reach you, etc.',
  'contact.fieldEmail': 'Reply-to email',
  'contact.fieldEmailHint':
    'Add your email so we can reply. Without it, we cannot respond directly.',
  'contact.optional': 'optional',
  'contact.send': 'Send',
  'contact.sending': 'Sending…',
  'contact.cancel': 'Cancel',
  'contact.close': 'Close',
  'contact.successTitle': 'Your inquiry has been received.',
  'contact.successBody': 'We will get back to you shortly. Thank you.',
  'contact.errorGeneric': 'Failed to send. Please try again later.',
  'contact.errorNetwork': 'Network error — please try again later.',
  // Common
  'common.koLabel': '한국어',
  'common.enLabel': 'English',
  // Page: intro (/)
  'intro.title': 'Baneung Design System',
  'intro.lead':
    'A React design system following Baneung brand guidelines. Sharp design, restrained palette, strong typographic hierarchy.',
  // Page: Install
  'install.title': 'Install',
  'install.lead':
    'Installation guide for Baneung Design System packages. Pick the packages you need.',
  'install.packagesOverview': 'Package overview',
  'install.commonPeerDeps': 'Common peer deps: React ^18 || ^19, React DOM ^18 || ^19.',
  'install.usage': 'Usage',
  'install.styleImport': 'Style import',
  'install.cssIsolation': 'CSS isolation (when consumer uses Tailwind)',
  'install.basicUsage': 'Basic usage',
  'install.nextSteps': 'Next steps',
  // Page: Versions
  'versions.title': 'Versions',
  'versions.lead': 'Version history for each package. Latest at the top.',
  'versions.current': 'Current',
  'versions.viewOnNpm': 'View on npm →',
  // Page: Accessibility
  'a11y.title': 'Accessibility',
  'a11y.lead':
    'WCAG 2.1 AA compliant. Non-negotiable — every component is verified for keyboard, screen reader, and color contrast.',
  // Page: Design tokens
  'tokens.title': 'Design tokens',
  'tokens.lead':
    'Single source of truth for colors · typography · spacing · radius · motion (exported as CSS / JSON / TS).',
  // Components catalog
  'components.title': 'Components',
  'components.leadSuffix':
    ' components. Click any card preview to navigate to the detail page with live examples and a props API table.',
  // Install body
  'install.tokensNote':
    'Already bundled inside ui / grid / editor. Install standalone only if you want to use tokens directly.',
  'install.uiLayerNote':
    'ui styles are isolated in @layer baneung. The layer auto-merges when used together with Grid / Editor.',
  'install.uiTailwindNote':
    'Recommended pattern to avoid preflight↔library utility conflicts when the consumer imports Tailwind themselves.',
  'install.gridDepsNote':
    'Internal deps: @tanstack/react-virtual (virtualization), class-variance-authority, clsx, tailwind-merge. Install exceljs (peer-optional) for Excel export.',
  'install.editorDepsNote':
    'Works without any external editor library — runtime deps are only clsx and tailwind-merge.',
  'install.editorClientNote':
    "On Next.js App Router, pages / components handling state need 'use client' (the package itself injects use client).",
  'install.peerDeps': 'Peer dependencies',
  'install.commonOverview': 'Common peer deps',
  // Versions
  'versions.viewNpm': 'npm',
  // Accessibility checklist
  'a11y.checklistTitle': 'Checklist',
  'a11y.checklistIntro': 'Every component is verified against the following.',
  'a11y.shortcutsTitle': 'Common keyboard shortcuts',
  'a11y.shortcutsIntro': 'Shortcuts shared across the demo site and components.',
  // Grid demo leads
  'gridDemo.quickFilter':
    'Partial match (case-insensitive) search across all visible columns. Connect an external input via the quickFilter prop.',
  'gridDemo.multiSortResize':
    'Single sort on header click; Shift+click to add 2nd/3rd sort. Drag the header right edge to resize. Persist via onColumnResize (e.g. localStorage).',
  'gridDemo.columnVisibility':
    'showColumnMenu=true shows a ⚙️ button at the top-right that opens a checkbox popover. Also controllable via column.hidden or the columnVisibility prop.',
  'gridDemo.columnPin':
    "column.pin: 'left' | 'right' pins columns to either side; they stay put on horizontal scroll. Typical: ID/name on the left, status/actions on the right.",
  'gridDemo.columnReorder':
    'reorderable=true lets users drag column headers to reorder. Movement is bound within the same pin group, preserving pin boundaries.',
  'gridDemo.footerAggregate':
    'column.aggregate auto-displays sum/avg/count/min/max or a custom function in the footer. Combined with showFooter=true; computed over filter+search visible rows.',
  'gridDemo.conditionalStyle':
    'Highlight cells by value/row via column.cellStyle (inline) or column.cellClassName (Tailwind). Same pattern as Excel conditional formatting.',
  'gridDemo.keyboardNav':
    "Auto-enabled when cellSelection is not 'none'. Move cells via arrows / Tab / Enter / Home·End / Ctrl+Home·End. Active cell auto-scrolls into view.",
  'gridDemo.contextMenu':
    'contextMenu=true shows the default menu (copy · paste · clear · delete row · CSV/Excel). Pass a function to generate per-cell dynamic items.',
  'gridDemo.excel':
    'exportXlsx ref API downloads .xlsx (exceljs is loaded dynamically, not in the bundle). Enable clipboard to exchange cell ranges with Excel via Ctrl+C/V (TSV).',
  'gridDemo.saveView':
    'Just set viewKey — sort, column width, visibility, and order are auto-persisted to localStorage. Settings are restored on revisit.',
  'gridDemo.allFeatures':
    'Quick search · multi-sort · column resize · visibility · reorder · pin · aggregate footer · edit · multi-cell select · clipboard · context menu · auto-save view. Real-world admin grid scenario.',
  'gridDemo.basic':
    'Render a grid by passing columns and data only. Supports left/center/right align.',
  'gridDemo.customRenderer':
    'Customize cell rendering via column.renderer — Badge, formatted numbers, conditional colors, and more.',
  'gridDemo.virtualized':
    'Render even 5,000-row datasets smoothly with virtualized mode. Toggle with a single virtualized prop.',
  'gridDemo.pagination':
    'N rows per page — set pageSize and the pagination UI appears automatically.',
  'gridDemo.externalPagination':
    'Controlled page/onPageChange from outside. Hide built-in UI with showPagination={false}.',
  'gridDemo.editing':
    'Double-click a cell to edit inline. selectable, getSavedData/getChangedData/getDeletedData ref API.',
  'gridDemo.tree':
    'Tree mode — extract children via getChildren, set initial expanded state via defaultExpandedIds.',
  'gridDemo.editorsSortFilter':
    'Built-in editors (text/number/date/dropdown) + sortable + filterable (checkbox popover).',
  'gridDemo.rowOperations':
    'Add row (above/below active) · delete selected rows · multi-cell drag select + Delete to clear.',
  'gridDemo.csvExport':
    'ref.exportCsv(filename) — downloads after edits are applied. Export changed-only or full data.',
  // Chart demo leads
  'chartDemo.bar':
    'Bar chart for category comparison. Specify series via xKey + yKeys. Supports stacked / horizontal.',
  'chartDemo.barStacked': 'Stacked bars (stacked=true)',
  'chartDemo.barHorizontal': 'Horizontal bars (horizontal=true)',
  'chartDemo.barPositiveNegative':
    'Positive/negative mix — bars below the zero line render automatically from negative data',
  'chartDemo.barKoreanFormat':
    'Korean number format (valueFormat="korean") — large numbers auto-formatted as 만/억/조 units. Applied uniformly across tooltip, value labels, and y-axis ticks. Accessibility sr-only table included.',
  'chartDemo.line':
    'Line chart for continuous data (time series, etc.). Smooth via monotone interpolation; toggle dots with showDots.',
  'chartDemo.lineSmooth': 'Smooth interpolation (smooth=true)',
  'chartDemo.area':
    'Area chart for cumulative trends, market share over time, etc. Supports stacked + fillOpacity.',
  'chartDemo.areaStacked': 'Stacked areas (stacked=true)',
  'chartDemo.mixed':
    'Bar + Line mixed chart. Optional right y-axis enables dual-scale views like Pareto (sales + cumulative %).',
  'chartDemo.mixedSimple': 'Simple mix without dual axis (shared left axis)',
  'chartDemo.waterfall':
    'Cumulative-change visualization — each bar starts where the previous ended, going up (green) or down (red). Start/end totals (blue) are full bars from zero.',
  'chartDemo.scatter':
    'Scatter chart — visualize correlation between two variables. `groupKey` auto-groups rows into separate colored series.',
  'chartDemo.scatterShapes':
    'Different shapes per series — `pointStyle` array makes series distinguishable by form for colorblind users (Dev=▲, Design=◆)',
  'chartDemo.radar':
    'Radar chart — compare values across multiple axes radially. Each row becomes one radar shape; series overlap with translucent fill. Developer skill assessment scenario.',
  'chartDemo.radarFilled': 'Fill only, no outline (showLine={false} + fillOpacity={0.45})',
  'chartDemo.radarOutline': 'Outline only (fillOpacity={0}) — cleaner cross-series comparison',
  'chartDemo.flow':
    'Flow chart — SVG node-edge graph. 4 built-in edge types (straight/bezier/step/smoothstep) plus user-defined path functions for any shape. Mouse-drag to pan the canvas.',
  'chartDemo.flowCustom':
    'Custom edges — register path functions via `edgeTypes` prop ({sourceX, sourceY, ...} → SVG path d string). Shown here: wavy (sine) and arc (semicircle).',
  'chartDemo.flowWorkflow':
    'Branching workflow — payment approval scenario. Per-node colors, animated edges for in-flight steps, dashed edges for rejection path.',
  'chartDemo.pie': 'Pie chart for part-of-whole proportions. Set innerRadius to make a doughnut.',
  'chartDemo.doughnut':
    'Doughnut chart — a PieChart wrapper. Adjust the inner ratio with thickness.',
  // Editor demo leads
  'editorDemo.basic':
    'Uncontrolled basic usage — set initial HTML via defaultValue. Users edit freely.',
  'editorDemo.controlled':
    'Sync to external state via value / onChange. The HTML output can be displayed elsewhere as-is.',
  'editorDemo.image':
    'Clipboard paste · drag&drop · file picker. Default is base64 inline; wire up server upload via onImageUpload.',
  'editorDemo.customToolbar':
    'Use the toolbar prop to pick which tools to show. Expose a subset of the defaults or reorder them.',
  'editorDemo.readonly': 'readOnly={true} — non-editable, display-only mode.',
  'editorDemo.full':
    'All features enabled + ref API demo (getHTML / setHTML / insertHTML / focus).',
  'editorDemo.props': 'All props and ref API of the Editor component.',
  // Component detail page
  'componentShell.backToList': '← Back to components',
  'componentShell.exampleHeading': 'Example',
  'componentShell.installHeading': 'Install / Import',
  'componentShell.apiHeading': 'API',
  'componentShell.subpathNote':
    'Subpath imports are tree-shaking friendly — unused components are excluded from the bundle.',
  // API table
  'api.property': 'Property',
  'api.description': 'Description',
  'api.type': 'Type',
  'api.default': 'Default',
  'api.version': 'Version',
  'api.empty': 'No exposed props (accepts children only).',
  // Show code toggle
  'exampleSection.showCode': 'Show code',
  'exampleSection.hideCode': 'Hide code',
  // ── Install body ──
  'install.pkg.tokens': 'Design tokens (CSS / JSON / TS — SSOT). Foundation for all packages.',
  'install.pkg.ui': '58 React components (Radix-based).',
  'install.pkg.grid': 'Data grid (virtualization, sort/filter, Excel compatible).',
  'install.pkg.editor': 'Rich text WYSIWYG editor (zero dependencies).',
  'install.pkg.effect':
    'Visual effect components — Typewriter, RotatingWords, ScrambleText, SplitTextReveal, CountUp. Zero deps, Tailwind-independent.',
  'install.effectNote':
    'React peer only. Inline-style based — works in any React app. Honors prefers-reduced-motion automatically.',
  'install.pkg.chart':
    'Chart library — Canvas-based on chart.js (Bar / Line / Area / Pie / Doughnut).',
  'install.chartDepsNote':
    'Install chart.js ^4.4.0 and react-chartjs-2 ^5.2.0 alongside as peer dependencies. Canvas-based — light on large datasets.',
  'install.next.catalog': 'Component catalog',
  'install.next.catalogDesc': '58 UI components',
  'install.next.grid': 'Grid guide',
  'install.next.gridDesc': 'Data grid demos / props',
  'install.next.editor': 'Editor guide',
  'install.next.editorDesc': 'Rich text editor demos / props',
  'install.next.tokens': 'Design tokens',
  'install.next.tokensDesc': 'Colors / spacing / typography',
  // ── Tokens body ──
  'tokens.semanticColorsHeading': 'Semantic colors',
  'tokens.semanticColorsDesc':
    'Meaningful units that components reference directly. The same token maps to different RGB values in light/dark themes.',
  'tokens.typoHeading': 'Typography',
  'tokens.typoDesc': 'Pretendard Variable — a single font for Korean/English. 4px base scale.',
  'tokens.radiusHeading': 'Radius',
  'tokens.radiusDesc':
    "Following Baneung's sharp design principle — only three tokens defined (0/2/4). Large rounding is intentionally omitted.",
  'tokens.spacingHeading': 'Spacing',
  'tokens.spacingDesc': '4px base — 1=4px, 2=8px, 4=16px, 8=32px ...',
  'tokens.motionHeading': 'Motion',
  'tokens.motionDesc':
    'duration-fast 100ms · duration-base 150ms · duration-slow 250ms. Honors prefers-reduced-motion.',
  'tokens.color.canvas': 'Canvas',
  'tokens.color.surface': 'Surface',
  'tokens.color.surface-strong': 'Surface (strong)',
  'tokens.color.inverse': 'Inverse',
  'tokens.color.foreground': 'Foreground',
  'tokens.color.foreground-muted': 'Foreground (muted)',
  'tokens.color.border-default': 'Border',
  'tokens.color.ring': 'Focus ring',
  'tokens.color.success': 'Success',
  'tokens.color.warning': 'Warning',
  'tokens.color.danger': 'Danger',
  'tokens.color.info': 'Info',
  // ── Accessibility checklist + shortcuts ──
  'a11y.checklist.0':
    'Every interaction is keyboard-only (Tab, Shift+Tab, Enter, Space, Esc, arrows).',
  'a11y.checklist.1': 'Clear :focus-visible style (2px token ring).',
  'a11y.checklist.2': 'Proper ARIA role / state / property.',
  'a11y.checklist.3': 'Screen reader label (aria-label / aria-labelledby).',
  'a11y.checklist.4': 'WCAG AA color contrast — text 4.5:1, UI 3:1 (verified by axe-core).',
  'a11y.checklist.5': 'Honors prefers-reduced-motion (all animations become instant).',
  'a11y.checklist.6': 'Prevents unintended submit during IME composition.',
  'a11y.checklist.7': 'Mobile touch targets at least 44×44px.',
  'a11y.shortcut.cmdK': 'Open command palette',
  'a11y.shortcut.esc': 'Close overlay',
  'a11y.shortcut.tab': 'Next focus',
  'a11y.shortcut.shiftTab': 'Previous focus',
  'a11y.shortcut.space': 'Activate button / checkbox',
  'a11y.shortcut.enter': 'Activate button / select option',
  'a11y.shortcut.upDown': 'Move menu / list item',
  'a11y.shortcut.leftRight': 'Move tab / slider',
  'a11y.shortcut.homeEnd': 'Go to first / last',
  'a11y.shortcutKeyLabel': 'Keys',
  'a11y.shortcutActionLabel': 'Action',
  // Effect package — motion accessibility
  'a11y.motionTitle': 'Motion & animation (@baneung-pack/effect)',
  'a11y.motionIntro':
    'All 13 visual effect components follow the same principles for users with motion-reduction preferences and assistive tech.',
  'a11y.motion.reduced':
    'Auto-respects `prefers-reduced-motion: reduce` — when the OS setting is on, all animations switch to a static final state immediately (entry effects display fully shown right away).',
  'a11y.motion.ariaLabel':
    '`aria-label` exposes the original text to screen readers as one piece — split-letter spans are not read individually.',
  'a11y.motion.ariaHidden':
    'Letter / channel spans split for animation use `aria-hidden="true"` — invisible to assistive tech.',
  'a11y.motion.touch':
    'Hover-based interactions (VariableFontHover / SpotlightText / GravityText hover trigger) are naturally inactive on touch devices — content is never made inaccessible.',
};

export const dictionaries: Record<Locale, Dict> = { ko, en };
