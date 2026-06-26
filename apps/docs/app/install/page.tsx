'use client';

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

import { useI18n } from '@/components/i18n-provider';

export default function InstallPage() {
  const { t } = useI18n();
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>{t('install.title')}</Heading>
        <Lead>{t('install.lead')}</Lead>
      </header>

      <Separator />

      <section className="flex flex-col gap-4">
        <Heading level={2} className="text-2xl">
          {t('install.packagesOverview')}
        </Heading>
        <ul className="flex flex-col gap-2 text-sm">
          <li>
            <code>@baneung-pack/tokens</code> — {t('install.pkg.tokens')}
          </li>
          <li>
            <code>@baneung-pack/ui</code> — {t('install.pkg.ui')}
          </li>
          <li>
            <code>@baneung-pack/grid</code> — {t('install.pkg.grid')}
          </li>
          <li>
            <code>@baneung-pack/editor</code> — {t('install.pkg.editor')}
          </li>
          <li>
            <code>@baneung-pack/chart</code> — {t('install.pkg.chart')}
          </li>
          <li>
            <code>@baneung-pack/effect</code> — {t('install.pkg.effect')}
          </li>
        </ul>
        <Muted className="text-xs">{t('install.commonPeerDeps')}</Muted>
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
        <Muted className="text-xs">{t('install.tokensNote')}</Muted>
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
          {t('install.styleImport')}
        </Heading>
        <Card>
          <CardContent>
            <pre className="overflow-x-auto bg-surface p-3 text-xs font-mono">
              <code>{`// app/layout.tsx
import '@baneung-pack/ui/styles.css';`}</code>
            </pre>
          </CardContent>
        </Card>
        <Muted className="text-xs">{t('install.uiLayerNote')}</Muted>

        <Heading level={3} className="text-lg">
          {t('install.cssIsolation')}
        </Heading>
        <Card>
          <CardContent>
            <pre className="overflow-x-auto bg-surface p-3 text-xs font-mono">
              <code>{`// globals.css — utilities only (skip preflight)
@import 'tailwindcss/theme';
@import 'tailwindcss/utilities';
/* @import 'tailwindcss/preflight'; */

@source "./app/**/*.{ts,tsx}";`}</code>
            </pre>
          </CardContent>
        </Card>
        <Muted className="text-xs">{t('install.uiTailwindNote')}</Muted>
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
        <Muted className="text-xs">{t('install.gridDepsNote')}</Muted>

        <Heading level={3} className="text-lg">
          {t('install.styleImport')}
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
          {t('install.basicUsage')}
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
        <Muted className="text-xs">{t('install.editorDepsNote')}</Muted>

        <Heading level={3} className="text-lg">
          {t('install.styleImport')}
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
        <Muted className="text-xs">{t('install.editorClientNote')}</Muted>
      </section>

      <Separator />

      {/* ─────────────────────────────── chart ─────────────────────────────── */}
      <section className="flex flex-col gap-4">
        <Heading level={2} className="text-2xl">
          @baneung-pack/chart
        </Heading>
        <Card>
          <CardContent>
            <pre className="overflow-x-auto bg-surface p-3 text-xs font-mono">
              <code>{`# pnpm
pnpm add @baneung-pack/chart chart.js react-chartjs-2

# npm
npm install @baneung-pack/chart chart.js react-chartjs-2

# yarn
yarn add @baneung-pack/chart chart.js react-chartjs-2`}</code>
            </pre>
          </CardContent>
        </Card>
        <Muted className="text-xs">{t('install.chartDepsNote')}</Muted>

        <Heading level={3} className="text-lg">
          {t('install.styleImport')}
        </Heading>
        <Card>
          <CardContent>
            <pre className="overflow-x-auto bg-surface p-3 text-xs font-mono">
              <code>{`// app/layout.tsx
import '@baneung-pack/chart/styles.css';`}</code>
            </pre>
          </CardContent>
        </Card>

        <Heading level={3} className="text-lg">
          {t('install.basicUsage')}
        </Heading>
        <Card>
          <CardContent>
            <pre className="overflow-x-auto bg-surface p-3 text-xs font-mono">
              <code>{`import { BarChart } from '@baneung-pack/chart';

const data = [
  { month: '1월', revenue: 1200, profit: 300 },
  { month: '2월', revenue: 1500, profit: 400 },
];

export default function MyPage() {
  return (
    <BarChart
      data={data}
      xKey="month"
      yKeys={['revenue', 'profit']}
      labels={{ revenue: '매출', profit: '이익' }}
      height={300}
    />
  );
}`}</code>
            </pre>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* ─────────────────────────────── effect ─────────────────────────────── */}
      <section className="flex flex-col gap-4">
        <Heading level={2} className="text-2xl">
          @baneung-pack/effect
        </Heading>
        <Card>
          <CardContent>
            <pre className="overflow-x-auto bg-surface p-3 text-xs font-mono">
              <code>{`# pnpm
pnpm add @baneung-pack/effect

# npm
npm install @baneung-pack/effect

# yarn
yarn add @baneung-pack/effect`}</code>
            </pre>
          </CardContent>
        </Card>

        <Heading level={3} className="text-lg">
          {t('install.usage')}
        </Heading>
        <Card>
          <CardContent>
            <pre className="overflow-x-auto bg-surface p-3 text-xs font-mono">
              <code>{`// Typewriter / RotatingWords / ScrambleText / SplitTextReveal / CountUp
import { Typewriter, RotatingWords, CountUp } from '@baneung-pack/effect';

export function Hero() {
  return (
    <>
      <Typewriter text="함께 만들 프로젝트가 있으신가요?" loop />
      <span>
        We build{' '}
        <RotatingWords words={['apps', 'agents', 'sites']} color="#3B716C" fontWeight={700} />
      </span>
      <CountUp to={1234567} fontSize={48} fontWeight={800} trigger="inView" />
    </>
  );
}`}</code>
            </pre>
          </CardContent>
        </Card>
        <Muted className="text-xs">{t('install.effectNote')}</Muted>
      </section>

      <Separator />

      <section className="flex flex-col gap-3">
        <Card>
          <CardHeader>
            <CardTitle>{t('install.nextSteps')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-1 text-sm">
              <li>
                <Link href="/components" className="underline">
                  {t('install.next.catalog')}
                </Link>{' '}
                — {t('install.next.catalogDesc')}
              </li>
              <li>
                <Link href="/grid/basic" className="underline">
                  {t('install.next.grid')}
                </Link>{' '}
                — {t('install.next.gridDesc')}
              </li>
              <li>
                <Link href="/editor/basic" className="underline">
                  {t('install.next.editor')}
                </Link>{' '}
                — {t('install.next.editorDesc')}
              </li>
              <li>
                <Link href="/tokens" className="underline">
                  {t('install.next.tokens')}
                </Link>{' '}
                — {t('install.next.tokensDesc')}
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
