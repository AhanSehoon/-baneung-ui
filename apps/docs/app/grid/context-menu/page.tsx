import { Heading, Lead, Separator } from '@baneung-pack/ui';

import { ExampleSection } from '@/components/example-section';
import { contextMenuCode } from '@/lib/grid-demo-code';
import { ContextMenuDemo } from '@/lib/grid-phase3-demos';

export default function Page() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>우클릭 메뉴</Heading>
        <Lead>
          contextMenu=true면 기본 메뉴 (복사·붙여넣기·셀 클리어·행 삭제·CSV/Excel). 함수로 넘기면
          셀별로 동적 메뉴 항목을 생성할 수 있습니다 — 단축키 힌트·disabled·separator 지원.
        </Lead>
      </header>
      <Separator />
      <ExampleSection Example={ContextMenuDemo} code={contextMenuCode} />
    </div>
  );
}
