'use client';

import * as React from 'react';

import { CopyButton } from '@baneung-pack/ui';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Heading,
  Input,
  Lead,
  Separator,
} from '@baneung-pack/ui';

import { useI18n } from '@/components/i18n-provider';

export default function CopyButtonDemoPage() {
  const { t } = useI18n();
  const [text, setText] = React.useState('npm install @baneung-pack/ui');
  const [lastEvent, setLastEvent] = React.useState<string>('—');

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>CopyButton</Heading>
        <Lead>
          클릭 시 <code>navigator.clipboard</code>로 복사 + 아이콘이 copy → check로 모핑. 일정 시간
          후 자동 복원, &quot;Copied!&quot; 툴팁 옵션.
        </Lead>
      </header>
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>라이브 미리보기</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium uppercase tracking-wider text-foreground-muted">
              복사할 값
            </label>
            <Input value={text} onChange={(e) => setText(e.target.value)} />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <CopyButton value={text} onCopied={() => setLastEvent(`copied: "${text}"`)}>
              Copy
            </CopyButton>

            <CopyButton value={text} size="sm" onCopied={() => setLastEvent('sm copied')}>
              sm
            </CopyButton>

            <CopyButton value={text} size="lg" onCopied={() => setLastEvent('lg copied')}>
              lg
            </CopyButton>

            <CopyButton value={text} iconOnly onCopied={() => setLastEvent('iconOnly copied')} />

            <CopyButton
              value={text}
              tooltipLabel="복사됨"
              onCopied={() => setLastEvent('koeran tooltip')}
            >
              한글 툴팁
            </CopyButton>
          </div>

          <div className="text-xs text-foreground-muted">
            마지막 이벤트: <code>{lastEvent}</code>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>코드 블록 + Copy</CardTitle>
        </CardHeader>
        <CardContent>
          {/* 코드 블록 상단 우측에 iconOnly 버튼 — 일반적인 패턴 */}
          <div className="relative">
            <pre className="overflow-x-auto bg-surface p-4 pr-12 text-sm">
              <code>{`pnpm add @baneung-pack/ui`}</code>
            </pre>
            <div className="absolute right-2 top-2">
              <CopyButton value="pnpm add @baneung-pack/ui" iconOnly size="sm" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>사용</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto bg-surface p-4 text-sm leading-relaxed">
            <code>{`import { CopyButton } from '@baneung-pack/ui';

// 기본
<CopyButton value="hello world">Copy</CopyButton>

// 아이콘만 + 툴팁
<CopyButton value={code} iconOnly />

// 콜백
<CopyButton
  value={url}
  onCopied={(v) => console.log('copied:', v)}
  onError={(e) => console.error('clipboard failed:', e)}
>
  링크 복사
</CopyButton>

// 코드 블록 우측 상단 패턴
<div className="relative">
  <pre>{code}</pre>
  <div className="absolute right-2 top-2">
    <CopyButton value={code} iconOnly size="sm" />
  </div>
</div>`}</code>
          </pre>
        </CardContent>
      </Card>

      <Separator />
      <Heading level={2}>{t('componentShell.apiHeading')}</Heading>
      <Card>
        <CardHeader>
          <CardTitle>CopyButtonProps</CardTitle>
        </CardHeader>
        <CardContent>
          <ApiTable rows={PROPS} />
        </CardContent>
      </Card>
    </div>
  );
}

function ApiTable({
  rows,
}: {
  rows: { name: string; type: string; default: string; desc: string }[];
}) {
  const { t } = useI18n();
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border-default">
            <th className="px-3 py-2 text-left font-medium">{t('api.property')}</th>
            <th className="px-3 py-2 text-left font-medium">{t('api.type')}</th>
            <th className="px-3 py-2 text-left font-medium">{t('api.default')}</th>
            <th className="px-3 py-2 text-left font-medium">{t('api.description')}</th>
          </tr>
        </thead>
        <tbody className="text-foreground-muted">
          {rows.map((row) => (
            <tr key={row.name} className="border-b border-border-subtle align-top last:border-b-0">
              <td className="px-3 py-2 font-mono text-foreground">{row.name}</td>
              <td className="px-3 py-2 font-mono text-xs">{row.type}</td>
              <td className="px-3 py-2 font-mono text-xs">{row.default}</td>
              <td className="px-3 py-2">{row.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const PROPS = [
  { name: 'value', type: 'string', default: '—', desc: '복사할 텍스트 (필수).' },
  { name: 'onCopied', type: '(value: string) => void', default: '—', desc: '복사 완료 콜백.' },
  {
    name: 'onError',
    type: '(error: unknown) => void',
    default: '—',
    desc: '복사 실패 콜백 (clipboard 미지원/거부).',
  },
  { name: 'duration', type: 'number', default: '1800', desc: 'copied 상태 유지 시간 (ms).' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: '크기.' },
  {
    name: 'showTooltip',
    type: 'boolean',
    default: 'true',
    desc: 'iconOnly + copied 시 floating 툴팁.',
  },
  { name: 'tooltipLabel', type: 'string', default: "'Copied!'", desc: '툴팁/copied 라벨.' },
  { name: 'iconOnly', type: 'boolean', default: 'false', desc: 'true면 아이콘만 (정사각 버튼).' },
  { name: 'children', type: 'ReactNode', default: '—', desc: 'idle 상태 라벨 (iconOnly=false).' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '비활성화.' },
];
