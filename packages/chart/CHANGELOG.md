# @baneung-pack/chart

## 0.3.0

### Minor Changes

- **웹 접근성(WCAG 2.1 AA) + 한글 숫자 포맷 + FlowChart 추가** — chart.js 단순 wrapper를 넘어선 실질적 가치 추가.

  # 신규 차트: FlowChart
  - 노드-엣지 그래프 (SVG 기반, chart.js 무관)
  - 내장 edge 4종: `straight` / `bezier` / `step` / `smoothstep`
  - 사용자 정의 edge — `edgeTypes` prop에 SVG path 함수 등록
  - 마우스 드래그 pan + 마우스 휠 zoom in/out (커서 위치 기준)
  - 화살표 머리, edge 라벨, 흐름 애니메이션, 점선 옵션
  - 자동 핸들 면 선택 (두 노드의 상대 위치 기반)

  # 웹 접근성 (모든 차트)
  - `a11yTable` prop (기본 true) — sr-only `<table>` 자동 렌더
  - 스크린리더가 canvas 차트 데이터를 텍스트로 읽을 수 있음
  - `a11yCaption` prop — 표 caption (스크린리더가 먼저 읽음)
  - WCAG 1.1.1 (Non-text Content) 준수

  # 한글 숫자 포맷 (모든 차트)
  - `valueFormat` prop — tooltip · 데이터 라벨 · y축 tick 일관 적용
  - `'korean'` → 125만, 1.2억, 1.5조 자동 변환
  - `'comma'` → 1,250,000 천 단위 콤마
  - 사용자 정의 함수도 지원: `(n) => string`

  # 제거
  - **MapChart 삭제** + d3-geo, topojson-client peer dep 제거 — chart 패키지 범위 밖으로 판단
  - peer dep 5개 → 3개로 감소 (chart.js, react-chartjs-2, chartjs-plugin-datalabels)

## 0.2.0

### Minor Changes

- **렌더링 엔진 교체: SVG(recharts) → Canvas(chart.js)** — 0.1.0 출시 직후 0.2.0으로 전환.

  # 왜 바꿨는가
  - Canvas 기반이 대용량 데이터 포인트에서 메모리/페인트 비용이 낮음
  - chart.js는 자체적으로 controller/scale/plugin tree-shaking 지원
  - SVG DOM 트리 생성 비용이 제거됨

  # Breaking changes (외부 API)
  - peer dependency 교체: `recharts ^2.12.0` → `chart.js ^4.4.0` + `react-chartjs-2 ^5.2.0`
  - `PieChart`의 `outerRadius` deprecated — chart.js는 반응형이라 px 단위 외부 반지름 미지원. 차트 크기는 부모 컨테이너 + `height`로 조절
  - `PieChart.innerRadius`는 px 대신 **0~1 비율**로 변경 (chart.js cutout 매핑)

  # 공통 props는 그대로
  - `data` / `xKey` / `yKeys` / `nameKey` / `valueKey` / `labels` / `colors` / `height` / `showGrid` / `showLegend` / `showTooltip` / `emptyState` / `className` 모두 동일 시그니처 유지
  - 마이그레이션: dependencies 교체만으로 대부분 동작

  # 내부
  - `lib/chartjs-setup.ts`에서 controller/scale/plugin 일괄 register (사용자 코드에서 별도 register 불필요)
  - `'use client'` 자동 주입 패턴 유지 (RSC 호환)

## 0.1.0

### Minor Changes

- 신규 패키지 `@baneung-pack/chart` 초도 출시 — recharts 기반 차트 라이브러리. (0.2.0에서 chart.js로 교체됨)
