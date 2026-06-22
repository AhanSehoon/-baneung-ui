import Link from 'next/link';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Heading,
  Lead,
  Muted,
  Separator,
} from '@baneung-pack/ui';

export default function InstallPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>Install</Heading>
        <Lead>바능 디자인 시스템 패키지 설치 가이드. 필요한 패키지만 골라서 설치하세요.</Lead>
      </header>

      <Separator />

      <section className="flex flex-col gap-4">
        <Heading level={2} className="text-2xl">
          패키지 개요
        </Heading>
        <ul className="flex flex-col gap-2 text-sm">
          <li>
            <code>@baneung-pack/tokens</code> — CSS / JSON / TS 디자인 토큰 (SSOT). 모든 패키지의
            기반.
          </li>
          <li>
            <code>@baneung-pack/ui</code> — 58개 React 컴포넌트 (Radix 기반).
          </li>
          <li>
            <code>@baneung-pack/grid</code> — 데이터 그리드 (가상화, 정렬·필터, Excel 호환).
          </li>
          <li>
            <code>@baneung-pack/editor</code> — 리치 텍스트 WYSIWYG 에디터 (의존성 0).
          </li>
        </ul>
        <Muted className="text-xs">
          공통 peer deps: React <code>^18 || ^19</code>, React DOM <code>^18 || ^19</code>.
        </Muted>
      </section>

      <Separator />

      {/* ─────────────────────────────── tokens ─────────────────────────────── */}
      <section className="flex flex-col gap-4">
        <Heading level={2} className="text-2xl">
          @baneung-pack/tokens
        </Heading>
        <Card>
          <CardContent>
            <pre className="overflow-x-auto bg-surface p-3 text-xs font-mono">
              <code>{`# pnpm
pnpm add @baneung-pack/tokens

# npm
npm install @baneung-pack/tokens

# yarn
yarn add @baneung-pack/tokens`}</code>
            </pre>
          </CardContent>
        </Card>

        <Heading level={3} className="text-lg">
          사용
        </Heading>
        <Card>
          <CardContent>
            <pre className="overflow-x-auto bg-surface p-3 text-xs font-mono">
              <code>{`// CSS 변수로 사용
import '@baneung-pack/tokens/tokens.css';

// JS/TS 객체로 사용
import { colors, spacing, typography } from '@baneung-pack/tokens';

// JSON으로 사용 (Style Dictionary, Figma 토큰 등)
import tokens from '@baneung-pack/tokens/tokens.json';`}</code>
            </pre>
          </CardContent>
        </Card>
        <Muted className="text-xs">
          ui / grid / editor 패키지에 이미 포함돼 있어 별도 설치는 필요 없습니다. 토큰만 직접 쓰고
          싶을 때만 단독 설치.
        </Muted>
      </section>

      <Separator />

      {/* ─────────────────────────────── ui ─────────────────────────────── */}
      <section className="flex flex-col gap-4">
        <Heading level={2} className="text-2xl">
          @baneung-pack/ui
        </Heading>
        <Card>
          <CardContent>
            <pre className="overflow-x-auto bg-surface p-3 text-xs font-mono">
              <code>{`# pnpm
pnpm add @baneung-pack/ui

# npm
npm install @baneung-pack/ui

# yarn
yarn add @baneung-pack/ui`}</code>
            </pre>
          </CardContent>
        </Card>

        <Heading level={3} className="text-lg">
          스타일 임포트
        </Heading>
        <Card>
          <CardContent>
            <pre className="overflow-x-auto bg-surface p-3 text-xs font-mono">
              <code>{`// app/layout.tsx — 한 번만 로드
import '@baneung-pack/ui/styles.css';`}</code>
            </pre>
          </CardContent>
        </Card>
        <Muted className="text-xs">
          ui의 styles는 <code>@layer baneung</code>에 격리됩니다. Grid·Editor를 함께 쓰면 layer가
          자동 머지됩니다.
        </Muted>

        <Heading level={3} className="text-lg">
          CSS 격리 (소비자 Tailwind 사용 시)
        </Heading>
        <Card>
          <CardContent>
            <pre className="overflow-x-auto bg-surface p-3 text-xs font-mono">
              <code>{`// 소비자 globals.css — preflight 제외하고 utilities만 import
@import 'tailwindcss/theme';
@import 'tailwindcss/utilities';
/* @import 'tailwindcss/preflight'; ← 의도적으로 제외 (라이브러리가 이미 제공) */

@source "./app/**/*.{ts,tsx}";`}</code>
            </pre>
          </CardContent>
        </Card>
        <Muted className="text-xs">
          소비자가 Tailwind를 자체 임포트할 때 preflight↔라이브러리 utility 충돌을 회피하는 권장
          패턴.
        </Muted>
      </section>

      <Separator />

      {/* ─────────────────────────────── grid ─────────────────────────────── */}
      <section className="flex flex-col gap-4">
        <Heading level={2} className="text-2xl">
          @baneung-pack/grid
        </Heading>
        <Card>
          <CardContent>
            <pre className="overflow-x-auto bg-surface p-3 text-xs font-mono">
              <code>{`# pnpm
pnpm add @baneung-pack/grid

# npm
npm install @baneung-pack/grid

# yarn
yarn add @baneung-pack/grid`}</code>
            </pre>
          </CardContent>
        </Card>
        <Muted className="text-xs">
          내부 의존: <code>@tanstack/react-virtual</code> (가상화),{' '}
          <code>class-variance-authority</code>, <code>clsx</code>, <code>tailwind-merge</code>.
          Excel 내보내기 사용 시 추가로 <code>exceljs</code> (peer-optional) 설치 권장.
        </Muted>

        <Heading level={3} className="text-lg">
          스타일 임포트
        </Heading>
        <Card>
          <CardContent>
            <pre className="overflow-x-auto bg-surface p-3 text-xs font-mono">
              <code>{`// app/layout.tsx
import '@baneung-pack/grid/styles.css';`}</code>
            </pre>
          </CardContent>
        </Card>

        <Heading level={3} className="text-lg">
          기본 사용
        </Heading>
        <Card>
          <CardContent>
            <pre className="overflow-x-auto bg-surface p-3 text-xs font-mono">
              <code>{`import { Grid, type GridColumn } from '@baneung-pack/grid';

interface Item { id: number; name: string; price: number }

const columns: GridColumn<Item>[] = [
  { id: 'name', header: '이름', accessor: 'name' },
  {
    id: 'price', header: '가격', accessor: 'price', align: 'right',
    renderer: (v) => \`\${(v as number).toLocaleString()}원\`,
  },
];

const data: Item[] = [
  { id: 1, name: '사과', price: 1000 },
  { id: 2, name: '바나나', price: 2000 },
];

export default function MyPage() {
  return <Grid columns={columns} data={data} pageSize={20} />;
}`}</code>
            </pre>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* ─────────────────────────────── editor ─────────────────────────────── */}
      <section className="flex flex-col gap-4">
        <Heading level={2} className="text-2xl">
          @baneung-pack/editor
        </Heading>
        <Card>
          <CardContent>
            <pre className="overflow-x-auto bg-surface p-3 text-xs font-mono">
              <code>{`# pnpm
pnpm add @baneung-pack/editor

# npm
npm install @baneung-pack/editor

# yarn
yarn add @baneung-pack/editor`}</code>
            </pre>
          </CardContent>
        </Card>
        <Muted className="text-xs">
          외부 에디터 라이브러리 없이 동작 — 런타임 의존성은 <code>clsx</code>·
          <code>tailwind-merge</code> 둘뿐.
        </Muted>

        <Heading level={3} className="text-lg">
          스타일 임포트
        </Heading>
        <Card>
          <CardContent>
            <pre className="overflow-x-auto bg-surface p-3 text-xs font-mono">
              <code>{`// app/layout.tsx
import '@baneung-pack/editor/styles.css';`}</code>
            </pre>
          </CardContent>
        </Card>

        <Heading level={3} className="text-lg">
          기본 사용
        </Heading>
        <Card>
          <CardContent>
            <pre className="overflow-x-auto bg-surface p-3 text-xs font-mono">
              <code>{`'use client';
import { Editor } from '@baneung-pack/editor';
import { useState } from 'react';

export default function MyPage() {
  const [html, setHtml] = useState('<p>안녕하세요 👋</p>');
  return <Editor value={html} onChange={setHtml} />;
}`}</code>
            </pre>
          </CardContent>
        </Card>
        <Muted className="text-xs">
          Next.js App Router에서는 상태를 다루는 페이지/컴포넌트에{' '}
          <code>&apos;use client&apos;</code>가 필요합니다 (패키지 자체에는 <code>use client</code>
          가 주입되어 있습니다).
        </Muted>
      </section>

      <Separator />

      <section className="flex flex-col gap-3">
        <Card>
          <CardHeader>
            <CardTitle>다음 단계</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-1 text-sm">
              <li>
                <Link href="/components" className="underline">
                  컴포넌트 카탈로그
                </Link>{' '}
                — UI 58개 컴포넌트
              </li>
              <li>
                <Link href="/grid/basic" className="underline">
                  Grid 가이드
                </Link>{' '}
                — 데이터 그리드 데모/Props
              </li>
              <li>
                <Link href="/editor/basic" className="underline">
                  Editor 가이드
                </Link>{' '}
                — 리치 텍스트 에디터 데모/Props
              </li>
              <li>
                <Link href="/tokens" className="underline">
                  디자인 토큰
                </Link>{' '}
                — 컬러/스페이싱/타이포
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
