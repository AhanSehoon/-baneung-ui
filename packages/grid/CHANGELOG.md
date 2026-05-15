# @baneung-pack/grid

## 0.4.1

### Patch Changes

- 진행률 바 fill 색이 표시되지 않던 문제 수정.

  원인: grid의 globals.css `@theme inline`에 status 컬러
  (`--color-success`/`--color-danger`/`--color-warning`/`--color-info`)와
  `--color-foreground-subtle` 매핑이 빠져 있어 `bg-success` Tailwind 유틸리티가
  색을 못 받음 → fill 바가 투명해서 모든 행이 100% 차 있는 것처럼 보였음.

  @theme inline에 누락 토큰 추가. 이제 `renderer: 'progress'`가 `value/max`
  비율만큼만 녹색 fill을 그린다.

## 0.4.0

### Minor Changes

- 빌트인 셀 에디터 및 렌더러 추가.

  # Editors (`column.editor`)
  - `'text'` (기본): 일반 텍스트 input (기존)
  - `'number'`: `<input type="number">`
  - `'date'`: `<input type="date">` — 브라우저 네이티브 달력 popup
  - `'dropdown'`: `<select>` with `column.options`

  # Renderers (`column.renderer`)
  - `'progress'`: 진행률 바 + 숫자. `min`/`max`로 범위 (기본 0~100)
  - `'date'`: 포맷팅된 날짜 문자열. `dateFormat`으로 YYYY/MM/DD/HH/mm/ss 토큰

  # 호환
  - 기존 `editor` 미지정 + `editable: true`는 'text' 동작 그대로
  - renderer가 함수면 함수 결과 우선 (기존 동작)
  - aria 표준 준수 (progressbar role + aria-valuenow, combobox role 등)
  - 26 tests (editor 4개 신규)

## 0.3.0

### Minor Changes

- Tree (계층) 모드 추가.
  - `tree` prop으로 활성, `getChildren`으로 중첩 데이터 자식 추출
  - 첫 컬럼에 caret(▶/▼) + 들여쓰기 자동 삽입
  - `defaultExpandedIds`로 초기 펼침 상태 제어 (`'all'` / `'none'` / id 배열)
  - 가상화·페이지네이션과 호환 (펼침 상태 기반 flat 리스트에 적용)
  - 인라인 편집·삭제는 최상위 행만 안전 (중첩 행 편집은 후속 버전)
  - 22 tests (tree 4개 신규)

## 0.2.0

### Minor Changes

- 6fa8183: 새 패키지 `@baneung-pack/grid` 추가 (첫 publish).

  # 기능
  - **가상화 토글**: `virtualized` props 하나로 일반 모드 / `@tanstack/react-virtual`
    기반 가상화 모드 자동 분기. 1000+ 행에서도 DOM 노드 수 일정 유지.
  - **페이지네이션**: 내장 페이지네이션(`pageSize`) + 숨김 옵션(`showPagination=false`)
    - controlled 모드(`page` / `onPageChange`). 외부 페이징 컴포넌트와 자유 통합.
  - **인라인 편집**: 컬럼에 `editable: true` 지정 → 셀 더블클릭 → input 진입.
    Enter/blur로 commit, Escape로 cancel. 한글 IME composition 안전.
  - **행 선택 (체크박스)**: `selectable={true}`로 첫 컬럼에 체크박스 자동 추가.
    헤더 체크박스로 보이는 행 일괄 선택/해제 (indeterminate 지원).
  - **Imperative API (ref)**: `React.forwardRef` + `useImperativeHandle` 패턴으로
    외부 버튼에서 그리드 상태 조회/조작:
    - `getSavedData()` — 편집 반영, 삭제 제외한 현재 데이터 (저장 페이로드)
    - `getChangedData()` — 편집된 행만 (PATCH 페이로드)
    - `getDeletedData()` — 삭제된 행의 **원본** 스냅샷 (삭제 페이로드)
    - `getSelectedIds()` — 현재 선택된 행 ID
    - `deleteSelected()` / `clearSelection()` / `reset()`
  - **셀 렌더링**: text(기본) + 커스텀 함수 `(value, row) => ReactNode` 지원.
    콤마 포맷, Badge, 조건부 색상 등 임의 노드 가능. dropdown/date/icon 등
    built-in 렌더러는 후속 버전.

  # 디자인·격리
  - `@baneung-pack/ui`와 같은 `@layer baneung`에 모든 스타일 격리 — ui와 함께
    임포트해도 layer가 자연스럽게 머지된다.
  - 시맨틱 `<table>` 구조 유지 (가상화 시에도) + `role=region` +
    `aria-rowcount/colcount` + 헤더 체크박스 indeterminate state.
