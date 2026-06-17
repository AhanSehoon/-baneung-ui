# @baneung-pack/chart

바능 디자인 시스템 3D 차트 라이브러리. **Three.js / React Three Fiber** 기반의 인터랙티브 3D 시각화 컴포넌트.

> 🚧 MVP 단계 — 현재 **3D Bar Chart** 1종만 제공. 후속으로 3D City · Timeline · Map 차트 추가 예정.

## 설치

```bash
pnpm add @baneung-pack/chart three @react-three/fiber @react-three/drei
# 또는
npm i @baneung-pack/chart three @react-three/fiber @react-three/drei
```

`three`와 `@react-three/*`는 peer-like 의존성입니다(번들에서 제외). 소비자 앱에서 한 번만 설치해 같은 인스턴스를 공유합니다.

## CSS

```ts
// app/layout.tsx (Next.js App Router)
import '@baneung-pack/chart/styles.css';
```

모든 스타일은 `@layer baneung`에 격리되어 소비자 글로벌 CSS와 충돌하지 않습니다.

## 사용

```tsx
'use client';

import { BarChart3D } from '@baneung-pack/chart';

const data = [
  { label: '서울', value: 120 },
  { label: '부산', value: 80 },
  { label: '대전', value: 65 },
  { label: '제주', value: 40 },
  { label: '광주', value: 55 },
];

export function CityRanking() {
  return (
    <div style={{ width: '100%', height: 480 }}>
      <BarChart3D data={data} />
    </div>
  );
}
```

## 인터랙션

- **회전** — 마우스 좌클릭 + 드래그
- **줌** — 마우스 휠
- **팬** — 마우스 우클릭 + 드래그
- **hover** — 막대 위 마우스 → 라벨·값 툴팁

## API

### `<BarChart3D>`

| Prop             | Type                       | Default     | 설명                                                                     |
| ---------------- | -------------------------- | ----------- | ------------------------------------------------------------------------ |
| `data`           | `BarChartDatum[]`          | —           | `{ label: string, value: number }[]`. 값 크기에 비례한 높이의 막대 생성. |
| `maxHeight`      | `number`                   | `5`         | 가장 큰 값에 해당하는 막대 높이(Three.js 단위).                          |
| `barWidth`       | `number`                   | `0.7`       | 각 막대의 가로/세로 크기.                                                |
| `gap`            | `number`                   | `0.4`       | 막대 간 간격.                                                            |
| `barColor`       | `string`                   | `'#3B4B63'` | 막대 기본 색상(바능 navy). hover 시 자동 강조.                           |
| `showLabel`      | `boolean`                  | `true`      | 막대 상단 label 텍스트 표시 여부.                                        |
| `cameraPosition` | `[number, number, number]` | `[5, 5, 5]` | 초기 카메라 위치(x, y, z).                                               |
| `className`      | `string`                   | —           | 외부 wrapper div의 추가 className.                                       |

### `BarChartDatum`

```ts
export interface BarChartDatum {
  label: string;
  value: number;
  /** 막대 색상 override (없으면 BarChart3D의 barColor). */
  color?: string;
  /** 임의 메타데이터 (toolTip 커스터마이즈 시 사용). */
  meta?: Record<string, unknown>;
}
```

### 유틸

```ts
import { scaleHeight } from '@baneung-pack/chart';

// d3-scale 기반 linear scale: 데이터 max → maxHeight로 매핑
const scale = scaleHeight(data, { maxHeight: 5 });
const height = scale(120); // → 5 (만약 120이 max)
```

## 확장 (예정)

- CSV 업로드 → `BarChart3D`에 매핑 (Papa Parse 사용)
- 테마 선택 (라이트/다크/네온)
- PNG 다운로드 (`gl.domElement.toDataURL`)
- 3D City Chart — 도시 빌딩 형태
- 3D Timeline Chart — 시간축
- 3D Map Chart — 지리 데이터

## 디자인 원칙

1. 처음부터 범용 차트 라이브러리를 만들지 않는다 — 한 종류씩 완성도 있게.
2. 데이터 계산 로직(`lib/`)과 Three.js 렌더(`components/`)를 분리.
3. 모바일·성능 최적화는 초기부터 고려 (DPR 캡, instance reuse).
4. 숫자 라벨·툴팁으로 데이터 해석도 가능 (예쁜 비주얼이 전부가 아님).
5. 웹 표준·접근성 준수 — `<canvas>` 옆에 sr-only `<table>` 제공 (계획).

## 라이선스

MIT
