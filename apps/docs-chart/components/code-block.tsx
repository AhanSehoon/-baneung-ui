'use client';

import * as React from 'react';

import { Button } from '@baneung-pack/ui';

interface CodeBlockProps {
  code: string;
  language?: string;
}

/**
 * CodeBlock — 모노스페이스 코드 블록 + 복사 버튼.
 * shiki/prism 같은 syntax highlight는 추후 작업으로 — 지금은 plain monospace.
 */
export function CodeBlock({ code, language = 'tsx' }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard 권한 거부 등 — 무시
    }
  };

  return (
    <div className="relative">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="absolute right-2 top-2 h-7 px-2 text-xs"
        aria-label={copied ? '복사됨' : '코드 복사'}
      >
        {copied ? '✓ 복사됨' : '복사'}
      </Button>
      <pre
        className="overflow-x-auto bg-surface-strong p-4 pr-20 text-sm leading-relaxed"
        aria-label={`${language} 코드 예제`}
      >
        <code className="font-mono text-foreground">{code}</code>
      </pre>
    </div>
  );
}
