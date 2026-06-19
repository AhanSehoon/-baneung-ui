import { Heading, Lead, Separator } from '@baneung-pack/ui';

import { ExampleSection } from '@/components/example-section';
import { ConditionalStyleDemo } from '@/lib/grid-advanced-demos';
import { conditionalStyleCode } from '@/lib/grid-demo-code';

export default function Page() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>조건부 셀 강조</Heading>
        <Lead>
          column.cellStyle (인라인 스타일) 또는 column.cellClassName (Tailwind 클래스)로 값/행에
          따라 셀을 강조합니다. Excel의 조건부 서식과 같은 패턴 — 음수 빨강, 임계값 강조 등.
        </Lead>
      </header>
      <Separator />
      <ExampleSection Example={ConditionalStyleDemo} code={conditionalStyleCode} />
    </div>
  );
}
