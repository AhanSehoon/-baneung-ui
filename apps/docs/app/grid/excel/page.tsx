import { Heading, Lead, Separator } from '@baneung-pack/ui';

import { ExampleSection } from '@/components/example-section';
import { ExcelIntegrationDemo } from '@/lib/grid-advanced-demos';
import { excelCode } from '@/lib/grid-demo-code';

export default function Page() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>Excel 내보내기 + 클립보드</Heading>
        <Lead>
          exportXlsx ref API로 .xlsx 다운로드 (exceljs 동적 로드, 번들 미포함). clipboard 옵션을
          켜면 Ctrl+C/V로 Excel과 셀 범위를 호환되게 주고받을 수 있습니다 (TSV 직렬화).
        </Lead>
      </header>
      <Separator />
      <ExampleSection Example={ExcelIntegrationDemo} code={excelCode} />
    </div>
  );
}
