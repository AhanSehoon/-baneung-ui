'use client';

import * as React from 'react';

import { VariableFontHover } from '@baneung-pack/effect';
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

export default function VariableFontHoverDemoPage() {
  const { t } = useI18n();
  const [text, setText] = React.useState('HOVER OVER THE TEXT');
  const [minWeight, setMinWeight] = React.useState(300);
  const [maxWeight, setMaxWeight] = React.useState(900);
  const [radius, setRadius] = React.useState(100);
  const [transitionMs, setTransitionMs] = React.useState(200);
  const [fontSize, setFontSize] = React.useState(48);
  const [color, setColor] = React.useState('#1F2937');

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>VariableFontHover</Heading>
        <Lead>
          마우스 커서가 지나가는 글자만 굵어지는 효과. Pretendard Variable / Inter Variable 등 가변
          폰트와 함께 쓸 때 부드럽게 보간됨.
        </Lead>
      </header>
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>라이브 미리보기</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex min-h-32 items-center justify-center border border-border-default bg-surface p-6">
            <VariableFontHover
              text={text}
              minWeight={minWeight}
              maxWeight={maxWeight}
              radius={radius}
              transitionMs={transitionMs}
              fontSize={fontSize}
              color={color}
              fontFamily='"Pretendard Variable", Pretendard, system-ui, sans-serif'
            />
          </div>
          <p className="text-xs text-foreground-muted">
            💡 위 박스 안에서 마우스를 천천히 움직여보세요. 커서 주변 글자가 굵어집니다.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <Control label="텍스트">
              <Input value={text} onChange={(e) => setText(e.target.value)} maxLength={60} />
            </Control>

            <Control label={`최소 굵기 (${minWeight})`}>
              <input
                type="range"
                min={100}
                max={500}
                step={100}
                value={minWeight}
                onChange={(e) => setMinWeight(Number(e.target.value))}
                className="w-full"
              />
            </Control>

            <Control label={`최대 굵기 (${maxWeight})`}>
              <input
                type="range"
                min={500}
                max={900}
                step={100}
                value={maxWeight}
                onChange={(e) => setMaxWeight(Number(e.target.value))}
                className="w-full"
              />
            </Control>

            <Control label={`반경 (${radius}px)`}>
              <input
                type="range"
                min={20}
                max={300}
                step={10}
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full"
              />
            </Control>

            <Control label={`전환 (${transitionMs}ms)`}>
              <input
                type="range"
                min={0}
                max={800}
                step={20}
                value={transitionMs}
                onChange={(e) => setTransitionMs(Number(e.target.value))}
                className="w-full"
              />
            </Control>

            <Control label={`글자 크기 (${fontSize}px)`}>
              <input
                type="range"
                min={20}
                max={96}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full"
              />
            </Control>

            <Control label="색상">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-10 w-12 cursor-pointer border border-border-default p-1"
                  aria-label="색상 선택"
                />
                <Input value={color} onChange={(e) => setColor(e.target.value)} />
              </div>
            </Control>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <PresetCard title="기본 (300 ↔ 900)">
          <VariableFontHover
            text="MOVE YOUR MOUSE"
            fontSize={32}
            color="#1F2937"
            fontFamily='"Pretendard Variable", system-ui'
          />
        </PresetCard>
        <PresetCard title="좁은 반경 (40px)">
          <VariableFontHover
            text="ANGULAR"
            radius={40}
            fontSize={38}
            color="#3B716C"
            fontFamily='"Pretendard Variable", system-ui'
          />
        </PresetCard>
        <PresetCard title="얇은 → 중간 (100 ↔ 600)">
          <VariableFontHover
            text="subtle hover"
            minWeight={100}
            maxWeight={600}
            fontSize={32}
            color="#5BA8A0"
            fontFamily='"Pretendard Variable", system-ui'
          />
        </PresetCard>
        <PresetCard title="빠른 전환 (50ms)">
          <VariableFontHover
            text="QUICK FEEL"
            transitionMs={50}
            fontSize={32}
            color="#1F2937"
            fontFamily='"Pretendard Variable", system-ui'
          />
        </PresetCard>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>사용</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto bg-surface p-4 text-sm leading-relaxed">
            <code>{`import { VariableFontHover } from '@baneung-pack/effect';

// 가변 폰트(Pretendard Variable / Inter Variable)와 함께 사용 권장
<VariableFontHover
  text="HOVER ME"
  minWeight={300}
  maxWeight={900}
  radius={80}
  fontFamily='"Pretendard Variable", system-ui'
/>`}</code>
          </pre>
        </CardContent>
      </Card>

      <Separator />
      <Heading level={2}>{t('componentShell.apiHeading')}</Heading>
      <Card>
        <CardHeader>
          <CardTitle>VariableFontHoverProps</CardTitle>
        </CardHeader>
        <CardContent>
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
                {PROPS_TABLE.map((row) => (
                  <tr
                    key={row.name}
                    className="border-b border-border-subtle align-top last:border-b-0"
                  >
                    <td className="px-3 py-2 font-mono text-foreground">{row.name}</td>
                    <td className="px-3 py-2 font-mono text-xs">{row.type}</td>
                    <td className="px-3 py-2 font-mono text-xs">{row.default}</td>
                    <td className="px-3 py-2">{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

function PresetCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex min-h-24 items-center justify-center">{children}</div>
      </CardContent>
    </Card>
  );
}

const PROPS_TABLE: { name: string; type: string; default: string; desc: string }[] = [
  { name: 'text', type: 'string', default: '—', desc: '표시할 텍스트 (필수).' },
  { name: 'minWeight', type: 'number', default: '300', desc: '기본/멀리 있을 때 굵기.' },
  { name: 'maxWeight', type: 'number', default: '900', desc: '커서 바로 위 굵기.' },
  { name: 'radius', type: 'number', default: '80', desc: '영향 반경 (px).' },
  { name: 'transitionMs', type: 'number', default: '220', desc: 'font-weight 보간 시간 (ms).' },
  { name: 'fontSize', type: 'string | number', default: '—', desc: '폰트 크기.' },
  { name: 'color', type: 'string', default: '—', desc: '텍스트 색.' },
  {
    name: 'fontFamily',
    type: 'string',
    default: '—',
    desc: '가변 폰트 family 권장 (예: "Pretendard Variable").',
  },
  { name: 'className', type: 'string', default: '—', desc: '추가 클래스.' },
  { name: 'style', type: 'CSSProperties', default: '—', desc: '인라인 style.' },
];
