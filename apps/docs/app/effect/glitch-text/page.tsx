'use client';

import * as React from 'react';

import { GlitchText } from '@baneung-pack/effect';
import {
  Button,
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

type TriggerOn = 'always' | 'hover';

export default function GlitchTextDemoPage() {
  const { t } = useI18n();
  const [text, setText] = React.useState('SYSTEM FAILURE');
  const [intensity, setIntensity] = React.useState(0.6);
  const [triggerOn, setTriggerOn] = React.useState<TriggerOn>('always');
  const [speedMs, setSpeedMs] = React.useState(2200);
  const [redChannelColor, setRedChannelColor] = React.useState('#ff003c');
  const [cyanChannelColor, setCyanChannelColor] = React.useState('#00fbff');
  const [fontSize, setFontSize] = React.useState(40);
  const [color, setColor] = React.useState('#ffffff');
  const [fontWeight, setFontWeight] = React.useState(800);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>GlitchText</Heading>
        <Lead>
          RGB 채널이 어긋나는 글리치 효과. 강도(intensity) 조절 가능, 항상 또는 hover 시에만 트리거.
        </Lead>
      </header>
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>라이브 미리보기</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* 다크 배경 — 글리치 효과는 다크 위에서 선명함 */}
          <div className="flex min-h-32 items-center justify-center border border-border-default bg-[#0a0e1a] p-6">
            <GlitchText
              text={text}
              intensity={intensity}
              triggerOn={triggerOn}
              speedMs={speedMs}
              redChannelColor={redChannelColor}
              cyanChannelColor={cyanChannelColor}
              fontSize={fontSize}
              color={color}
              fontWeight={fontWeight}
              style={{ fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Control label="텍스트">
              <Input value={text} onChange={(e) => setText(e.target.value)} maxLength={60} />
            </Control>

            <Control label="트리거">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={triggerOn === 'always' ? 'primary' : 'ghost'}
                  onClick={() => setTriggerOn('always')}
                >
                  always
                </Button>
                <Button
                  size="sm"
                  variant={triggerOn === 'hover' ? 'primary' : 'ghost'}
                  onClick={() => setTriggerOn('hover')}
                >
                  hover
                </Button>
              </div>
            </Control>

            <Control label={`Intensity (${intensity.toFixed(2)})`}>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full"
              />
            </Control>

            <Control label={`Speed (${speedMs}ms)`}>
              <input
                type="range"
                min={300}
                max={5000}
                step={100}
                value={speedMs}
                onChange={(e) => setSpeedMs(Number(e.target.value))}
                className="w-full"
              />
            </Control>

            <Control label="적색 채널">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={redChannelColor}
                  onChange={(e) => setRedChannelColor(e.target.value)}
                  className="h-10 w-12 cursor-pointer border border-border-default p-1"
                  aria-label="적색 채널"
                />
                <Input
                  value={redChannelColor}
                  onChange={(e) => setRedChannelColor(e.target.value)}
                />
              </div>
            </Control>

            <Control label="청록 채널">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={cyanChannelColor}
                  onChange={(e) => setCyanChannelColor(e.target.value)}
                  className="h-10 w-12 cursor-pointer border border-border-default p-1"
                  aria-label="청록 채널"
                />
                <Input
                  value={cyanChannelColor}
                  onChange={(e) => setCyanChannelColor(e.target.value)}
                />
              </div>
            </Control>

            <Control label={`글자 크기 (${fontSize}px)`}>
              <input
                type="range"
                min={16}
                max={80}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full"
              />
            </Control>

            <Control label={`굵기 (${fontWeight})`}>
              <input
                type="range"
                min={100}
                max={900}
                step={100}
                value={fontWeight}
                onChange={(e) => setFontWeight(Number(e.target.value))}
                className="w-full"
              />
            </Control>

            <Control label="베이스 색">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-10 w-12 cursor-pointer border border-border-default p-1"
                  aria-label="베이스 색"
                />
                <Input value={color} onChange={(e) => setColor(e.target.value)} />
              </div>
            </Control>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <PresetCard title="강한 글리치 (always)">
          <GlitchText
            text="ERROR 404"
            intensity={0.9}
            fontSize={32}
            color="#ffffff"
            fontWeight={900}
            style={{ fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
          />
        </PresetCard>

        <PresetCard title="약한 글리치 (subtle)">
          <GlitchText
            text="MATRIX"
            intensity={0.25}
            fontSize={32}
            color="#22C55E"
            fontWeight={800}
            style={{ fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
          />
        </PresetCard>

        <PresetCard title="hover 트리거 (마우스를 올려보세요)">
          <GlitchText
            text="HOVER ME"
            triggerOn="hover"
            intensity={0.7}
            fontSize={28}
            color="#ffffff"
            fontWeight={800}
            style={{ fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
          />
        </PresetCard>

        <PresetCard title="브랜드 컬러 채널">
          <GlitchText
            text="BANEUNG"
            intensity={0.5}
            redChannelColor="#FF2D78"
            cyanChannelColor="#5BA8A0"
            fontSize={32}
            color="#ffffff"
            fontWeight={900}
          />
        </PresetCard>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>사용</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto bg-surface p-4 text-sm leading-relaxed">
            <code>{`import { GlitchText } from '@baneung-pack/effect';

// 기본 글리치
<GlitchText text="SYSTEM FAILURE" intensity={0.6} />

// hover 시에만 트리거
<GlitchText text="HOVER ME" triggerOn="hover" intensity={0.7} />

// 커스텀 채널 색
<GlitchText
  text="BANEUNG"
  redChannelColor="#FF2D78"
  cyanChannelColor="#5BA8A0"
/>`}</code>
          </pre>
        </CardContent>
      </Card>

      <Separator />
      <Heading level={2}>{t('componentShell.apiHeading')}</Heading>
      <Card>
        <CardHeader>
          <CardTitle>GlitchTextProps</CardTitle>
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
        <div className="flex min-h-24 items-center justify-center bg-[#0a0e1a] p-4">{children}</div>
      </CardContent>
    </Card>
  );
}

const PROPS_TABLE: { name: string; type: string; default: string; desc: string }[] = [
  { name: 'text', type: 'string', default: '—', desc: '표시할 텍스트 (필수).' },
  { name: 'intensity', type: 'number', default: '0.5', desc: '글리치 강도 (0~1).' },
  {
    name: 'triggerOn',
    type: "'always' | 'hover'",
    default: "'always'",
    desc: '항상 / hover 시에만 글리치.',
  },
  { name: 'speedMs', type: 'number', default: '2200', desc: '베이스 애니메이션 시간 (ms).' },
  { name: 'redChannelColor', type: 'string', default: "'#ff003c'", desc: '적색 채널 색상.' },
  { name: 'cyanChannelColor', type: 'string', default: "'#00fbff'", desc: '청록 채널 색상.' },
  { name: 'fontSize', type: 'string | number', default: '—', desc: '폰트 크기.' },
  { name: 'fontWeight', type: "CSSProperties['fontWeight']", default: '—', desc: '폰트 굵기.' },
  { name: 'color', type: 'string', default: 'currentColor', desc: '베이스 텍스트 색.' },
  { name: 'className', type: 'string', default: '—', desc: '추가 클래스.' },
  { name: 'style', type: 'CSSProperties', default: '—', desc: '인라인 style.' },
];
