'use client';

import * as React from 'react';

import { Card, CardContent, Separator, cn } from '@baneung-pack/ui';

import { CodeBlock } from '@/components/code-block';

interface ExampleSectionProps {
  Example: React.ComponentType;
  code: string;
}

/**
 * ExampleSection — 라이브 예제 + 토글식 코드 블록.
 *
 * 카드 상단: <Example /> 렌더, 하단 별도 영역에 "코드 보기" 토글.
 */
export function ExampleSection({ Example, code }: ExampleSectionProps) {
  const [showCode, setShowCode] = React.useState(false);

  return (
    <Card variant="outlined">
      <CardContent className="block min-h-[120px] overflow-x-auto p-6">
        <Example />
      </CardContent>
      <Separator />
      <button
        type="button"
        onClick={() => setShowCode((v) => !v)}
        aria-expanded={showCode}
        className={cn(
          'flex w-full items-center justify-center gap-1 py-2 text-xs',
          'text-foreground-muted hover:text-foreground hover:bg-surface',
          'transition-colors duration-fast ease-standard',
          'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring',
        )}
      >
        <span aria-hidden="true">{showCode ? '∧' : '∨'}</span>
        <span>{showCode ? '코드 숨기기' : '코드 보기'}</span>
      </button>
      {showCode ? (
        <>
          <Separator />
          <div className="p-0">
            <CodeBlock code={code} />
          </div>
        </>
      ) : null}
    </Card>
  );
}
