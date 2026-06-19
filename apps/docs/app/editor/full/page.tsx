import { Heading, Lead, Separator } from '@baneung-pack/ui';

import { ExampleSection } from '@/components/example-section';
import { fullCode } from '@/lib/editor-demo-code';
import { FullFeatureDemo } from '@/lib/editor-demos';

export default function Page() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>전체 기능 · ref API</Heading>
        <Lead>
          모든 툴바 기능과 <code>maxHeight</code> 스크롤, 그리고 <code>ref</code>의 명령형 API (
          <code>getHTML</code>·<code>insertHTML</code>·<code>focus</code>)를 함께 사용하는
          예제입니다. 전체 화면(⤢)·HTML 소스(&lt;/&gt;) 토글도 확인해 보세요.
        </Lead>
      </header>
      <Separator />
      <ExampleSection Example={FullFeatureDemo} code={fullCode} />
    </div>
  );
}
