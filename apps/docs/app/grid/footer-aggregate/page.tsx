import { Heading, Lead, Separator } from '@baneung-pack/ui';

import { ExampleSection } from '@/components/example-section';
import { FooterAggregateDemo } from '@/lib/grid-advanced-demos';
import { footerAggregateCode } from '@/lib/grid-demo-code';

export default function Page() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>합계 행 (집계 푸터)</Heading>
        <Lead>
          column.aggregate로 컬럼별 합계/평균/개수/최소/최대 또는 임의 함수를 푸터에 자동 표시.
          showFooter=true와 함께 사용하며, 필터·검색이 적용된 visible 행 기준으로 계산됩니다.
        </Lead>
      </header>
      <Separator />
      <ExampleSection Example={FooterAggregateDemo} code={footerAggregateCode} />
    </div>
  );
}
