'use client';

import * as React from 'react';

import { Grid, type GridColumn, type GridHandle } from '@baneung-pack/grid';
import { Badge, Button, Muted } from '@baneung-pack/ui';

/**
 * Phase 3 기능 데모 — 키보드 네비게이션 · 컨텍스트 메뉴 · 컬럼 순서 변경 · view 영속화.
 */

interface Task {
  id: number;
  title: string;
  assignee: string;
  priority: '낮음' | '보통' | '높음' | '긴급';
  progress: number;
  due: string;
}

const sampleTasks: Task[] = [
  {
    id: 101,
    title: '디자인 시스템 토큰 정리',
    assignee: '김민수',
    priority: '높음',
    progress: 80,
    due: '2026-07-01',
  },
  {
    id: 102,
    title: '그리드 컴포넌트 리팩토링',
    assignee: '이지은',
    priority: '긴급',
    progress: 60,
    due: '2026-06-25',
  },
  {
    id: 103,
    title: '문서 사이트 i18n 적용',
    assignee: '박철호',
    priority: '보통',
    progress: 30,
    due: '2026-07-15',
  },
  {
    id: 104,
    title: 'E2E 테스트 추가',
    assignee: '최영희',
    priority: '낮음',
    progress: 10,
    due: '2026-08-01',
  },
  {
    id: 105,
    title: '성능 측정 대시보드',
    assignee: '정민재',
    priority: '높음',
    progress: 50,
    due: '2026-07-10',
  },
  {
    id: 106,
    title: 'CI 파이프라인 개선',
    assignee: '강수연',
    priority: '보통',
    progress: 75,
    due: '2026-07-05',
  },
];

const priorityVariant: Record<Task['priority'], 'secondary' | 'outline' | 'danger'> = {
  낮음: 'outline',
  보통: 'outline',
  높음: 'secondary',
  긴급: 'danger',
};

const taskColumns: GridColumn<Task>[] = [
  { id: 'id', header: 'ID', accessor: 'id', width: 60, align: 'right' },
  { id: 'title', header: '제목', accessor: 'title' },
  { id: 'assignee', header: '담당자', accessor: 'assignee', width: 100 },
  {
    id: 'priority',
    header: '우선순위',
    accessor: 'priority',
    width: 100,
    renderer: (v) => (
      <Badge variant={priorityVariant[v as Task['priority']]}>{v as React.ReactNode}</Badge>
    ),
  },
  { id: 'progress', header: '진행률', accessor: 'progress', width: 140, renderer: 'progress' },
  { id: 'due', header: '마감일', accessor: 'due', width: 110 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Demo: 키보드 네비게이션
// ─────────────────────────────────────────────────────────────────────────────

export function KeyboardNavDemo() {
  return (
    <div className="flex flex-col gap-3">
      <Muted className="text-xs">
        💡 셀 클릭으로 시작 → <strong>↑↓←→</strong> 셀 이동 · <strong>Tab/Enter</strong> 다음 셀/행
        · <strong>Home/End</strong> 행 처음/끝 · <strong>Ctrl+Home/End</strong> 그리드 처음/끝
      </Muted>
      <Grid
        columns={taskColumns}
        data={sampleTasks}
        getRowId={(r) => r.id}
        cellSelection="single"
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Demo: 컨텍스트 메뉴 (우클릭)
// ─────────────────────────────────────────────────────────────────────────────

export function ContextMenuDemo() {
  const [log, setLog] = React.useState<string[]>([]);
  return (
    <div className="flex flex-col gap-3">
      <Muted className="text-xs">
        💡 셀에서 <strong>우클릭</strong> → 기본 메뉴 (복사 · 붙여넣기 · 셀 클리어 · 행 삭제 ·
        내보내기). 함수형 prop으로 행별 커스텀 가능.
      </Muted>
      <Grid
        columns={taskColumns}
        data={sampleTasks}
        getRowId={(r) => r.id}
        cellSelection="multi"
        clipboard
        clearOnDelete
        selectable
        contextMenu={(ctx) => [
          {
            id: 'detail',
            label: `상세보기 (ID ${ctx.rowId})`,
            onClick: () => setLog((l) => [`상세보기: ${ctx.rowId}`, ...l].slice(0, 5)),
          },
          { separator: true },
          {
            id: 'copy',
            label: '복사',
            shortcut: 'Ctrl+C',
            onClick: () => setLog((l) => ['복사 액션 트리거됨', ...l].slice(0, 5)),
          },
          {
            id: 'delete',
            label: '이 행 삭제',
            onClick: () => setLog((l) => [`삭제 요청: ${ctx.rowId}`, ...l].slice(0, 5)),
          },
        ]}
      />
      {log.length > 0 && (
        <div className="border border-border-default bg-surface px-3 py-2 text-xs">
          <strong>액션 로그:</strong>
          <ul className="mt-1 list-disc pl-4">
            {log.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Demo: 컬럼 순서 변경 (drag&drop)
// ─────────────────────────────────────────────────────────────────────────────

export function ColumnReorderDemo() {
  const [order, setOrder] = React.useState<string[]>([]);
  return (
    <div className="flex flex-col gap-3">
      <Muted className="text-xs">
        💡 헤더를 드래그해서 컬럼 순서 변경. (pin 그룹 안에서만 이동)
      </Muted>
      <Grid
        columns={taskColumns}
        data={sampleTasks}
        getRowId={(r) => r.id}
        reorderable
        onColumnReorder={setOrder}
      />
      {order.length > 0 && (
        <Muted className="text-xs">
          현재 순서: <code>{order.join(' → ')}</code>
        </Muted>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Demo: View 영속화 (viewKey + localStorage)
// ─────────────────────────────────────────────────────────────────────────────

export function ViewPersistenceDemo() {
  const ref = React.useRef<GridHandle<Task>>(null);
  return (
    <div className="flex flex-col gap-3">
      <Muted className="text-xs">
        💡 정렬·컬럼 폭·표시·순서가 <code>localStorage</code>에 자동 저장됩니다. 페이지를 떠났다
        다시 와도 마지막 설정이 유지됩니다.
      </Muted>
      <div className="flex flex-wrap items-center gap-2 border border-border-default bg-surface px-3 py-2">
        <Muted className="text-xs">설정 영속화 — viewKey=&quot;tasks-view&quot;</Muted>
        <div className="grow" />
        <Button size="sm" variant="outline" onClick={() => ref.current?.clearView()}>
          초기화 (clearView)
        </Button>
      </div>
      <Grid
        ref={ref}
        columns={taskColumns}
        data={sampleTasks}
        getRowId={(r) => r.id}
        viewKey="tasks-view"
        resizable
        reorderable
        showColumnMenu
        cellSelection="single"
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Demo: 모든 기능 통합 (Phase 1+2+3)
// ─────────────────────────────────────────────────────────────────────────────

const adminCols: GridColumn<Task>[] = [
  {
    id: 'id',
    header: 'ID',
    accessor: 'id',
    width: 60,
    align: 'right',
    pin: 'left',
    sortable: true,
    aggregate: 'count',
  },
  {
    id: 'title',
    header: '제목',
    accessor: 'title',
    sortable: true,
    filterable: true,
    editable: true,
  },
  {
    id: 'assignee',
    header: '담당자',
    accessor: 'assignee',
    width: 100,
    sortable: true,
    filterable: true,
    editable: true,
  },
  {
    id: 'priority',
    header: '우선순위',
    accessor: 'priority',
    width: 100,
    sortable: true,
    filterable: true,
    cellClassName: (v) => (v === '긴급' ? 'text-danger font-medium' : undefined),
    renderer: (v) => (
      <Badge variant={priorityVariant[v as Task['priority']]}>{v as React.ReactNode}</Badge>
    ),
  },
  {
    id: 'progress',
    header: '진행률',
    accessor: 'progress',
    width: 140,
    renderer: 'progress',
    editable: true,
    editor: 'number',
    aggregate: 'avg',
  },
  { id: 'due', header: '마감일', accessor: 'due', width: 110, pin: 'right', sortable: true },
];

export function FullFeatureAdminDemo() {
  const ref = React.useRef<GridHandle<Task>>(null);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2 border border-border-default bg-surface px-3 py-2">
        <Muted className="text-xs">Phase 1·2·3 통합 — 모든 기능 활성</Muted>
        <div className="grow" />
        <Button
          size="sm"
          variant="outline"
          onClick={() => ref.current?.exportXlsx({ filename: 'tasks.xlsx' })}
        >
          XLSX
        </Button>
        <Button size="sm" variant="ghost" onClick={() => ref.current?.clearView()}>
          뷰 리셋
        </Button>
      </div>
      <Muted className="text-xs">
        💡 우클릭 = 컨텍스트 메뉴 · 헤더 드래그 = 순서 변경 · 헤더 우측 = 폭 조절 · ⚙ = 컬럼 표시 ·
        화살표 = 셀 이동 · Ctrl+C/V = Excel 클립보드. 모든 설정 localStorage 자동 저장.
      </Muted>
      <Grid
        ref={ref}
        columns={adminCols}
        data={sampleTasks}
        getRowId={(r) => r.id}
        viewKey="phase3-admin"
        resizable
        reorderable
        showColumnMenu
        showFooter
        cellSelection="multi"
        clipboard
        clearOnDelete
        contextMenu
        selectable
      />
    </div>
  );
}
