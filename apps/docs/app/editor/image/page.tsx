import { Heading, Lead, Separator } from '@baneung-pack/ui';

import { ExampleSection } from '@/components/example-section';
import { imageCode } from '@/lib/editor-demo-code';
import { ImageDemo } from '@/lib/editor-demos';

export default function Page() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>이미지 · 붙여넣기 · 드래그앤드롭</Heading>
        <Lead>
          클립보드 붙여넣기(Ctrl+V), 드래그앤드롭, 파일 선택을 모두 지원합니다. 기본은 base64 인라인
          삽입이며, <code>onImageUpload</code>로 서버 업로드를 연동할 수 있습니다. 삽입된 이미지는
          영역 폭에 맞춰 자동 축소됩니다(반응형).
        </Lead>
      </header>
      <Separator />
      <ExampleSection Example={ImageDemo} code={imageCode} />
    </div>
  );
}
