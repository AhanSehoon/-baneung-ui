import { Heading, Lead, Separator } from '@baneung-pack/ui';

import { ExampleSection } from '@/components/example-section';
import { treeCode } from '@/lib/grid-demo-code';
import { TreeDemo } from '@/lib/grid-demos';

export default function Page() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>Tree (계층) 모드</Heading>
        <Lead>
          <code>tree</code> + <code>getChildren</code>으로 중첩 데이터를 계층 표시. caret(▶/▼)으로
          펼침/접힘. <code>defaultExpandedIds</code>로 초기 상태 제어 (<code>&apos;all&apos;</code>{' '}
          / <code>&apos;none&apos;</code> / 명시 id 배열).
        </Lead>
      </header>
      <Separator />
      <ExampleSection Example={TreeDemo} code={treeCode} />
    </div>
  );
}
