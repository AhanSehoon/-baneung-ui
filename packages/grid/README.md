# @baneung-pack/grid

> 바능 디자인 시스템 데이터 그리드 — virtualization 토글 + 내장 페이지네이션

[![npm](https://img.shields.io/npm/v/@baneung-pack/grid.svg)](https://www.npmjs.com/package/@baneung-pack/grid)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://github.com/BaneungCop/-baneung-ui/blob/master/LICENSE)

**📖 데모 / 컴포넌트 카탈로그**: https://ui.baneung.com

`@baneung-pack/ui`와 같은 디자인 토큰을 공유하는 데이터 그리드 컴포넌트입니다. 행 수가 적을 땐 일반 `<table>`, 많을 땐 `virtualized` props 한 줄로 가상화 모드로 전환합니다.

> 🚧 **첫 릴리스**: virtualization · 페이지네이션 · 인라인 편집 · 행 선택 · ref API(saved/changed/deleted)를 지원합니다. 드롭다운/날짜/숫자 콤마 등 built-in 셀 렌더러는 후속 버전에서 추가됩니다.

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
| `getRowId`       | `(row: TRow, idx: number) => string \| number` | -       | 행 키 추출. 편집/선택 사용 시 필수 권장              |
| `selectable`     | `boolean`                                      | `false` | true면 첫 컬럼에 체크박스 자동 추가                  |
| `onRowChange`    | `(row: TRow, id) => void`                      | -       | 편집 commit 시 콜백 (자동 저장·로깅 용도)            |

### GridColumn 추가 옵션

| 필드       | 타입      | 설명                                                               |
| ---------- | --------- | ------------------------------------------------------------------ |
| `editable` | `boolean` | true면 셀 더블클릭 시 편집 모드 진입. accessor가 string key만 동작 |

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

## 인라인 편집

```tsx
const columns: GridColumn<Item>[] = [
  { id: 'name', header: '이름', accessor: 'name', editable: true }, // 더블클릭 → input
  { id: 'price', header: '가격', accessor: 'price', editable: true },
];
```

- **더블클릭**: 편집 모드 진입
- **Enter / blur**: commit
- **Escape**: cancel
- 한글 IME 조합 중 Enter는 commit이 아닌 한글 확정으로 안전 처리됨

## 행 선택 + 외부 제어 (ref API)

`React.forwardRef` + `useImperativeHandle` 패턴으로 imperative API 제공:

```tsx
import { useRef } from 'react';
import { Grid, type GridHandle, type GridColumn } from '@baneung-pack/grid';

interface Item {
  id: number;
  name: string;
  price: number;
}

function MyPage() {
  const gridRef = useRef<GridHandle<Item>>(null);

  const handleSave = () => {
    const saved = gridRef.current?.getSavedData(); // 편집 반영, 삭제 제외 전체
    const changed = gridRef.current?.getChangedData(); // 편집된 행만
    const deleted = gridRef.current?.getDeletedData(); // 삭제된 행 (원본)
    api.bulkUpsert(changed);
    api.bulkDelete(deleted.map((r) => r.id));
  };

  return (
    <>
      <button onClick={() => gridRef.current?.deleteSelected()}>선택 삭제</button>
      <button onClick={handleSave}>저장</button>
      <button onClick={() => gridRef.current?.reset()}>되돌리기</button>

      <Grid
        ref={gridRef}
        columns={columns}
        data={data}
        selectable // 체크박스 컬럼 자동 추가
        getRowId={(r) => r.id} // 편집/선택/삭제 추적의 기준
      />
    </>
  );
}
```

### GridHandle 메서드

| 메서드             | 반환     | 설명                                      |
| ------------------ | -------- | ----------------------------------------- |
| `getSavedData()`   | `TRow[]` | 편집 반영, 삭제 제외 전체 (저장 페이로드) |
| `getChangedData()` | `TRow[]` | 편집된 행만 (PATCH 페이로드)              |
| `getDeletedData()` | `TRow[]` | 삭제된 행의 **원본** 스냅샷               |
| `getSelectedIds()` | `(id)[]` | 선택된 행 ID 배열                         |
| `deleteSelected()` | `void`   | 선택된 행을 모두 삭제로 이동              |
| `clearSelection()` | `void`   | 모든 선택 해제                            |
| `reset()`          | `void`   | 편집/삭제 내역 폐기, 원본 data로 복원     |

## Tree (계층) 모드

중첩 데이터를 계층 표시 가능. 첫 컬럼에 caret + 들여쓰기가 자동 삽입됩니다.

```tsx
interface Node {
  id: string;
  name: string;
  children?: Node[];
}

const data: Node[] = [
  {
    id: '1',
    name: 'Root',
    children: [
      { id: '1-1', name: 'Child A' },
      { id: '1-2', name: 'Child B', children: [{ id: '1-2-1', name: 'Grandchild' }] },
    ],
  },
];

<Grid
  columns={cols}
  data={data}
  tree // ← 트리 모드 활성
  getChildren={(row) => row.children} // ← 자식 추출
  getRowId={(row) => row.id} // ← 안정적 ID 필수
  defaultExpandedIds={['1']} // ← 'all' / 'none' / id 배열
/>;
```

### 옵션

| Prop                 | 타입                                      | 설명                             |
| -------------------- | ----------------------------------------- | -------------------------------- |
| `tree`               | `boolean`                                 | 트리 모드 활성                   |
| `getChildren`        | `(row) => TRow[] \| undefined`            | 자식 행 추출 (tree=true 시 필수) |
| `defaultExpandedIds` | `'all' \| 'none' \| (string \| number)[]` | 기본 펼침 상태. 기본 `'none'`    |

### 제약

- 인라인 편집·삭제는 최상위 행만 안전. 중첩 행 편집/삭제는 후속 버전 개선 예정.
- 가상화·페이지네이션은 정상 작동 (펼침 상태 기반 flat 리스트에 적용).

## CSS 격리

`@baneung-pack/ui`와 동일하게 모든 스타일이 `@layer baneung`에 격리되어 있습니다. ui 패키지와 함께 사용 시 layer가 자동으로 머지되어 충돌하지 않습니다.

자세한 layer 설정은 [@baneung-pack/ui README의 "CSS 격리" 섹션](https://www.npmjs.com/package/@baneung-pack/ui#css-격리-cascade-layers) 참고.

## 로드맵

- **v0.2**: 빌트인 셀 렌더러 (number-comma, date-picker, dropdown, icon)
- **v0.3**: 정렬·필터·컬럼 리사이즈
- **v0.4**: 행 드래그 순서 변경·그룹·고정 컬럼

## 링크

- **GitHub**: [BaneungCop/-baneung-ui](https://github.com/BaneungCop/-baneung-ui)
- **Issues**: [Bug & Feature requests](https://github.com/BaneungCop/-baneung-ui/issues)

## 라이선스

[Apache-2.0](https://github.com/BaneungCop/-baneung-ui/blob/master/LICENSE) © 바능(Baneung)
