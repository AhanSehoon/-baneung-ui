import { Heading, Lead, Separator } from '@baneung-pack/ui';

import { ExampleSection } from '@/components/example-section';
import { MultiSortResizeDemo } from '@/lib/grid-advanced-demos';
import { multiSortResizeCode } from '@/lib/grid-demo-code';

export default function Page() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>다중 정렬 + 컬럼 폭 조절</Heading>
        <Lead>
          헤더 클릭으로 단일 정렬, Shift+클릭으로 2차/3차 정렬 추가. 헤더 우측 경계 드래그로 컬럼
          폭을 조절합니다. onColumnResize 콜백으로 localStorage 등에 영속화 가능.
        </Lead>
      </header>
      <Separator />
      <ExampleSection Example={MultiSortResizeDemo} code={multiSortResizeCode} />
    </div>
  );
}
