# @baneung-pack/chart

> 바능 디자인 시스템 차트 라이브러리 — **Chart.js v4** 기반 Canvas 차트 + **웹 접근성** + **한글 숫자 포맷** + **FlowChart**

[![npm](https://img.shields.io/npm/v/@baneung-pack/chart.svg)](https://www.npmjs.com/package/@baneung-pack/chart)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://github.com/BaneungCop/-baneung-ui/blob/master/LICENSE)

Keywords: **chart** · **react** · **chart.js** · **canvas** · **accessibility** · **a11y** · **korean** · **flow-chart** · **bar-chart** · **line-chart** · **pie-chart** · **design-system**

**📖 데모 / 컴포넌트 카탈로그**: https://ui.baneung.com

`@baneung-pack/ui` · `@baneung-pack/grid` · `@baneung-pack/editor`와 같은 디자인 토큰을 공유하는 차트 라이브러리.

## 기술 스택

- **[Chart.js v4](https://www.chartjs.org/)** + **[react-chartjs-2 v5](https://react-chartjs-2.js.org/)** — 통계 차트 9종 (Canvas 기반)
- **[chartjs-plugin-datalabels](https://chartjs-plugin-datalabels.netlify.app/)** — 데이터 라벨 (`showValues` prop)
- **자체 SVG 구현** — FlowChart (노드-엣지 그래프, chart.js 무관)

## 차트 종류

### Canvas 기반 (Chart.js)

- **BarChart** — 막대 (세로/가로/누적, 양수/음수 자동)
- **LineChart** — 선 (직선/곡선)
- **AreaChart** — 영역 (단일/누적, fillOpacity)
- **PieChart** — 파이 (hover offset)
- **DoughnutChart** — 도넛 (PieChart wrapper, thickness)
- **MixedChart** — 막대 + 선 혼합 (Pareto 등, 우측 보조 y축 옵션)
- **WaterfallChart** — 누적 변화 시각화 (매출 → 비용 → 이익, floating bars)
- **ScatterChart** — 산점도 (groupKey로 시리즈 자동 분리, pointStyle 변경)
- **RadarChart** — 레이더 (여러 축의 다차원 비교, showLine 토글)

### SVG 기반 (자체 구현)

- **FlowChart** — 노드-엣지 그래프
  - 내장 edge 4종: `straight` / `bezier` / `step` / `smoothstep`
  - 사용자 정의 edge (`edgeTypes` prop으로 SVG path 함수 등록)
  - 마우스 드래그로 pan + 휠로 zoom in/out (커서 위치 기준)
  - 화살표 머리, edge 라벨, 흐름 애니메이션, 점선 옵션
  - 자동 핸들 면 선택 (두 노드의 상대 위치 기반)

## 핵심 부가 기능

### 🌐 웹 접근성 (WCAG 2.1 AA)

canvas는 시각 정보만 → 스크린리더가 데이터 못 읽음. 모든 차트가 `a11yTable` prop으로 동일 데이터를 **sr-only `<table>`로 자동 렌더** (WCAG 1.1.1 Non-text Content 준수):

```tsx
<BarChart
  data={data}
  xKey="month"
  yKeys={['revenue']}
  a11yTable // 기본 true — 비활성화하려면 false
  a11yCaption="월별 매출" // 스크린리더가 먼저 읽는 캡션
/>
```

- `display: none` 아닌 `sr-only` 패턴(`clip: rect(0,0,0,0)`) — 시각 영향 없이 스크린리더만 읽음
- Pie/Doughnut은 자동으로 % 컬럼 포함 — 카테고리 데이터에 적합
- Waterfall은 단계/변화량/누적합계 3개 컬럼

### 🇰🇷 한글 숫자 포맷

모든 차트의 tooltip · 데이터 라벨 · y축 tick에 한글 단위 자동 적용:

```tsx
<BarChart
  data={data}
  valueFormat="korean" // 12500000 → "1250만" / 1.2억 / 1.5조 자동
/>
```

- `'plain'` (기본): 변환 없음
- `'comma'`: `1,250,000` — 천 단위 콤마
- `'korean'`: `125만`, `1.2억`, `1.5조` — 한글 단위
- `(value: number) => string`: 사용자 정의 (단위 suffix 등)

### 🎨 디자인 시스템 통합

- 다크 모드 자동 cascade (CSS 변수 기반)
- DEFAULT_COLORS — navy/teal 기반 10색 팔레트 (다른 `@baneung-pack/*` 패키지와 톤 통일)
- 반응형 (`responsive: true` + `maintainAspectRatio: false`)

## 설치

```bash
pnpm add @baneung-pack/chart chart.js react-chartjs-2 chartjs-plugin-datalabels
# 또는
npm install @baneung-pack/chart chart.js react-chartjs-2 chartjs-plugin-datalabels
```

Peer deps: `react ^18 || ^19`, `react-dom ^18 || ^19`, `chart.js ^4.4.0`, `react-chartjs-2 ^5.2.0`, `chartjs-plugin-datalabels ^2.2.0`.

> Chart.js의 controller / scale / plugin은 이 패키지가 내부에서 한 번 자동 register합니다. 별도 `Chart.register(...)` 코드 불필요.

## 사용 예시

### 기본 막대 차트

```tsx
import { BarChart } from '@baneung-pack/chart';

const data = [
  { month: '1월', revenue: 12500000, profit: 3000000 },
  { month: '2월', revenue: 15000000, profit: 4000000 },
];

<BarChart
  data={data}
  xKey="month"
  yKeys={['revenue', 'profit']}
  labels={{ revenue: '매출', profit: '이익' }}
  valueFormat="korean"
  a11yCaption="월별 매출 및 이익"
/>;
```

### FlowChart

```tsx
import { FlowChart } from '@baneung-pack/chart';

<FlowChart
  height={420}
  nodes={[
    { id: 'a', label: 'Start', x: 40, y: 60 },
    { id: 'b', label: 'Process', x: 280, y: 60 },
    { id: 'c', label: 'End', x: 520, y: 60 },
  ]}
  edges={[
    { source: 'a', target: 'b', type: 'bezier' },
    { source: 'b', target: 'c', type: 'step', animated: true },
  ]}
/>;
```

## 공통 props (`ChartBaseProps`)

| Prop          | Type                                              | Default          | Description                            |
| ------------- | ------------------------------------------------- | ---------------- | -------------------------------------- |
| `data`        | `Record<string, unknown>[]`                       | 필수             | 데이터 배열                            |
| `height`      | `number`                                          | `300`            | 차트 높이(px). 너비는 부모 100%        |
| `colors`      | `readonly string[]`                               | `DEFAULT_COLORS` | 시리즈 컬러 팔레트                     |
| `showGrid`    | `boolean`                                         | `true`           | 그리드 표시 (Pie/Doughnut 무시)        |
| `showLegend`  | `boolean`                                         | `true`           | 범례 표시 (하단 위치)                  |
| `showTooltip` | `boolean`                                         | `true`           | 툴팁 표시                              |
| `emptyState`  | `ReactNode`                                       | -                | 빈 데이터 시 표시                      |
| `className`   | `string`                                          | -                | 외부 wrapper className                 |
| `valueFormat` | `'plain' \| 'comma' \| 'korean' \| (n) => string` | `'plain'`        | 숫자 포맷 (tooltip/라벨/축 일관 적용)  |
| `a11yTable`   | `boolean`                                         | `true`           | sr-only 접근성 데이터 테이블 자동 렌더 |
| `a11yCaption` | `string`                                          | -                | 스크린리더가 먼저 읽는 표 caption      |

각 차트별 전용 props는 데모 사이트(https://ui.baneung.com) 또는 d.ts 참조.

## 라이선스

[Apache-2.0](https://github.com/BaneungCop/-baneung-ui/blob/master/LICENSE) © 바능(Baneung)
