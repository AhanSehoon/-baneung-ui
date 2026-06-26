'use client';

import * as React from 'react';

import { SplitTextReveal } from '@baneung-pack/effect';
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
import { ScrollHint } from '@/components/scroll-hint';

export default function SplitTextRevealDemoPage() {
  const { t } = useI18n();
  const [text, setText] = React.useState('바능 디자인 시스템으로 멋진 UI를 만드세요.');
  const [by, setBy] = React.useState<'char' | 'word'>('char');
  const [stagger, setStagger] = React.useState(40);
  const [duration, setDuration] = React.useState(450);
  const [fontSize, setFontSize] = React.useState(28);
  const [color, setColor] = React.useState('#1F2937');
  const [fontWeight, setFontWeight] = React.useState(700);
  // mount 트리거의 라이브 데모 — 매번 reset key 바꿔서 다시 발사.
  const [resetKey, setResetKey] = React.useState(0);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>SplitTextReveal</Heading>
        <Lead>
          글자 또는 단어 단위로 순차적으로 페이드 + 슬라이드 인. 마운트 또는 스크롤로 들어올 때
          발사.
        </Lead>
      </header>
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>라이브 미리보기 (mount 트리거)</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex min-h-32 items-center border border-border-default bg-surface p-6">
            {/* key 변경으로 SplitTextReveal 재마운트 → 애니메이션 재시작. */}
            <SplitTextReveal
              key={resetKey}
              text={text}
              by={by}
              stagger={stagger}
              duration={duration}
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
                  글자 (char)
                </Button>
                <Button
                  size="sm"
                  variant={by === 'word' ? 'primary' : 'ghost'}
                  onClick={() => setBy('word')}
                >
                  단어 (word)
                </Button>
              </div>
            </Control>

            <Control label={`Stagger (${stagger}ms)`}>
              <input
                type="range"
                min={0}
                max={200}
                step={5}
                value={stagger}
                onChange={(e) => setStagger(Number(e.target.value))}
                className="w-full"
              />
            </Control>

            <Control label={`Duration (${duration}ms)`}>
              <input
                type="range"
                min={100}
                max={1500}
                step={50}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full"
              />
            </Control>

            <Control label={`글자 크기 (${fontSize}px)`}>
              <input
                type="range"
                min={14}
                max={48}
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

      {/* inView 트리거 — 스크롤해서 화면 안에 들어오면 발사 */}
      <Card>
        <CardHeader>
          <CardTitle>inView 트리거 (스크롤 reveal)</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-foreground-muted">
            아래 카드들은 화면에 들어올 때 한 번만 발사됩니다. 스크롤하며 확인해보세요.
          </p>
          <div className="py-8">
            {[
              { text: '먼저, 스크롤하세요.', color: '#1F2937' },
              { text: '글자가 하나씩 등장합니다.', color: '#3B716C' },
              { text: '각 섹션은 한 번만 발사됩니다.', color: '#5BA8A0' },
              { text: '스크롤로 reveal하는 마지막 줄.', color: '#1F2937' },
            ].map((item, i, arr) => (
              <React.Fragment key={i}>
                <div className="flex min-h-32 items-center border border-border-default bg-surface p-6">
                  <SplitTextReveal
                    text={item.text}
                    trigger="inView"
                    fontSize={26}
                    fontWeight={700}
                    color={item.color}
                    stagger={35}
                  />
                </div>
                {/* 마지막 카드 뒤엔 ScrollHint 없음 — 더 내릴 게 없음. */}
                {i < arr.length - 1 && (
                  <div className="flex h-[40vh] items-center justify-center">
                    <ScrollHint />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <PresetCard title="char (기본)">
          <SplitTextReveal text="Hello, BANEUNG!" fontSize={22} fontWeight={700} />
        </PresetCard>

        <PresetCard title="word (단어 단위)">
          <SplitTextReveal
            text="We build apps for the modern web."
            by="word"
            stagger={80}
            fontSize={20}
            color="#3B716C"
            fontWeight={600}
          />
        </PresetCard>

        <PresetCard title="빠른 stagger (10ms)">
          <SplitTextReveal
            text="빠르게 한꺼번에 흐릅니다"
            stagger={10}
            fontSize={22}
            color="#1F2937"
            fontWeight={700}
          />
        </PresetCard>

        <PresetCard title="느린 stagger + 큰 글자">
          <SplitTextReveal
            text="WELCOME"
            stagger={120}
            duration={600}
            fontSize={36}
            color="#5BA8A0"
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
            <code>{`import { SplitTextReveal } from '@baneung-pack/effect';

// 마운트 즉시 (기본)
<SplitTextReveal text="Hello, BANEUNG!" fontSize={28} fontWeight={700} />

// 단어 단위 + 스크롤 트리거
<SplitTextReveal
  text="We build apps for the modern web."
  by="word"
  trigger="inView"
  stagger={80}
/>`}</code>
          </pre>
        </CardContent>
      </Card>

      <Separator />
      <Heading level={2}>{t('componentShell.apiHeading')}</Heading>
      <Card>
        <CardHeader>
          <CardTitle>SplitTextRevealProps</CardTitle>
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
  { name: 'by', type: "'char' | 'word'", default: "'char'", desc: '분할 단위.' },
  { name: 'stagger', type: 'number', default: '30', desc: '항목 간 시작 시차 (ms).' },
  { name: 'duration', type: 'number', default: '400', desc: '항목 하나의 애니메이션 시간 (ms).' },
  {
    name: 'trigger',
    type: "'mount' | 'inView'",
    default: "'mount'",
    desc: '발사 시점 — mount 즉시 / 화면 진입 시.',
  },
  { name: 'threshold', type: 'number', default: '0.15', desc: 'inView 임계값 (0~1).' },
  { name: 'fontSize', type: 'string | number', default: '—', desc: '폰트 크기.' },
  { name: 'fontWeight', type: "CSSProperties['fontWeight']", default: '—', desc: '폰트 굵기.' },
  { name: 'color', type: 'string', default: '—', desc: '텍스트 색.' },
  { name: 'className', type: 'string', default: '—', desc: '추가 클래스.' },
  { name: 'style', type: 'CSSProperties', default: '—', desc: '인라인 style.' },
];
