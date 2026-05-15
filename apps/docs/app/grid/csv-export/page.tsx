import { Heading, Lead, Separator } from '@baneung-pack/ui';

import { ExampleSection } from '@/components/example-section';
import { csvExportCode } from '@/lib/grid-demo-code';
import { CsvExportDemo } from '@/lib/grid-demos';

export default function Page() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>CSV 다운로드</Heading>
        <Lead>
          ref API의 <code>exportCsv(filename?, options?)</code>로 현재 그리드 데이터를 CSV로
          다운로드. UTF-8 BOM 포함 → Excel에서 한글 깨짐 없음. <code>options.rows</code>로 명시한
          행만 export 가능 (변경분만 / 선택분만 등).
        </Lead>
      </header>
      <Separator />
      <ExampleSection Example={CsvExportDemo} code={csvExportCode} />
    </div>
  );
}
