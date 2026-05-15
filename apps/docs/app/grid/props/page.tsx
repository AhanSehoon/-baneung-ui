import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Heading,
  Lead,
  Muted,
  Separator,
} from '@baneung-pack/ui';

type Row = [prop: string, type: string, defaultValue: string, desc: string];

const gridProps: Row[] = [
  ['columns', 'GridColumn<TRow>[]', '필수', '컬럼 정의 배열'],
  ['data', 'TRow[]', '필수', '행 데이터 배열'],
  ['virtualized', 'boolean', 'false', '가상화 활성. 1000+ 행 권장'],
  ['rowHeight', 'number', '36', '가상화 모드에서 행 높이(px)'],
  ['height', 'number | string', '400', '컨테이너 높이'],
  ['pageSize', 'number', '0', '> 0 이면 페이지네이션 활성'],
  ['showPagination', 'boolean', 'true', '내장 페이지네이션 UI 표시. 외부 페이징 사용 시 false'],
  ['page', 'number', '-', 'controlled 페이지 (1-based)'],
  ['onPageChange', '(page: number) => void', '-', 'controlled 모드 콜백'],
  ['emptyState', 'ReactNode', '-', '데이터 없을 때 표시'],
  [
    'getRowId',
    '(row, idx) => string | number',
    '-',
    '행 키 추출. 편집/선택/트리 사용 시 필수 권장',
  ],
  ['selectable', 'boolean', 'false', '첫 컬럼에 체크박스 자동 추가'],
  ['onRowChange', '(row, id) => void', '-', '편집 commit 시 콜백 (자동 저장·로깅 용도)'],
  ['tree', 'boolean', 'false', 'Tree(계층) 모드 활성'],
  ['getChildren', '(row) => TRow[] | undefined', '-', 'tree=true 시 자식 추출 함수 (필수)'],
  ['defaultExpandedIds', "'all' | 'none' | (string | number)[]", "'none'", '초기 펼침 상태'],
  ['cellSelection', "'none' | 'single' | 'multi'", "'single'", '셀 선택 모드'],
  ['clearOnDelete', 'boolean', 'false', 'Delete/Backspace 키로 선택 셀 값 클리어'],
  ['ref', 'Ref<GridHandle<TRow>>', '-', 'imperative API 접근'],
];

const columnFields: Row[] = [
  ['id', 'string', '필수', '컬럼 고유 식별자'],
  ['header', 'ReactNode', '필수', '헤더 표시 노드'],
  ['accessor', 'keyof TRow | (row) => unknown', '필수', '행에서 값 추출 (key 또는 함수)'],
  ['width', 'number | string', '-', '셀 너비 (px 또는 CSS)'],
  ['align', "'left' | 'center' | 'right'", "'left'", '컬럼 정렬'],
  [
    'renderer',
    "'text' | 'progress' | 'date' | (value, row) => ReactNode",
    "'text'",
    '셀 렌더링 방식',
  ],
  ['editable', 'boolean', 'false', '더블클릭 인라인 편집 활성 (accessor가 string key만)'],
  ['editor', "'text' | 'number' | 'date' | 'dropdown'", "'text'", '편집 모드 input 종류'],
  ['options', '{ value, label }[]', '-', "editor='dropdown' 또는 renderer='dropdown' 시 선택지"],
  ['min', 'number', '0', "renderer='progress'의 최소값"],
  ['max', 'number', '100', "renderer='progress'의 최대값"],
  [
    'dateFormat',
    'string',
    "'YYYY-MM-DD'",
    "renderer='date'의 출력 포맷 (YYYY/MM/DD/HH/mm/ss 토큰)",
  ],
  ['sortable', 'boolean', 'false', '헤더 클릭으로 3-state 정렬 (↕ → ▲ → ▼ → 해제)'],
  ['filterable', 'boolean', 'false', '헤더에 funnel 버튼 + popover로 다중 선택 필터'],
];

const handleMethods: [method: string, ret: string, desc: string][] = [
  ['getSavedData()', 'TRow[]', '편집 반영, 삭제 제외한 현재 데이터 (저장 페이로드)'],
  ['getChangedData()', 'TRow[]', '편집된 행만 (PATCH 페이로드)'],
  ['getDeletedData()', 'TRow[]', '삭제된 행의 원본 스냅샷'],
  ['getSelectedIds()', '(string | number)[]', '체크박스로 선택된 행 ID 배열'],
  ['deleteSelected()', 'void', '체크박스 선택된 행을 모두 삭제 bucket으로'],
  ['clearSelection()', 'void', '체크박스 선택 해제'],
  ['reset()', 'void', '편집·삭제·추가 내역 폐기, 원본 data로 복원'],
  ['addRow(row, position)', 'void', "행 추가: 'first' | 'last' | 'above-active' | 'below-active'"],
  ['removeSelectedRows()', 'void', '셀 선택(active 또는 multi)된 행을 모두 삭제 bucket으로'],
  ['clearSelectedCells()', 'void', '셀 선택된 셀의 값을 빈 문자열로 (string key accessor만)'],
  [
    'exportCsv(filename?, options?)',
    'void',
    'CSV 다운로드. UTF-8 BOM + Excel 호환. options.rows로 특정 행만 export 가능',
  ],
];

function PropsTable({ rows }: { rows: Row[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border-default">
            <th className="px-3 py-2 text-left font-medium">Prop / 필드</th>
            <th className="px-3 py-2 text-left font-medium">타입</th>
            <th className="px-3 py-2 text-left font-medium">기본값</th>
            <th className="px-3 py-2 text-left font-medium">설명</th>
          </tr>
        </thead>
        <tbody className="text-foreground-muted">
          {rows.map(([prop, type, def, desc]) => (
            <tr key={prop} className="border-b border-border-subtle align-top last:border-b-0">
              <td className="px-3 py-2 font-mono text-foreground">{prop}</td>
              <td className="px-3 py-2 font-mono">{type}</td>
              <td className="px-3 py-2 font-mono">{def}</td>
              <td className="px-3 py-2">{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function GridPropsPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>Grid · Props</Heading>
        <Lead>
          <code>@baneung-pack/grid</code> v0.7.0 기준 전체 props와 GridColumn 필드, GridHandle ref
          API 레퍼런스.
        </Lead>
      </header>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>GridProps</CardTitle>
        </CardHeader>
        <CardContent>
          <PropsTable rows={gridProps} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>GridColumn 필드</CardTitle>
        </CardHeader>
        <CardContent>
          <PropsTable rows={columnFields} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>GridHandle (ref API)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border-default">
                  <th className="px-3 py-2 text-left font-medium">메서드</th>
                  <th className="px-3 py-2 text-left font-medium">반환</th>
                  <th className="px-3 py-2 text-left font-medium">설명</th>
                </tr>
              </thead>
              <tbody className="text-foreground-muted">
                {handleMethods.map(([m, r, d]) => (
                  <tr key={m} className="border-b border-border-subtle align-top last:border-b-0">
                    <td className="px-3 py-2 font-mono text-foreground">{m}</td>
                    <td className="px-3 py-2 font-mono">{r}</td>
                    <td className="px-3 py-2">{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Muted className="text-xs">
        💡 <code>cellSelection</code> (
        <code>&apos;none&apos; | &apos;single&apos; | &apos;multi&apos;</code>)과{' '}
        <code>selectable</code>은 별개 축입니다. cellSelection은 그리드 셀의 시각 선택, selectable은
        체크박스 기반 행 선택.
      </Muted>
    </div>
  );
}
