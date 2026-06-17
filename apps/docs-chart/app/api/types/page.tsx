import { Heading, Lead, Separator } from '@baneung-pack/ui';

import { ApiTable } from '@/components/api-table';
import { CodeBlock } from '@/components/code-block';

export default function TypesPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>Types</Heading>
        <Lead>`@baneung-pack/chart`가 export하는 공통 데이터 타입.</Lead>
      </header>

      <Separator />

      <section className="flex flex-col gap-3">
        <Heading level={2} className="text-2xl">
          BarChartDatum
        </Heading>
        <p className="text-sm text-foreground-muted">
          단일 막대 한 개를 표현하는 데이터. 후속 차트(City/Timeline/Map)도 기본적으로 같은 형태를
          공유하며 필요한 필드를 `meta`에 담아 확장합니다.
        </p>
        <CodeBlock
          language="ts"
          code={`export interface BarChartDatum {
  /** X축 라벨이자 mesh의 key. 고유해야 함. */
  label: string;
  /** 데이터 값. 막대 높이로 변환. 음수는 절댓값으로 처리. */
  value: number;
  /** 막대 색상 override (CSS color 문자열). */
  color?: string;
  /** tooltip 커스터마이즈 등 확장용 메타. */
  meta?: Record<string, unknown>;
}`}
        />
        <ApiTable
          rows={[
            { property: 'label', type: 'string', description: 'X축 라벨이자 mesh의 key (고유)' },
            { property: 'value', type: 'number', description: '값. 막대 높이로 변환' },
            {
              property: 'color',
              type: 'string',
              description: '막대 색 override. 미지정 시 차트의 barColor 사용',
            },
            {
              property: 'meta',
              type: 'Record<string, unknown>',
              description: '확장용 임의 메타데이터',
            },
          ]}
        />
      </section>

      <Separator />

      <section className="flex flex-col gap-3">
        <Heading level={2} className="text-2xl">
          ScaleHeightOptions
        </Heading>
        <CodeBlock
          language="ts"
          code={`export interface ScaleHeightOptions {
  /** 가장 큰 값에 대응할 막대 높이. 기본 5. */
  maxHeight?: number;
}`}
        />
      </section>
    </div>
  );
}
