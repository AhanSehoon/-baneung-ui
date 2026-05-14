# @baneung-pack/grid

> 바능 디자인 시스템 데이터 그리드 — virtualization 토글 + 내장 페이지네이션

[![npm](https://img.shields.io/npm/v/@baneung-pack/grid.svg)](https://www.npmjs.com/package/@baneung-pack/grid)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/AhanSehoon/-baneung-ui/blob/master/LICENSE)

**📖 데모 / 컴포넌트 카탈로그**: https://baneung-ui-docs-op7v.vercel.app

`@baneung-pack/ui`와 같은 디자인 토큰을 공유하는 데이터 그리드 컴포넌트입니다. 행 수가 적을 땐 일반 `<table>`, 많을 땐 `virtualized` props 한 줄로 가상화 모드로 전환합니다.

> ⚠️ **v0.1.0 (MVP)**: 현재는 텍스트/커스텀 함수 렌더러와 내장 페이지네이션만 지원합니다. 인라인 편집, 드롭다운/날짜/숫자 콤마 등 빌트인 렌더러, ref API(saved/changed/deleted)는 후속 버전에서 추가됩니다.

## 설치

```bash
pnpm add @baneung-pack/grid
# or: npm install @baneung-pack/grid / yarn add @baneung-pack/grid
```

Peer dependencies:

- React `^18 || ^19`
- React DOM `^18 || ^19`

## 사용

```tsx
import '@baneung-pack/grid/styles.css';
import { Grid, type GridColumn } from '@baneung-pack/grid';

interface Item {
  id: number;
  name: string;
  price: number;
}

const columns: GridColumn<Item>[] = [
  { id: 'name', header: '이름', accessor: 'name' },
  {
    id: 'price',
    header: '가격',
    accessor: 'price',
    align: 'right',
    renderer: (v) => `${(v as number).toLocaleString()}원`, // 콤마 + 원 접미
  },
];

const data: Item[] = [
  { id: 1, name: '사과', price: 1000 },
  { id: 2, name: '바나나', price: 2000 },
];

export default function MyPage() {
  return <Grid columns={columns} data={data} pageSize={20} />;
}
```

## Props 요약

| Prop             | 타입                                           | 기본값  | 설명                                                 |
| ---------------- | ---------------------------------------------- | ------- | ---------------------------------------------------- |
| `columns`        | `GridColumn<TRow>[]`                           | 필수    | 컬럼 정의                                            |
| `data`           | `TRow[]`                                       | 필수    | 행 데이터                                            |
| `virtualized`    | `boolean`                                      | `false` | 가상화 활성. 1000+ 행 권장                           |
| `rowHeight`      | `number`                                       | `36`    | 가상화 모드에서 행 높이(px)                          |
| `height`         | `number \| string`                             | `400`   | 컨테이너 높이                                        |
| `pageSize`       | `number`                                       | `0`     | `> 0`이면 페이지네이션 활성                          |
| `showPagination` | `boolean`                                      | `true`  | 내장 페이지네이션 UI 표시. 외부 페이징 사용 시 false |
| `page`           | `number`                                       | -       | controlled 페이지 (1-based)                          |
| `onPageChange`   | `(page: number) => void`                       | -       | controlled 모드 콜백                                 |
| `emptyState`     | `ReactNode`                                    | -       | 데이터 없을 때 표시                                  |
| `getRowId`       | `(row: TRow, idx: number) => string \| number` | -       | 행 키 추출 (재정렬·키 안정성 위해 권장)              |

## 가상화 토글

```tsx
// 작은 데이터 (~100행): 일반 모드 — 모든 행 렌더
<Grid columns={cols} data={small} />

// 큰 데이터 (1000+ 행): 가상화 — DOM 노드 수 일정
<Grid columns={cols} data={large} virtualized height={500} rowHeight={36} />
```

가상화는 `@tanstack/react-virtual` 기반. 시맨틱 `<table>` 구조를 유지합니다.

## 외부 페이지네이션 사용

```tsx
// 내장 페이지네이션 숨기고 외부 컴포넌트 사용
<Grid
  columns={cols}
  data={data}
  pageSize={20}
  page={page}
  onPageChange={setPage}
  showPagination={false}
/>
<MyCustomPagination current={page} total={Math.ceil(data.length / 20)} onChange={setPage} />
```

## CSS 격리

`@baneung-pack/ui`와 동일하게 모든 스타일이 `@layer baneung`에 격리되어 있습니다. ui 패키지와 함께 사용 시 layer가 자동으로 머지되어 충돌하지 않습니다.

자세한 layer 설정은 [@baneung-pack/ui README의 "CSS 격리" 섹션](https://www.npmjs.com/package/@baneung-pack/ui#css-격리-cascade-layers) 참고.

## 로드맵

- **v0.2**: 빌트인 렌더러 (number-comma, date, dropdown, icon)
- **v0.3**: 더블클릭 인라인 편집 + ref API (saved/changed/deleted 추적)
- **v0.4**: 정렬·필터·다중 선택·컬럼 리사이즈

## 링크

- **GitHub**: [AhanSehoon/-baneung-ui](https://github.com/AhanSehoon/-baneung-ui)
- **Issues**: [Bug & Feature requests](https://github.com/AhanSehoon/-baneung-ui/issues)

## 라이선스

[MIT](https://github.com/AhanSehoon/-baneung-ui/blob/master/LICENSE) © 바능(Baneung)
