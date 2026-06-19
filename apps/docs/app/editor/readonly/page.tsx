import { Heading, Lead, Separator } from '@baneung-pack/ui';

import { ExampleSection } from '@/components/example-section';
import { readOnlyCode } from '@/lib/editor-demo-code';
import { ReadOnlyDemo } from '@/lib/editor-demos';

export default function Page() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>읽기 전용</Heading>
        <Lead>
          <code>readOnly</code>로 저장된 HTML을 그대로 렌더합니다. 툴바는 비활성화되고 편집이
          불가합니다(뷰어 용도).
        </Lead>
      </header>
      <Separator />
      <ExampleSection Example={ReadOnlyDemo} code={readOnlyCode} />
    </div>
  );
}
