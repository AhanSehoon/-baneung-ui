import { Heading, Lead, Separator } from '@baneung-pack/ui';

import { ExampleSection } from '@/components/example-section';
import { rowOperationsCode } from '@/lib/grid-demo-code';
import { RowOperationsDemo } from '@/lib/grid-demos';

export default function Page() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>행 추가 · 삭제 · 다중 셀 선택</Heading>
        <Lead>
          <code>cellSelection=&quot;multi&quot;</code>로 드래그 다중 선택 활성.{' '}
          <code>clearOnDelete</code>로 Delete 키에 셀 값 클리어 매핑. ref API의 <code>addRow</code>{' '}
          / <code>removeSelectedRows</code> / <code>clearSelectedCells</code>를 외부 버튼에서 호출.
        </Lead>
      </header>
      <Separator />
      <ExampleSection Example={RowOperationsDemo} code={rowOperationsCode} />
    </div>
  );
}
