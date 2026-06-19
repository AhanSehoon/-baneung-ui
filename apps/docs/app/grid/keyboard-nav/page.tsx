import { Heading, Lead, Separator } from '@baneung-pack/ui';

import { ExampleSection } from '@/components/example-section';
import { keyboardNavCode } from '@/lib/grid-demo-code';
import { KeyboardNavDemo } from '@/lib/grid-phase3-demos';

export default function Page() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>키보드로 셀 이동</Heading>
        <Lead>
          cellSelection이 &apos;none&apos;이 아닐 때 자동 활성. 화살표 / Tab / Enter / Home·End /
          Ctrl+Home·End로 셀 이동. active 셀이 화면 안으로 자동 스크롤됩니다.
        </Lead>
      </header>
      <Separator />
      <ExampleSection Example={KeyboardNavDemo} code={keyboardNavCode} />
    </div>
  );
}
