/**
 * 사이트 전역 설정 (SEO/GEO/sitemap/robots 공통 소스).
 *
 * - 배포 URL은 `NEXT_PUBLIC_SITE_URL` 환경변수에서 읽음. 미지정 시 placeholder.
 *   Vercel preview/production은 `NEXT_PUBLIC_SITE_URL`을 명시 권장 (canonical 정확화).
 * - 패키지/버전/저자 정보는 한 곳에서 관리해 JSON-LD·llms.txt·메타 태그 간 불일치 방지.
 */
export const siteConfig = {
  name: '바능 디자인 시스템',
  nameEn: 'Baneung Design System',
  shortName: '@baneung-pack',
  tagline: 'React 디자인 시스템 · UI · Grid · Chart · Editor',
  description:
    '바능 브랜드 가이드라인을 따르는 React 디자인 시스템. 각진(sharp) 디자인 · WCAG AA 접근성 · 한글 우선. UI / Grid / Chart / Editor 4개 패키지를 단일 토큰으로 일관 적용합니다.',
  descriptionEn:
    'Baneung Design System — a React component library built in Pangyo, Korea. Sharp/angular design, WCAG AA accessibility, Korean-first typography. Ships UI, Grid, Chart, and Editor packages with a unified token system.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://baneung-pack.dev',
  // Next.js의 `app/opengraph-image.tsx`가 동적 생성 → `/opengraph-image`로 서빙.
  // metadata.openGraph.images는 이 경로 또는 root layout에선 명시. JSON-LD에선 절대 URL로 노출.
  ogImage: '/opengraph-image',
  author: '바능 (Baneung)',
  authorUrl: 'https://baneung-pack.dev',
  location: '판교, 대한민국',
  locale: 'ko_KR',
  npmOrg: '@baneung-pack',
  repo: 'https://github.com/baneung/baneung-ui',
  packages: [
    {
      name: '@baneung-pack/ui',
      desc: '60+ React 컴포넌트 (Accordion ~ Typography). Radix UI primitives 기반, WCAG AA.',
    },
    {
      name: '@baneung-pack/grid',
      desc: '가상화 · Excel 내보내기 · 컬럼 고정 · Tree · 인라인 편집 지원 데이터 그리드.',
    },
    {
      name: '@baneung-pack/chart',
      desc: 'Chart.js 기반 차트 라이브러리. 한글 숫자 포맷, sr-only 표 등 접근성 일급 지원.',
    },
    {
      name: '@baneung-pack/editor',
      desc: 'WYSIWYG 리치텍스트 에디터. 이미지 붙여넣기, 커스텀 툴바, 0-dependency 코어.',
    },
    {
      name: '@baneung-pack/tokens',
      desc: '디자인 토큰 (CSS 변수 + TS + JSON). 단일 진실 공급원(SSOT).',
    },
  ],
} as const;

/**
 * JSON-LD 구조화 데이터.
 *
 * @type 선택:
 * - Organization: 바능 자체 — 회사/팀의 검색 결과 카드
 * - WebSite: 사이트 자체 + SearchAction (구글 사이트링크 검색)
 * - SoftwareSourceCode 그래프: 각 npm 패키지 — GEO(AI 검색)가 "어떤 React UI 라이브러리?"
 *   질의에 인용할 때 필요한 작가/라이선스/저장소 메타.
 *
 * 단일 `@graph` 배열로 묶어서 한 번에 임베드 (페이지당 1개 script만 권장).
 */
export const siteJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteConfig.url}/#organization`,
      name: siteConfig.author,
      alternateName: ['Baneung', '바능'],
      url: siteConfig.url,
      logo: `${siteConfig.url}/apple-icon.png`,
      description: siteConfig.description,
      sameAs: [siteConfig.repo],
      address: {
        '@type': 'PostalAddress',
        addressLocality: '판교',
        addressRegion: '경기도',
        addressCountry: 'KR',
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      alternateName: [siteConfig.nameEn, siteConfig.shortName],
      description: siteConfig.description,
      inLanguage: ['ko', 'en'],
      publisher: { '@id': `${siteConfig.url}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${siteConfig.url}/components?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    ...siteConfig.packages.map((p) => ({
      '@type': 'SoftwareSourceCode',
      '@id': `${siteConfig.url}/#${p.name.replace('@', '').replace('/', '-')}`,
      name: p.name,
      description: p.desc,
      programmingLanguage: 'TypeScript',
      codeRepository: siteConfig.repo,
      runtimePlatform: ['React 18+', 'React 19+'],
      license: 'https://opensource.org/licenses/MIT',
      author: { '@id': `${siteConfig.url}/#organization` },
    })),
  ],
} as const;

/**
 * 주요 라우트 목록 — sitemap.ts와 llms.txt가 공통 참조.
 * 새 라우트 추가 시 여기에만 등록하면 sitemap·llms.txt에 자동 반영.
 */
export const siteRoutes: { path: string; title: string; description: string; priority: number }[] =
  [
    { path: '/', title: '홈', description: '바능 디자인 시스템 홈페이지', priority: 1.0 },
    { path: '/intro', title: '소개', description: '바능 디자인 시스템 소개', priority: 0.9 },
    {
      path: '/install',
      title: '설치 가이드',
      description: 'npm/pnpm 설치 및 초기 설정',
      priority: 0.9,
    },
    {
      path: '/components',
      title: '컴포넌트',
      description: '60+ React 컴포넌트 카탈로그',
      priority: 0.9,
    },
    { path: '/tokens', title: '디자인 토큰', description: 'CSS 변수·JS·JSON 토큰', priority: 0.7 },
    { path: '/accessibility', title: '접근성', description: 'WCAG AA 준수 가이드', priority: 0.7 },
    { path: '/versions', title: '버전·체인지로그', description: '릴리스 히스토리', priority: 0.5 },
    {
      path: '/grid/basic',
      title: 'Grid 기본',
      description: '데이터 그리드 기본 사용법',
      priority: 0.7,
    },
    {
      path: '/grid/virtualized',
      title: 'Grid 가상화',
      description: '대용량 행 가상 스크롤',
      priority: 0.6,
    },
    { path: '/grid/excel', title: 'Grid Excel', description: '.xlsx 내보내기', priority: 0.6 },
    { path: '/grid/tree', title: 'Grid Tree', description: '트리 모드', priority: 0.6 },
    { path: '/chart/bar', title: 'BarChart', description: '막대 차트', priority: 0.6 },
    { path: '/chart/line', title: 'LineChart', description: '선 차트', priority: 0.6 },
    { path: '/chart/area', title: 'AreaChart', description: '영역 차트', priority: 0.6 },
    { path: '/chart/pie', title: 'PieChart', description: '파이 차트', priority: 0.6 },
    { path: '/chart/doughnut', title: 'DoughnutChart', description: '도넛 차트', priority: 0.6 },
    { path: '/chart/scatter', title: 'ScatterChart', description: '산점도 차트', priority: 0.6 },
    { path: '/chart/radar', title: 'RadarChart', description: '레이더 차트', priority: 0.6 },
    {
      path: '/chart/waterfall',
      title: 'WaterfallChart',
      description: '누적 변화 차트',
      priority: 0.6,
    },
    { path: '/chart/flow', title: 'FlowChart', description: '플로우 차트', priority: 0.6 },
    { path: '/editor/basic', title: 'Editor 기본', description: 'WYSIWYG 기본', priority: 0.7 },
    {
      path: '/editor/full',
      title: 'Editor 풀 기능',
      description: '모든 툴바 활성',
      priority: 0.6,
    },
    {
      path: '/effect/typewriter',
      title: 'Typewriter',
      description: '타이핑 효과 + 깜빡이는 커서 — 1회/loop',
      priority: 0.6,
    },
    {
      path: '/effect/rotating-words',
      title: 'RotatingWords',
      description: '단어 슬라이드+페이드 순환',
      priority: 0.6,
    },
    {
      path: '/effect/scramble-text',
      title: 'ScrambleText',
      description: '해킹/디코딩 스타일 텍스트 등장',
      priority: 0.6,
    },
    {
      path: '/effect/split-text-reveal',
      title: 'SplitTextReveal',
      description: '글자/단어 단위 순차 페이드+슬라이드',
      priority: 0.6,
    },
    {
      path: '/effect/count-up',
      title: 'CountUp',
      description: '숫자 카운터 — 통계 섹션·KPI',
      priority: 0.6,
    },
    {
      path: '/effect/gradient-text',
      title: 'GradientText',
      description: '그라데이션 흐름/반짝 텍스트',
      priority: 0.6,
    },
    {
      path: '/effect/blur-in-text',
      title: 'BlurInText',
      description: '흐릿하게 시작해 선명해지는 텍스트',
      priority: 0.6,
    },
    {
      path: '/effect/wavy-text',
      title: 'WavyText',
      description: '글자가 파도치거나 통통 튀는 효과',
      priority: 0.6,
    },
    {
      path: '/effect/glitch-text',
      title: 'GlitchText',
      description: 'RGB 채널 글리치 효과',
      priority: 0.6,
    },
    {
      path: '/effect/variable-font-hover',
      title: 'VariableFontHover',
      description: '커서 주변 글자만 굵어지는 가변 폰트 효과',
      priority: 0.6,
    },
    {
      path: '/effect/circular-text',
      title: 'CircularText',
      description: '원형 경로 회전 텍스트 (배지)',
      priority: 0.6,
    },
    {
      path: '/effect/gravity-text',
      title: 'GravityText',
      description: '글자가 중력에 떨어지거나 흩어지는 효과',
      priority: 0.6,
    },
    {
      path: '/effect/spotlight-text',
      title: 'SpotlightText',
      description: '커서 주변만 밝아지는 스포트라이트 효과',
      priority: 0.6,
    },
    // Interactive effects (text 외)
    {
      path: '/effect/ripple',
      title: 'Ripple',
      description: '자식을 감싸 클릭 위치 물결 효과',
      priority: 0.6,
    },
    {
      path: '/effect/confetti',
      title: 'Confetti',
      description: 'ConfettiProvider + useConfetti — 명령형 발사 (Canvas)',
      priority: 0.7,
    },
    // @baneung-pack/ui 이전 컴포넌트 — demo URL은 /effect/* 유지.
    {
      path: '/effect/animated-button',
      title: 'AnimatedButton',
      description: 'idle → loading → success/error 모핑 — Promise 자동 처리',
      priority: 0.7,
    },
    {
      path: '/effect/animated-tabs',
      title: 'AnimatedTabs',
      description: '활성 인디케이터 슬라이드 탭 + Arrow 키',
      priority: 0.7,
    },
    {
      path: '/effect/copy-button',
      title: 'CopyButton',
      description: '클립보드 복사 + 아이콘 모핑 + 툴팁',
      priority: 0.6,
    },
    {
      path: '/effect/like-button',
      title: 'LikeButton',
      description: '하트 + burst 입자 + 카운트',
      priority: 0.6,
    },
    {
      path: '/effect/star-rating',
      title: 'StarRating',
      description: '별점 — half/hover/키보드/readOnly',
      priority: 0.7,
    },
    {
      path: '/effect/stepper',
      title: 'Stepper',
      description: '다단계 진행 표시기 — horizontal/vertical · 연결선 애니메이션',
      priority: 0.6,
    },
  ];
