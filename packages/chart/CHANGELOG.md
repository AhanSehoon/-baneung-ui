# @baneung-pack/chart

## 0.1.0

### Minor Changes

- 초기 출시 — 3D Bar Chart MVP (React Three Fiber 기반).

  # 컴포넌트
  - **`BarChart3D`** — 3D 막대 차트. `data: BarChartDatum[]` 입력 →
    값 크기에 비례한 높이의 3D 막대로 시각화.
  - **`ChartCanvas`** — R3F `Canvas` 래퍼. 카메라, OrbitControls(회전·줌),
    조명, 바닥 plane을 한 곳에 모은 진입점.

  # 인터랙션
  - 마우스 드래그로 회전 / 휠로 줌 (OrbitControls).
  - 막대 hover 시 라벨·값 툴팁 표시.
  - 막대 상단에 label 상시 표시.

  # 데이터 / 스케일
  - `scaleHeight(data, options?)` — d3-scale 기반. 최댓값을 maxHeight로
    매핑하는 linear scale.
  - 데이터 계산 로직(`lib/`)과 Three.js 렌더(`components/`)를 디렉토리 수준에서 분리 →
    추후 3D City / Timeline / Map 차트 추가 시 lib 재사용 가능.

  # CSS 격리
  - `@baneung-pack/ui`와 동일한 `@layer baneung`로 모든 스타일 격리.

  # SSR / RSC
  - `tsup` onSuccess에서 React/R3F/Three import가 있는 출력 파일에만
    `'use client'` 디렉티브 주입 → Next.js App Router 호환.
