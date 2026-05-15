import { Badge, Heading, Lead, Separator } from '@baneung-pack/ui';

import { ExampleSection } from '@/components/example-section';
import { virtualizedCode } from '@/lib/grid-demo-code';
import { VirtualizedDemo } from '@/lib/grid-demos';

export default function Page() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Heading level={1}>가상화 모드</Heading>
          <Lead>
            <code>virtualized</code> 한 줄. 5000행 데이터 — DOM 노드 수는 약 20개 내외 유지.
            <code>@tanstack/react-virtual</code> 기반. 시맨틱 <code>{'<table>'}</code> 구조 유지.
          </Lead>
        </div>
        <Badge variant="outline">5,000 rows</Badge>
      </header>
      <Separator />
      <ExampleSection Example={VirtualizedDemo} code={virtualizedCode} />
    </div>
  );
}
