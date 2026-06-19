import { Heading, Lead, Separator } from '@baneung-pack/ui';

import { ExampleSection } from '@/components/example-section';
import { PinnedColumnsDemo } from '@/lib/grid-advanced-demos';
import { columnPinCode } from '@/lib/grid-demo-code';

export default function Page() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>컬럼 고정 (좌/우)</Heading>
        <Lead>
          column.pin: &apos;left&apos; | &apos;right&apos; 로 컬럼을 좌/우에 고정. 가로 스크롤해도
          자리를 유지합니다. 보통 좌측은 ID/이름, 우측은 상태/액션 컬럼에 사용.
        </Lead>
      </header>
      <Separator />
      <ExampleSection Example={PinnedColumnsDemo} code={columnPinCode} />
    </div>
  );
}
