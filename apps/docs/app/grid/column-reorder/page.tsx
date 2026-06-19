import { Heading, Lead, Separator } from '@baneung-pack/ui';

import { ExampleSection } from '@/components/example-section';
import { columnReorderCode } from '@/lib/grid-demo-code';
import { ColumnReorderDemo } from '@/lib/grid-phase3-demos';

export default function Page() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>컬럼 순서 변경</Heading>
        <Lead>
          reorderable=true면 헤더를 드래그&드롭으로 순서 변경. 같은 pin 그룹 안에서만 이동되어 pin
          경계는 유지됩니다. onColumnReorder 콜백으로 새 순서를 받아 localStorage에 저장 가능.
        </Lead>
      </header>
      <Separator />
      <ExampleSection Example={ColumnReorderDemo} code={columnReorderCode} />
    </div>
  );
}
