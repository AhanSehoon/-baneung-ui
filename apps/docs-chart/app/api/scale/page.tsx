import { Heading, Lead, Separator } from '@baneung-pack/ui';

import { ApiTable } from '@/components/api-table';
import { CodeBlock } from '@/components/code-block';

export default function ScalePage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>Scale 함수</Heading>
        <Lead>데이터를 Three.js 좌표/크기로 변환하는 순수 유틸리티. server 안전.</Lead>
      </header>

      <Separator />

      <section className="flex flex-col gap-3">
        <Heading level={2} className="text-2xl">
          scaleHeight
        </Heading>
        <p className="text-sm text-foreground-muted">
          데이터 배열에서 최댓값을 maxHeight로 매핑하는 d3-scale linear scale을 생성합니다. 직접
          나누지 않고 d3-scale을 쓰는 이유는 nice()/clamp() 같은 보정과 log/pow 전환 등 확장성을
          얻기 위해서입니다.
        </p>
        <CodeBlock
          language="ts"
          code={`import { scaleHeight } from '@baneung-pack/chart';

const scale = scaleHeight([
  { label: 'a', value: 100 },
  { label: 'b', value: 50 },
]);

scale(100); // → 5  (기본 maxHeight)
scale(50);  // → 2.5
scale(0);   // → 0`}
        />
        <ApiTable
          rows={[
            {
              property: 'data',
              type: 'BarChartDatum[]',
              description: '데이터 배열. 빈 배열도 안전 (max=1 fallback)',
            },
            {
              property: 'options.maxHeight',
              type: 'number',
              default: '5',
              description: '가장 큰 값에 대응할 막대 높이',
            },
          ]}
        />
      </section>

      <Separator />

      <section className="flex flex-col gap-3">
        <Heading level={2} className="text-2xl">
          computeBarXPositions
        </Heading>
        <p className="text-sm text-foreground-muted">
          N개의 막대를 X축에서 균등 배치할 때 각 막대의 X 좌표를 계산. 그룹 중앙이 원점이 되도록
          정렬되어 막대 개수가 바뀌어도 카메라 시점이 유지됩니다.
        </p>
        <CodeBlock
          language="ts"
          code={`import { computeBarXPositions } from '@baneung-pack/chart';

computeBarXPositions(3, 1, 0.5);
// → [-1.5, 0, 1.5]
// (3개 막대, 가로 1, 간격 0.5 → 중앙 막대 정확히 원점)`}
        />
        <ApiTable
          rows={[
            { property: 'count', type: 'number', description: '막대 개수' },
            { property: 'barWidth', type: 'number', description: '막대 가로 크기' },
            { property: 'gap', type: 'number', description: '막대 간 간격' },
          ]}
        />
      </section>
    </div>
  );
}
