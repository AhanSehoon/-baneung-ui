import { Heading, Lead, Separator } from '@baneung-pack/ui';

import { ExampleSection } from '@/components/example-section';
import { basicCode } from '@/lib/grid-demo-code';
import { BasicDemo } from '@/lib/grid-demos';

export default function Page() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>기본 사용</Heading>
        <Lead>컬럼 정의와 데이터만 전달해서 그리드를 그립니다. 좌/중/우 align 지원.</Lead>
      </header>
      <Separator />
      <ExampleSection Example={BasicDemo} code={basicCode} />
    </div>
  );
}
