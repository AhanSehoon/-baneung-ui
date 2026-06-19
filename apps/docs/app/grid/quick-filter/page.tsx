import { Heading, Lead, Separator } from '@baneung-pack/ui';

import { ExampleSection } from '@/components/example-section';
import { QuickFilterDemo } from '@/lib/grid-advanced-demos';
import { quickFilterCode } from '@/lib/grid-demo-code';

export default function Page() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>빠른 검색</Heading>
        <Lead>
          모든 visible 컬럼에 대해 부분 일치(case-insensitive) 검색. 외부 input과 연결해 그리드에
          quickFilter prop으로 전달합니다.
        </Lead>
      </header>
      <Separator />
      <ExampleSection Example={QuickFilterDemo} code={quickFilterCode} />
    </div>
  );
}
