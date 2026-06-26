'use client';

import * as React from 'react';

import { BlurInText } from '@baneung-pack/effect';
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

type By = 'char' | 'word' | 'all';

export default function BlurInTextDemoPage() {
  const { t } = useI18n();
  const [text, setText] = React.useState('흐릿하게 시작해 선명하게 등장합니다');
  const [by, setBy] = React.useState<By>('word');
  const [stagger, setStagger] = React.useState(80);
  const [duration, setDuration] = React.useState(700);
  const [blurAmount, setBlurAmount] = React.useState(10);
  const [fontSize, setFontSize] = React.useState(28);
  const [color, setColor] = React.useState('#1F2937');
  const [fontWeight, setFontWeight] = React.useState(700);
  const [resetKey, setResetKey] = React.useState(0);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>BlurInText</Heading>
        <Lead>
          흐릿한 상태에서 선명해지며 등장하는 텍스트 효과. 마운트 또는 스크롤 진입 시 발사.
        </Lead>
      </header>
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>라이브 미리보기 (mount 트리거)</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex min-h-32 items-center border border-border-default bg-surface p-6">
            <BlurInText
              key={resetKey}
              text={text}
              by={by}
              stagger={stagger}
              duration={duration}
              blurAmount={blurAmount}
              fontSize={fontSize}
              color={color}
              fontWeight={fontWeight}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Control label="텍스트">
              <Input value={text} onChange={(e) => setText(e.target.value)} maxLength={120} />
            </Control>

            <Control label="분할 단위">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={by === 'char' ? 'primary' : 'ghost'}
                  onClick={() => setBy('char')}
                >
                  char
                </Button>
                <Button
                  size="sm"
                  variant={by === 'word' ? 'primary' : 'ghost'}
                  onClick={() => setBy('word')}
                >
                  word
                </Button>
                <Button
                  size="sm"
                  variant={by === 'all' ? 'primary' : 'ghost'}
                  onClick={() => setBy('all')}
                >
                  all
                </Button>
              </div>
            </Control>

            <Control label={`Stagger (${stagger}ms)`}>
              <input
                type="range"
                min={0}
                max={300}
                step={10}
                value={stagger}
                onChange={(e) => setStagger(Number(e.target.value))}
                className="w-full"
                disabled={by === 'all'}
              />
            </Control>

            <Control label={`Duration (${duration}ms)`}>
              <input
                type="range"
                min={200}
                max={2000}
                step={50}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full"
              />
            </Control>

            <Control label={`Blur 강도 (${blurAmount}px)`}>
              <input
                type="range"
                min={2}
                max={30}
                value={blurAmount}
                onChange={(e) => setBlurAmount(Number(e.target.value))}
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

          <div>
            <Button variant="ghost" size="sm" onClick={() => setResetKey((k) => k + 1)}>
              ↻ 다시 발사
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <PresetCard title="word (기본)">
          <BlurInText
            text="Hello, BANEUNG world!"
            by="word"
            fontSize={22}
            fontWeight={700}
            color="#1F2937"
          />
        </PresetCard>

        <PresetCard title="char (글자 단위)">
          <BlurInText
            text="ANGULAR"
            by="char"
            stagger={60}
            fontSize={32}
            fontWeight={900}
            color="#3B716C"
          />
        </PresetCard>

        <PresetCard title="all (한 덩어리)">
          <BlurInText
            text="조용히 한꺼번에 선명해짐"
            by="all"
            duration={1000}
            blurAmount={14}
            fontSize={22}
            color="#5BA8A0"
            fontWeight={600}
          />
        </PresetCard>

        <PresetCard title="강한 blur (드라마틱)">
          <BlurInText
            text="DRAMATIC"
            by="char"
            stagger={120}
            duration={900}
            blurAmount={20}
            fontSize={32}
            fontWeight={900}
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
            <code>{`import { BlurInText } from '@baneung-pack/effect';

// 단어 단위 (기본)
<BlurInText text="Hello, BANEUNG world!" fontSize={32} fontWeight={700} />

// 글자 단위 + 강한 blur
<BlurInText text="ANGULAR" by="char" stagger={60} blurAmount={14} />

// 전체 한 덩어리 + 스크롤 트리거
<BlurInText text="조용히 등장" by="all" trigger="inView" />`}</code>
          </pre>
        </CardContent>
      </Card>

      <Separator />
      <Heading level={2}>{t('componentShell.apiHeading')}</Heading>
      <Card>
        <CardHeader>
          <CardTitle>BlurInTextProps</CardTitle>
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
  { name: 'text', type: 'string', default: '—', desc: '표시할 텍스트 (필수).' },
  { name: 'by', type: "'char' | 'word' | 'all'", default: "'word'", desc: '분할 단위.' },
  { name: 'stagger', type: 'number', default: '50', desc: '항목 간 시차 (ms). by="all"이면 무시.' },
  { name: 'duration', type: 'number', default: '600', desc: '항목 하나의 애니메이션 시간 (ms).' },
  { name: 'blurAmount', type: 'number', default: '8', desc: '시작 blur 강도 (px).' },
  {
    name: 'trigger',
    type: "'mount' | 'inView'",
    default: "'mount'",
    desc: '발사 시점.',
  },
  { name: 'threshold', type: 'number', default: '0.15', desc: 'inView 임계값 (0~1).' },
  { name: 'fontSize', type: 'string | number', default: '—', desc: '폰트 크기.' },
  { name: 'fontWeight', type: "CSSProperties['fontWeight']", default: '—', desc: '폰트 굵기.' },
  { name: 'color', type: 'string', default: '—', desc: '텍스트 색.' },
  { name: 'className', type: 'string', default: '—', desc: '추가 클래스.' },
  { name: 'style', type: 'CSSProperties', default: '—', desc: '인라인 style.' },
];
