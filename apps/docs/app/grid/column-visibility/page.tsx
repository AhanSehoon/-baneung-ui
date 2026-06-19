import { Heading, Lead, Separator } from '@baneung-pack/ui';

import { ExampleSection } from '@/components/example-section';
import { ColumnVisibilityDemo } from '@/lib/grid-advanced-demos';
import { columnVisibilityCode } from '@/lib/grid-demo-code';

export default function Page() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>컬럼 표시 설정</Heading>
        <Lead>
          showColumnMenu=true 시 우상단 ⚙️ 버튼이 나오고 체크박스 popover로 컬럼 표시/숨김.
          column.hidden 또는 columnVisibility prop으로도 제어 가능합니다.
        </Lead>
      </header>
      <Separator />
      <ExampleSection Example={ColumnVisibilityDemo} code={columnVisibilityCode} />
    </div>
  );
}
