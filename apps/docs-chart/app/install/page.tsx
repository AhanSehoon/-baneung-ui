import { Card, CardContent, CardHeader, CardTitle, Heading, Lead, Muted } from '@baneung-pack/ui';

import { CodeBlock } from '@/components/code-block';

export default function InstallPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>설치</Heading>
        <Lead>
          `@baneung-pack/chart`를 npm에서 설치하고 첫 3D 차트를 그리는 데 필요한 최소 단계.
        </Lead>
      </header>

      <section className="flex flex-col gap-3">
        <Heading level={2} className="text-2xl">
          1. 패키지 설치
        </Heading>
        <Muted className="text-sm">
          three / @react-three/fiber / @react-three/drei는 peer-like 의존성이므로 함께 설치해야
          합니다.
        </Muted>
        <CodeBlock
          language="bash"
          code={`pnpm add @baneung-pack/chart three @react-three/fiber @react-three/drei
# 또는
npm i @baneung-pack/chart three @react-three/fiber @react-three/drei`}
        />
      </section>

      <section className="flex flex-col gap-3">
        <Heading level={2} className="text-2xl">
          2. CSS import
        </Heading>
        <Muted className="text-sm">
          모든 스타일은 @layer baneung에 격리됩니다. 소비자 글로벌 CSS와 충돌하지 않음.
        </Muted>
        <CodeBlock
          language="tsx"
          code={`// app/layout.tsx (Next.js App Router)
import '@baneung-pack/chart/styles.css';`}
        />
      </section>

      <section className="flex flex-col gap-3">
        <Heading level={2} className="text-2xl">
          3. 첫 차트
        </Heading>
        <Muted className="text-sm">
          Three.js는 client-only이므로 페이지 또는 컴포넌트를 client component로 둡니다.
        </Muted>
        <CodeBlock
          language="tsx"
          code={`'use client';

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
}`}
        />
      </section>

      <Card variant="outlined">
        <CardHeader>
          <CardTitle className="text-base">⚠️ Next.js App Router에서</CardTitle>
        </CardHeader>
        <CardContent>
          <Muted className="text-sm leading-relaxed">
            BarChart3D는 내부적으로 WebGL과 hook을 사용하므로 server component에서 직접 import하면
            오류가 납니다. 부모를{' '}
            <code className="rounded-none bg-surface px-1">{`'use client'`}</code>로 선언하거나,{' '}
            <code className="rounded-none bg-surface px-1">next/dynamic</code>으로 SSR을 끄세요.
          </Muted>
        </CardContent>
      </Card>
    </div>
  );
}
