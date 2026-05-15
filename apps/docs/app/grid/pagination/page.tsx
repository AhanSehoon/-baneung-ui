import { Heading, Lead, Separator } from '@baneung-pack/ui';

import { ExampleSection } from '@/components/example-section';
import { paginationCode } from '@/lib/grid-demo-code';
import { PaginationDemo } from '@/lib/grid-demos';

export default function Page() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>내장 페이지네이션</Heading>
        <Lead>
          <code>pageSize</code>만 설정하면 자동으로 내장 페이지네이션 활성. 250행 → 25페이지.
          ellipsis 압축 페이지 번호.
        </Lead>
      </header>
      <Separator />
      <ExampleSection Example={PaginationDemo} code={paginationCode} />
    </div>
  );
}
