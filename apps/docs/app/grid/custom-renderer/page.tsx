import { Heading, Lead, Separator } from '@baneung-pack/ui';

import { ExampleSection } from '@/components/example-section';
import { customRendererCode } from '@/lib/grid-demo-code';
import { CustomRendererDemo } from '@/lib/grid-demos';

export default function Page() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>커스텀 렌더러</Heading>
        <Lead>
          <code>renderer</code> 함수로 임의의 React 노드 반환. 콤마 포맷, Badge, 조건부 색상 등.
        </Lead>
      </header>
      <Separator />
      <ExampleSection Example={CustomRendererDemo} code={customRendererCode} />
    </div>
  );
}
