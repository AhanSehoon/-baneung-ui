import { Heading, Lead, Separator } from '@baneung-pack/ui';

import { ExampleSection } from '@/components/example-section';
import {
  ColumnReorderDemo,
  ContextMenuDemo,
  FullFeatureAdminDemo,
  KeyboardNavDemo,
  ViewPersistenceDemo,
} from '@/lib/grid-phase3-demos';

export default function Page() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>Phase 3 — 키보드 · 컨텍스트 메뉴 · 순서 · 영속화</Heading>
        <Lead>
          관리자 화면의 마지막 마무리. 화살표 키 셀 이동, 우클릭 메뉴, 헤더 드래그로 순서 변경,
          localStorage 자동 저장.
        </Lead>
      </header>
      <Separator />

      <section className="flex flex-col gap-3">
        <Heading level={2}>키보드 네비게이션</Heading>
        <Lead>↑↓←→/Tab/Enter/Home/End/Ctrl+Home/End로 셀 이동.</Lead>
        <ExampleSection Example={KeyboardNavDemo} />
      </section>

      <section className="flex flex-col gap-3">
        <Heading level={2}>컨텍스트 메뉴 (우클릭)</Heading>
        <Lead>boolean=true로 기본 메뉴, 함수로 셀별 커스텀 항목.</Lead>
        <ExampleSection Example={ContextMenuDemo} />
      </section>

      <section className="flex flex-col gap-3">
        <Heading level={2}>컬럼 순서 변경 (drag&drop)</Heading>
        <Lead>헤더 드래그로 순서 변경. pin 그룹 내부에서만 이동 (경계 유지).</Lead>
        <ExampleSection Example={ColumnReorderDemo} />
      </section>

      <section className="flex flex-col gap-3">
        <Heading level={2}>View 영속화 (localStorage)</Heading>
        <Lead>viewKey 한 줄로 정렬·폭·표시·순서가 모두 자동 저장. 재방문 시 복원.</Lead>
        <ExampleSection Example={ViewPersistenceDemo} />
      </section>

      <section className="flex flex-col gap-3">
        <Heading level={2}>Phase 1·2·3 통합 — 관리자 화면</Heading>
        <Lead>모든 기능 활성화. 실제 관리자 그리드 시나리오.</Lead>
        <ExampleSection Example={FullFeatureAdminDemo} />
      </section>
    </div>
  );
}
