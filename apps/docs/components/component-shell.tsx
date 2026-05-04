'use client';

import Link from 'next/link';
import * as React from 'react';

import { Badge, Heading, Lead, Muted, Separator } from '@baneung-pack/ui';

import { ApiTable } from '@/components/api-table';
import { ExampleSection } from '@/components/example-section';
import type { ComponentSpec } from '@/lib/components';

interface ComponentShellProps {
  spec: ComponentSpec;
}

/**
 * ComponentShell — 컴포넌트별 detail 페이지의 공통 레이아웃.
 *
 * 구성: 카테고리 배지 → 제목 + 설명 → 라이브 예제 → API 표 (props) → import 경로
 */
export function ComponentShell({ spec }: ComponentShellProps) {
  const { title, category, description, Example, code, api, importPath, subpath } = spec;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-12">
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Link href="/components" className="text-xs text-foreground-muted hover:text-foreground">
            ← 컴포넌트 목록
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{category}</Badge>
          <Heading level={1} className="text-3xl md:text-4xl">
            {title}
          </Heading>
        </div>
        <Lead>{description}</Lead>
      </header>

      <Separator />

      <section className="flex flex-col gap-3">
        <Heading level={2}>예제</Heading>
        <ExampleSection Example={Example} code={code} />
      </section>

      <section className="flex flex-col gap-3">
        <Heading level={2}>설치 / Import</Heading>
        <pre className="overflow-x-auto bg-surface-strong p-4 text-sm">
          <code className="font-mono">{importPath}</code>
        </pre>
        {subpath ? (
          <pre className="overflow-x-auto bg-surface-strong p-4 text-sm">
            <code className="font-mono">{subpath}</code>
          </pre>
        ) : null}
        <Muted className="text-xs">
          서브패스 import는 트리쉐이킹 친화 — 사용하지 않는 다른 컴포넌트는 번들에 포함되지
          않습니다.
        </Muted>
      </section>

      <section className="flex flex-col gap-3">
        <Heading level={2}>API</Heading>
        <ApiTable rows={api} />
      </section>
    </div>
  );
}
