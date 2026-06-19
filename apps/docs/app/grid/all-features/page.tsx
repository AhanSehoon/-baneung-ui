import { Heading, Lead, Separator } from '@baneung-pack/ui';

import { ExampleSection } from '@/components/example-section';
import { allFeaturesCode } from '@/lib/grid-demo-code';
import { FullFeatureAdminDemo } from '@/lib/grid-phase3-demos';

export default function Page() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>관리자 화면 통합 예제</Heading>
        <Lead>
          빠른 검색 · 다중 정렬 · 컬럼 폭 조절 · 표시 설정 · 순서 변경 · 컬럼 고정 · 합계 행 · 편집
          · 다중 셀 선택 · 클립보드 · 우클릭 메뉴 · 설정 자동 저장. 실제 관리자 그리드 시나리오에
          활용 가능한 형태입니다.
        </Lead>
      </header>
      <Separator />
      <ExampleSection Example={FullFeatureAdminDemo} code={allFeaturesCode} />
    </div>
  );
}
