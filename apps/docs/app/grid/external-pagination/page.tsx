import { Heading, Lead, Separator } from '@baneung-pack/ui';

import { ExampleSection } from '@/components/example-section';
import { externalPaginationCode } from '@/lib/grid-demo-code';
import { ExternalPaginationDemo } from '@/lib/grid-demos';

export default function Page() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>외부 페이지네이션</Heading>
        <Lead>
          <code>showPagination=false</code> + <code>page</code>/<code>onPageChange</code>로
          controlled. 디자인 시스템의 Pagination이나 커스텀 컨트롤과 통합.
        </Lead>
      </header>
      <Separator />
      <ExampleSection Example={ExternalPaginationDemo} code={externalPaginationCode} />
    </div>
  );
}
