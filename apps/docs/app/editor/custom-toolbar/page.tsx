import { Heading, Lead, Separator } from '@baneung-pack/ui';

import { ExampleSection } from '@/components/example-section';
import { customToolbarCode } from '@/lib/editor-demo-code';
import { CustomToolbarDemo } from '@/lib/editor-demos';

export default function Page() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>커스텀 툴바</Heading>
        <Lead>
          <code>toolbar</code> prop에 필요한 버튼만 배열로 구성합니다. 2차원 배열로 그룹을 나누면
          그룹 사이에 구분선이 들어갑니다. <code>toolbar={'{false}'}</code>면 툴바를 숨깁니다.
        </Lead>
      </header>
      <Separator />
      <ExampleSection Example={CustomToolbarDemo} code={customToolbarCode} />
    </div>
  );
}
