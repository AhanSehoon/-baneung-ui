import { Heading, Lead, Separator } from '@baneung-pack/ui';

import { ExampleSection } from '@/components/example-section';
import { saveViewCode } from '@/lib/grid-demo-code';
import { ViewPersistenceDemo } from '@/lib/grid-phase3-demos';

export default function Page() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>설정 자동 저장</Heading>
        <Lead>
          viewKey만 지정하면 정렬·컬럼 폭·표시 여부·순서가 브라우저 localStorage에 자동 저장됩니다.
          페이지를 떠났다 다시 와도 마지막 설정이 그대로 복원됩니다. ref API의 clearView()로 초기화.
        </Lead>
      </header>
      <Separator />
      <ExampleSection Example={ViewPersistenceDemo} code={saveViewCode} />
    </div>
  );
}
