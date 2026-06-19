import { Heading, Lead, Separator } from '@baneung-pack/ui';

import { ExampleSection } from '@/components/example-section';
import { controlledCode } from '@/lib/editor-demo-code';
import { ControlledDemo } from '@/lib/editor-demos';

export default function Page() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>제어 컴포넌트 · HTML 출력</Heading>
        <Lead>
          <code>value</code>+<code>onChange</code>로 상태를 직접 관리합니다. 입력에 따라 HTML이
          실시간으로 갱신됩니다.
        </Lead>
      </header>
      <Separator />
      <ExampleSection Example={ControlledDemo} code={controlledCode} />
    </div>
  );
}
