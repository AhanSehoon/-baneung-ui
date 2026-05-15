import { Heading, Lead, Separator } from '@baneung-pack/ui';

import { ExampleSection } from '@/components/example-section';
import { editingCode } from '@/lib/grid-demo-code';
import { EditableSelectableDemo } from '@/lib/grid-demos';

export default function Page() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>인라인 편집 · 선택 · 외부 제어 (ref API)</Heading>
        <Lead>
          셀 더블클릭으로 편집, 체크박스로 행 선택, 외부 버튼은 <code>useRef</code> +{' '}
          <code>useImperativeHandle</code> 패턴으로 그리드 내부 상태(saved / changed / deleted)
          조회/조작.
        </Lead>
      </header>
      <Separator />
      <ExampleSection Example={EditableSelectableDemo} code={editingCode} />
    </div>
  );
}
