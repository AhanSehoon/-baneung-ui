'use client';

import * as React from 'react';

import { BarChart3D } from '@baneung-pack/chart';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Heading,
  Lead,
  Separator,
} from '@baneung-pack/ui';

import { ApiTable } from '@/components/api-table';
import { CodeBlock } from '@/components/code-block';

const sampleData = [
  { label: '서울', value: 120 },
  { label: '부산', value: 80 },
  { label: '대전', value: 65 },
  { label: '제주', value: 40 },
  { label: '광주', value: 55 },
];

const codeExample = `'use client';

import { BarChart3D } from '@baneung-pack/chart';

const data = [
  { label: '서울', value: 120 },
  { label: '부산', value: 80 },
  { label: '대전', value: 65 },
  { label: '제주', value: 40 },
  { label: '광주', value: 55 },
];

export function CityRanking() {
  return (
    <div style={{ width: '100%', height: 480 }}>
      <BarChart3D data={data} aria-label="도시별 인구" />
    </div>
  );
}`;

export default function BarChart3DPage(): React.ReactElement {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>BarChart3D</Heading>
        <Lead>
          값에 비례한 높이의 3D 막대 차트. OrbitControls로 회전·줌 가능하며 막대 hover 시 라벨과
          값을 툴팁으로 표시합니다.
        </Lead>
      </header>

      <Separator />

      {/* 라이브 데모 */}
      <section className="flex flex-col gap-3">
        <Heading level={2} className="text-2xl">
          데모
        </Heading>
        <Card variant="outlined">
          <CardContent className="p-0">
            <div style={{ width: '100%', height: 480 }}>
              <BarChart3D data={sampleData} aria-label="도시별 인구 (데모)" />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 코드 */}
      <section className="flex flex-col gap-3">
        <Heading level={2} className="text-2xl">
          코드
        </Heading>
        <CodeBlock language="tsx" code={codeExample} />
      </section>

      {/* 인터랙션 안내 */}
      <Card variant="outlined">
        <CardHeader>
          <CardTitle className="text-base">인터랙션</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 text-sm leading-relaxed text-foreground-muted">
            <li>마우스 좌클릭 + 드래그 — 카메라 회전</li>
            <li>마우스 휠 — 줌</li>
            <li>마우스 우클릭 + 드래그 — 팬</li>
            <li>막대 hover — 라벨·값 툴팁 표시</li>
          </ul>
        </CardContent>
      </Card>

      <Separator />

      {/* Props API */}
      <section className="flex flex-col gap-3">
        <Heading level={2} className="text-2xl">
          Props
        </Heading>
        <ApiTable
          rows={[
            {
              property: 'data',
              type: 'BarChartDatum[]',
              description: '{ label, value, color?, meta? } 배열. label은 고유해야 함',
            },
            {
              property: 'maxHeight',
              type: 'number',
              default: '5',
              description: '가장 큰 값에 해당하는 막대 높이 (Three.js 단위)',
            },
            {
              property: 'barWidth',
              type: 'number',
              default: '0.7',
              description: '각 막대의 가로/세로 크기',
            },
            {
              property: 'gap',
              type: 'number',
              default: '0.4',
              description: '막대 간 간격',
            },
            {
              property: 'barColor',
              type: 'string',
              default: "'#3B4B63'",
              description: '막대 기본 색. 데이텀의 color가 있으면 그게 우선',
            },
            {
              property: 'showLabel',
              type: 'boolean',
              default: 'true',
              description: '막대 상단 label 텍스트 표시 여부',
            },
            {
              property: 'cameraPosition',
              type: '[number, number, number]',
              default: '[5, 5, 5]',
              description: '초기 카메라 위치 (x, y, z)',
            },
            {
              property: 'aria-label',
              type: 'string',
              default: "'3D 막대 차트'",
              description: '접근성 region 라벨. 차트가 무엇을 보여주는지 설명',
            },
          ]}
        />
      </section>
    </div>
  );
}
