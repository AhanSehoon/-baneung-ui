import { Card, CardContent, Heading, Lead, Muted, Separator } from '@baneung-pack/ui';

export default function EditorInstallPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>Editor · Install</Heading>
        <Lead>
          <code>@baneung-pack/editor</code>만 설치하는 빠른 가이드. 외부 에디터 라이브러리 없이
          동작하며 런타임 의존성은 <code>clsx</code>·<code>tailwind-merge</code> 둘뿐입니다.
        </Lead>
      </header>

      <Separator />

      <section className="flex flex-col gap-4">
        <Heading level={2} className="text-2xl">
          패키지 설치
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
          Peer deps: React <code>^18 || ^19</code>, React DOM <code>^18 || ^19</code>.
        </Muted>
      </section>

      <section className="flex flex-col gap-4">
        <Heading level={2} className="text-2xl">
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
      </section>

      <section className="flex flex-col gap-4">
        <Heading level={2} className="text-2xl">
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
          <code>&apos;use client&apos;</code>가 필요합니다(패키지 자체에는 <code>use client</code>가
          주입되어 있습니다).
        </Muted>
      </section>
    </div>
  );
}
