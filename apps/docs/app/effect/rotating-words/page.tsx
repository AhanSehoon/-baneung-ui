'use client';

import * as React from 'react';

import { RotatingWords } from '@baneung-pack/effect';
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

/**
 * /effect/rotating-words — RotatingWords 라이브 데모.
 */
export default function RotatingWordsDemoPage() {
  const { t } = useI18n();
  const [wordsText, setWordsText] = React.useState('apps, agents, websites, design systems');
  const [intervalMs, setIntervalMs] = React.useState(2000);
  const [transitionMs, setTransitionMs] = React.useState(400);
  const [loop, setLoop] = React.useState(true);
  const [fontSize, setFontSize] = React.useState(28);
  const [color, setColor] = React.useState('#3B716C');
  const [fontWeight, setFontWeight] = React.useState(700);

  const words = wordsText
    .split(',')
    .map((w) => w.trim())
    .filter(Boolean);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>RotatingWords</Heading>
        <Lead>
          고정 문구 뒤의 단어만 위로 슬라이드 + 페이드로 순환. 히어로 카피의 &quot;We build
          [apps]&quot; 같은 패턴.
        </Lead>
      </header>
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>라이브 미리보기</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex min-h-32 items-center border border-border-default bg-surface p-6 text-xl font-medium">
            <span>We build&nbsp;</span>
            <RotatingWords
              words={words}
              intervalMs={intervalMs}
              transitionMs={transitionMs}
              loop={loop}
              fontSize={fontSize}
              fontWeight={fontWeight}
              color={color}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Control label="단어 (콤마로 구분)">
              <Input
                value={wordsText}
                onChange={(e) => setWordsText(e.target.value)}
                placeholder="apps, agents, sites"
              />
            </Control>

            <Control label="모드">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={!loop ? 'primary' : 'ghost'}
                  onClick={() => setLoop(false)}
                >
                  1회
                </Button>
                <Button
                  size="sm"
                  variant={loop ? 'primary' : 'ghost'}
                  onClick={() => setLoop(true)}
                >
                  Loop
                </Button>
              </div>
            </Control>

            <Control label={`체류 시간 (${intervalMs}ms)`}>
              <input
                type="range"
                min={500}
                max={6000}
                step={100}
                value={intervalMs}
                onChange={(e) => setIntervalMs(Number(e.target.value))}
                className="w-full"
              />
            </Control>

            <Control label={`전환 시간 (${transitionMs}ms)`}>
              <input
                type="range"
                min={150}
                max={1200}
                step={50}
                value={transitionMs}
                onChange={(e) => setTransitionMs(Number(e.target.value))}
                className="w-full"
              />
            </Control>

            <Control label={`글자 크기 (${fontSize}px)`}>
              <input
                type="range"
                min={14}
                max={60}
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
        <PresetCard title="기본 (느린 전환)">
          <span className="text-xl font-semibold">
            We build{' '}
            <RotatingWords
              words={['apps', 'agents', 'websites']}
              fontSize={22}
              color="#3B716C"
              fontWeight={700}
            />
          </span>
        </PresetCard>

        <PresetCard title="빠른 전환 + brand navy">
          <span className="text-xl font-semibold">
            Built for{' '}
            <RotatingWords
              words={['React', 'Next.js', 'Remix']}
              intervalMs={1400}
              transitionMs={280}
              fontSize={22}
              color="#1F2937"
              fontWeight={800}
            />
          </span>
        </PresetCard>

        <PresetCard title="1회 모드 (마지막에서 정지)">
          <span className="text-xl font-semibold">
            <RotatingWords
              words={['시작합니다', '준비합니다', '완성합니다']}
              loop={false}
              fontSize={22}
              fontWeight={700}
              color="#1F2937"
            />
          </span>
        </PresetCard>

        <PresetCard title="긴 문구 (자동 폭 확보)">
          <span className="text-lg">
            우리는{' '}
            <RotatingWords
              words={['실용적인 솔루션', '확장 가능한 시스템', '아름다운 인터페이스']}
              fontSize={18}
              color="#5BA8A0"
              fontWeight={600}
            />
            을 만듭니다
          </span>
        </PresetCard>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>사용</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto bg-surface p-4 text-sm leading-relaxed">
            <code>{`import { RotatingWords } from '@baneung-pack/effect';

<span>
  We build{' '}
  <RotatingWords
    words={['apps', 'agents', 'websites']}
    intervalMs={2000}
    transitionMs={400}
    fontSize={24}
    color="#3B716C"
    fontWeight={700}
  />
</span>`}</code>
          </pre>
        </CardContent>
      </Card>

      <Separator />
      <Heading level={2}>{t('componentShell.apiHeading')}</Heading>
      <Card>
        <CardHeader>
          <CardTitle>RotatingWordsProps</CardTitle>
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
        <div className="flex min-h-20 items-center">{children}</div>
      </CardContent>
    </Card>
  );
}

const PROPS_TABLE: { name: string; type: string; default: string; desc: string }[] = [
  { name: 'words', type: 'string[]', default: '—', desc: '순환할 단어 배열 (필수, 최소 1개).' },
  { name: 'intervalMs', type: 'number', default: '2000', desc: '단어 하나가 보이는 시간 (ms).' },
  { name: 'transitionMs', type: 'number', default: '400', desc: '전환 애니메이션 시간 (ms).' },
  {
    name: 'loop',
    type: 'boolean',
    default: 'true',
    desc: 'true면 무한 반복. false면 마지막에서 정지.',
  },
  { name: 'fontSize', type: 'string | number', default: '—', desc: '폰트 크기. number는 px.' },
  { name: 'fontWeight', type: "CSSProperties['fontWeight']", default: '—', desc: '폰트 굵기.' },
  { name: 'color', type: 'string', default: '—', desc: '텍스트 색.' },
  { name: 'className', type: 'string', default: '—', desc: '추가 클래스.' },
  { name: 'style', type: 'CSSProperties', default: '—', desc: '인라인 style (위 props보다 우선).' },
];
