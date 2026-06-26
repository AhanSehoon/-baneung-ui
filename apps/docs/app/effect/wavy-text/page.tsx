'use client';

import * as React from 'react';

import { WavyText } from '@baneung-pack/effect';
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

type Mode = 'wave' | 'bounce';

export default function WavyTextDemoPage() {
  const { t } = useI18n();
  const [text, setText] = React.useState('파도치는 글자입니다');
  const [mode, setMode] = React.useState<Mode>('wave');
  const [amplitude, setAmplitude] = React.useState(0.3);
  const [duration, setDuration] = React.useState(2000);
  const [phaseStep, setPhaseStep] = React.useState(0.08);
  const [fontSize, setFontSize] = React.useState(32);
  const [color, setColor] = React.useState('#3B716C');
  const [fontWeight, setFontWeight] = React.useState(800);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>WavyText</Heading>
        <Lead>
          글자들이 파도치듯(또는 통통 튀듯) 무한 반복하는 효과. 위상 차이로 자연스러운 파동 연출.
        </Lead>
      </header>
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>라이브 미리보기</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex min-h-32 items-center justify-center border border-border-default bg-surface p-6">
            <WavyText
              text={text}
              mode={mode}
              amplitude={amplitude}
              duration={duration}
              phaseStep={phaseStep}
              fontSize={fontSize}
              color={color}
              fontWeight={fontWeight}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Control label="텍스트">
              <Input value={text} onChange={(e) => setText(e.target.value)} maxLength={60} />
            </Control>

            <Control label="모드">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={mode === 'wave' ? 'primary' : 'ghost'}
                  onClick={() => setMode('wave')}
                >
                  Wave (사인)
                </Button>
                <Button
                  size="sm"
                  variant={mode === 'bounce' ? 'primary' : 'ghost'}
                  onClick={() => setMode('bounce')}
                >
                  Bounce (튀김)
                </Button>
              </div>
            </Control>

            <Control label={`진폭 (${amplitude}em)`}>
              <input
                type="range"
                min={0.05}
                max={0.8}
                step={0.05}
                value={amplitude}
                onChange={(e) => setAmplitude(Number(e.target.value))}
                className="w-full"
              />
            </Control>

            <Control label={`Duration (${duration}ms)`}>
              <input
                type="range"
                min={400}
                max={5000}
                step={100}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full"
              />
            </Control>

            <Control label={`Phase step (${phaseStep.toFixed(2)})`}>
              <input
                type="range"
                min={0}
                max={0.3}
                step={0.01}
                value={phaseStep}
                onChange={(e) => setPhaseStep(Number(e.target.value))}
                className="w-full"
              />
            </Control>

            <Control label={`글자 크기 (${fontSize}px)`}>
              <input
                type="range"
                min={14}
                max={72}
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
        <PresetCard title="Wave (기본 파도)">
          <WavyText text="BANEUNG WAVE" fontSize={28} fontWeight={800} color="#3B716C" />
        </PresetCard>

        <PresetCard title="Bounce (통통 튀김)">
          <WavyText text="BOUNCE!" mode="bounce" fontSize={32} fontWeight={900} color="#F59E0B" />
        </PresetCard>

        <PresetCard title="큰 진폭, 느린 속도">
          <WavyText
            text="ocean"
            amplitude={0.6}
            duration={3500}
            phaseStep={0.1}
            fontSize={42}
            fontWeight={700}
            color="#5BA8A0"
          />
        </PresetCard>

        <PresetCard title="작은 진폭, 빠른 속도">
          <WavyText
            text="vibration"
            amplitude={0.1}
            duration={700}
            phaseStep={0.04}
            fontSize={26}
            fontWeight={700}
            color="#1F2937"
          />
        </PresetCard>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>사용</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto bg-surface p-4 text-sm leading-relaxed">
            <code>{`import { WavyText } from '@baneung-pack/effect';

// 기본 wave
<WavyText text="BANEUNG WAVE" fontSize={36} fontWeight={800} color="#3B716C" />

// bounce 모드
<WavyText text="BOUNCE!" mode="bounce" amplitude={0.4} duration={1200} />

// 큰 진폭 + 느린 속도
<WavyText text="ocean" amplitude={0.6} duration={3500} />`}</code>
          </pre>
        </CardContent>
      </Card>

      <Separator />
      <Heading level={2}>{t('componentShell.apiHeading')}</Heading>
      <Card>
        <CardHeader>
          <CardTitle>WavyTextProps</CardTitle>
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
  { name: 'mode', type: "'wave' | 'bounce'", default: "'wave'", desc: '움직임 곡선.' },
  { name: 'amplitude', type: 'number', default: '0.25', desc: '진폭 (em). 위아래 움직임 폭.' },
  { name: 'duration', type: 'number', default: '2000', desc: '한 사이클 완료 시간 (ms).' },
  {
    name: 'phaseStep',
    type: 'number',
    default: '0.08',
    desc: '글자 간 위상 차이 (한 사이클 비율).',
  },
  { name: 'fontSize', type: 'string | number', default: '—', desc: '폰트 크기.' },
  { name: 'fontWeight', type: "CSSProperties['fontWeight']", default: '—', desc: '폰트 굵기.' },
  { name: 'color', type: 'string', default: '—', desc: '텍스트 색.' },
  { name: 'className', type: 'string', default: '—', desc: '추가 클래스.' },
  { name: 'style', type: 'CSSProperties', default: '—', desc: '인라인 style.' },
];
