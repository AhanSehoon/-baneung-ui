import { Heading, Lead, Separator } from '@baneung-pack/ui';

import { ExampleSection } from '@/components/example-section';
import { editorsSortFilterCode } from '@/lib/grid-demo-code';
import { EditorTypesDemo } from '@/lib/grid-demos';

export default function Page() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>빌트인 에디터 · 정렬 · 필터</Heading>
        <Lead>
          셀 더블클릭으로 편집기(dropdown / date / number) 진입. 헤더 클릭으로 정렬 (↕ → ▲ asc → ▼
          desc → 해제, 3-state). Charge 컬럼 헤더의 funnel 버튼으로 필터 popover — 체크박스 다중
          선택. <code>sortable</code> / <code>filterable</code> 컬럼 prop으로 활성.
        </Lead>
      </header>
      <Separator />
      <ExampleSection Example={EditorTypesDemo} code={editorsSortFilterCode} />
    </div>
  );
}
