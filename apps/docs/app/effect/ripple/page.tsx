'use client';

import * as React from 'react';

import { Ripple } from '@baneung-pack/effect';
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

export default function RippleDemoPage() {
  const { t } = useI18n();
  const [color, setColor] = React.useState('rgba(255, 255, 255, 0.45)');
  const [duration, setDuration] = React.useState(600);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>Ripple</Heading>
        <Lead>
          자식 요소를 감싸 클릭 위치에서 물결이 퍼지는 효과를 입혀주는 래퍼. 버튼·카드·아이콘 등
          어디든 적용 가능.
        </Lead>
      </header>
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>버튼에 적용</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Ripple color={color} duration={duration}>
            <button
              style={{
                padding: '10px 20px',
                background: '#1F2937',
                color: '#FFFFFF',
                border: 'none',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                borderRadius: 0,
              }}
            >
              어두운 버튼
            </button>
          </Ripple>
          <Ripple color="rgba(0,0,0,0.15)" duration={duration}>
            <button
              style={{
                padding: '10px 20px',
                background: '#F3F4F6',
                color: '#1F2937',
                border: '1px solid #E9ECEF',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                borderRadius: 0,
              }}
            >
              밝은 버튼
            </button>
          </Ripple>
          <Ripple color="rgba(255,255,255,0.5)" duration={duration}>
            <button
              style={{
                padding: '10px 20px',
                background: '#16A34A',
                color: '#FFFFFF',
                border: 'none',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                borderRadius: 0,
              }}
            >
              Success
            </button>
          </Ripple>
          <Ripple color="rgba(255,255,255,0.5)" duration={duration}>
            <button
              style={{
                padding: '10px 20px',
                background: '#DC2626',
                color: '#FFFFFF',
                border: 'none',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                borderRadius: 0,
              }}
            >
              Danger
            </button>
          </Ripple>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>카드 / 큰 영역에 적용</CardTitle>
        </CardHeader>
        <CardContent>
          <Ripple color="rgba(91, 168, 160, 0.25)" duration={900}>
            <div
              role="button"
              tabIndex={0}
              style={{
                padding: '32px 24px',
                background: '#FFFFFF',
                border: '1px solid #E9ECEF',
                cursor: 'pointer',
                width: '100%',
                userSelect: 'none',
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>클릭 가능한 카드</div>
              <div style={{ fontSize: 13, color: '#6B7280' }}>
                카드 전체가 ripple 효과의 영역이 됩니다. 모서리 안에서만 퍼지도록 자동 클리핑.
              </div>
            </div>
          </Ripple>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>옵션 컨트롤</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Control label="Ripple 색상 (RGBA 권장)">
            <Input value={color} onChange={(e) => setColor(e.target.value)} />
          </Control>
          <Control label={`Duration (${duration}ms)`}>
            <input
              type="range"
              min={200}
              max={1500}
              step={50}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full"
            />
          </Control>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>사용</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto bg-surface p-4 text-sm leading-relaxed">
            <code>{`import { Ripple } from '@baneung-pack/effect';

// 버튼 감싸기
<Ripple color="rgba(255,255,255,0.45)">
  <button>클릭</button>
</Ripple>

// 카드/리스트 항목
<Ripple color="rgba(0,0,0,0.08)" duration={800}>
  <div role="button" tabIndex={0}>카드</div>
</Ripple>

// 비활성화
<Ripple disabled>
  <button>ripple 없음</button>
</Ripple>`}</code>
          </pre>
        </CardContent>
      </Card>

      <Separator />
      <Heading level={2}>{t('componentShell.apiHeading')}</Heading>
      <Card>
        <CardHeader>
          <CardTitle>RippleProps</CardTitle>
        </CardHeader>
        <CardContent>
          <ApiTable rows={PROPS} />
        </CardContent>
      </Card>
    </div>
  );
}

function Control({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-wider text-foreground-muted">
        {label}
      </span>
      {children}
    </label>
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
  { name: 'children', type: 'ReactNode', default: '—', desc: '감쌀 요소 (단일 권장).' },
  { name: 'color', type: 'string', default: 'currentColor', desc: 'ripple 색상 (rgba 권장).' },
  { name: 'duration', type: 'number', default: '600', desc: 'ripple 시간 (ms).' },
  { name: 'opacity', type: 'number', default: '0.35', desc: '시작 opacity (퍼지며 0으로 감소).' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: 'ripple 효과 비활성화.' },
];
