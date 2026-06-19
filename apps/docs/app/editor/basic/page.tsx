import { Heading, Lead, Separator } from '@baneung-pack/ui';

import { ExampleSection } from '@/components/example-section';
import { basicCode } from '@/lib/editor-demo-code';
import { BasicDemo } from '@/lib/editor-demos';

export default function Page() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>기본 사용</Heading>
        <Lead>
          <code>defaultValue</code>로 초기 HTML만 주면 전체 툴바를 갖춘 WYSIWYG 에디터가
          동작합니다(비제어).
        </Lead>
      </header>
      <Separator />
      <ExampleSection Example={BasicDemo} code={basicCode} />
    </div>
  );
}
