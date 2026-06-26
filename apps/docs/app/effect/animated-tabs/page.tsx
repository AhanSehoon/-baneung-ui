'use client';

import * as React from 'react';

import { AnimatedTabs, type AnimatedTabItem } from '@baneung-pack/ui';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Heading,
  Lead,
  Separator,
} from '@baneung-pack/ui';

import { useI18n } from '@/components/i18n-provider';

const TABS: AnimatedTabItem[] = [
  {
    value: 'overview',
    label: 'Overview',
    content: (
      <p className="text-sm leading-relaxed text-foreground">
        활성 탭 아래(또는 옆) 인디케이터가 부드럽게 미끄러집니다. DOM rect를 측정해 정확한 위치로
        transform.
      </p>
    ),
  },
  {
    value: 'features',
    label: 'Features',
    content: (
      <ul className="list-disc space-y-1 pl-5 text-sm text-foreground">
        <li>controlled / uncontrolled</li>
        <li>키보드 ArrowLeft / Right (horizontal) · ArrowUp/Down (vertical)</li>
        <li>Home / End로 첫/마지막 탭</li>
        <li>disabled 탭 자동 skip</li>
      </ul>
    ),
  },
  {
    value: 'a11y',
    label: 'Accessibility',
    content: (
      <p className="text-sm leading-relaxed text-foreground">
        <code>role=&quot;tablist/tab/tabpanel&quot;</code>, <code>aria-selected</code>,{' '}
        <code>aria-controls</code>, <code>aria-labelledby</code> 모두 자동.
      </p>
    ),
  },
  {
    value: 'disabled',
    label: 'Disabled',
    content: <p>이 탭은 disabled — 키보드 이동 시 자동으로 건너뜁니다.</p>,
    disabled: true,
  },
  {
    value: 'last',
    label: 'Last',
    content: <p className="text-sm">마지막 탭 콘텐츠.</p>,
  },
];

export default function AnimatedTabsDemoPage() {
  const { t } = useI18n();
  // Controlled 데모.
  const [active, setActive] = React.useState('features');

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>AnimatedTabs</Heading>
        <Lead>
          활성 탭 인디케이터가 부드럽게 미끄러지는 탭. controlled/uncontrolled · ArrowLeft/Right 키
          · <code>role=&quot;tablist/tab/tabpanel&quot;</code> ARIA 완비.
        </Lead>
      </header>
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Horizontal (기본, Uncontrolled)</CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatedTabs items={TABS} />
          <p className="mt-4 text-xs text-foreground-muted">
            💡 탭을 클릭하거나 Tab으로 포커스 → ArrowLeft/Right로 이동. Home/End로 양 끝. disabled
            탭은 자동 skip.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vertical orientation</CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatedTabs items={TABS} orientation="vertical" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Controlled</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 text-xs text-foreground-muted">
            외부 활성 값: <code>{active}</code>
          </div>
          <AnimatedTabs items={TABS} value={active} onValueChange={setActive} />
          <div className="mt-4 flex flex-wrap gap-2">
            {TABS.filter((t) => !t.disabled).map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActive(tab.value)}
                className="border border-border-default px-3 py-1 text-xs"
              >
                외부에서 → {tab.value}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>크기 / 색상</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wider text-foreground-muted">
              sm
            </div>
            <AnimatedTabs items={TABS.slice(0, 3)} size="sm" />
          </div>
          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wider text-foreground-muted">
              lg + teal 색
            </div>
            <AnimatedTabs
              items={TABS.slice(0, 3)}
              size="lg"
              indicatorColor="#3B716C"
              activeColor="#3B716C"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>사용</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto bg-surface p-4 text-sm leading-relaxed">
            <code>{`import { AnimatedTabs } from '@baneung-pack/ui';

const TABS = [
  { value: 'overview', label: 'Overview', content: <p>...</p> },
  { value: 'features', label: 'Features', content: <p>...</p> },
  { value: 'old', label: 'Deprecated', content: <p>...</p>, disabled: true },
];

// Uncontrolled
<AnimatedTabs items={TABS} defaultValue="features" />

// Controlled
<AnimatedTabs items={TABS} value={active} onValueChange={setActive} />

// Vertical
<AnimatedTabs items={TABS} orientation="vertical" />

// 색
<AnimatedTabs items={TABS} indicatorColor="#3B716C" activeColor="#3B716C" />`}</code>
          </pre>
        </CardContent>
      </Card>

      <Separator />
      <Heading level={2}>{t('componentShell.apiHeading')}</Heading>
      <Card>
        <CardHeader>
          <CardTitle>AnimatedTabsProps</CardTitle>
        </CardHeader>
        <CardContent>
          <ApiTable rows={PROPS} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AnimatedTabItem</CardTitle>
        </CardHeader>
        <CardContent>
          <ApiTable rows={ITEM_PROPS} />
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
  { name: 'items', type: 'AnimatedTabItem[]', default: '—', desc: '탭 항목 배열 (필수).' },
  { name: 'value', type: 'string', default: '—', desc: 'Controlled 활성 value.' },
  { name: 'defaultValue', type: 'string', default: '첫 enabled', desc: 'Uncontrolled 초기 활성.' },
  { name: 'onValueChange', type: '(value: string) => void', default: '—', desc: '변경 콜백.' },
  {
    name: 'orientation',
    type: "'horizontal' | 'vertical'",
    default: "'horizontal'",
    desc: '방향.',
  },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: '크기.' },
  { name: 'indicatorColor', type: 'string', default: "'#1F2937'", desc: '활성 인디케이터 색.' },
  { name: 'activeColor', type: 'string', default: "'#1F2937'", desc: '활성 탭 텍스트 색.' },
  { name: 'duration', type: 'number', default: '250', desc: '인디케이터 슬라이드 시간 (ms).' },
];

const ITEM_PROPS = [
  { name: 'value', type: 'string', default: '—', desc: '고유 키 (필수).' },
  { name: 'label', type: 'ReactNode', default: '—', desc: '탭 버튼 라벨.' },
  { name: 'content', type: 'ReactNode', default: '—', desc: '탭패널 내용.' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '비활성화 (키보드 skip).' },
];
