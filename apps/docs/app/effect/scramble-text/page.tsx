'use client';

import * as React from 'react';

import { ScrambleText } from '@baneung-pack/effect';
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

const PRESETS = {
  alphanum: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  hex: '0123456789ABCDEF',
  binary: '01',
  katakana: 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ',
  symbol: '!@#$%^&*()_+-=[]{}<>?/\\|',
} as const;

export default function ScrambleTextDemoPage() {
  const { t } = useI18n();
  const [text, setText] = React.useState('ACCESS GRANTED');
  const [characters, setCharacters] = React.useState<string>(PRESETS.alphanum);
  const [revealSpeed, setRevealSpeed] = React.useState(80);
  const [scrambleSpeed, setScrambleSpeed] = React.useState(35);
  const [loop, setLoop] = React.useState(true);
  const [fontSize, setFontSize] = React.useState(28);
  const [color, setColor] = React.useState('#16A34A');
  const [fontWeight, setFontWeight] = React.useState(700);
  const [resetKey, setResetKey] = React.useState(0);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>ScrambleText</Heading>
        <Lead>
          랜덤 글자가 빠르게 깜빡이다가 한 글자씩 자리를 찾아가는 해킹/디코딩 효과. 매트릭스/터미널
          느낌의 등장 연출.
        </Lead>
      </header>
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>라이브 미리보기</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div
            className="flex min-h-32 items-center justify-center border border-border-default bg-[#0a0e1a] p-6 font-mono"
            style={{ fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
          >
            <ScrambleText
              text={text}
              characters={characters}
              revealSpeed={revealSpeed}
              scrambleSpeed={scrambleSpeed}
              loop={loop}
              fontSize={fontSize}
              color={color}
              fontWeight={fontWeight}
              resetKey={resetKey}
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

            <Control label="글자 풀 (스크램블 소스)">
              <div className="flex flex-col gap-2">
                <Input
                  value={characters}
                  onChange={(e) => setCharacters(e.target.value)}
                  placeholder="ABC...123!@#"
                />
                <div className="flex flex-wrap gap-1">
                  {Object.entries(PRESETS).map(([k, v]) => (
                    <Button
                      key={k}
                      size="sm"
                      variant="ghost"
                      onClick={() => setCharacters(v)}
                      type="button"
                    >
                      {k}
                    </Button>
                  ))}
                </div>
              </div>
            </Control>

            <Control label={`Reveal 속도 (${revealSpeed}ms/char)`}>
              <input
                type="range"
                min={20}
                max={250}
                step={10}
                value={revealSpeed}
                onChange={(e) => setRevealSpeed(Number(e.target.value))}
                className="w-full"
              />
            </Control>

            <Control label={`Scramble 주기 (${scrambleSpeed}ms)`}>
              <input
                type="range"
                min={16}
                max={120}
                step={1}
                value={scrambleSpeed}
                onChange={(e) => setScrambleSpeed(Number(e.target.value))}
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
              ↻ 처음부터 다시
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <PresetCard title="기본 (1회 디코딩)">
          <ScrambleText text="ACCESS GRANTED" fontSize={22} color="#16A34A" fontWeight={700} />
        </PresetCard>

        <PresetCard title="매트릭스 (카타카나, 루프)">
          <ScrambleText
            text="THE MATRIX"
            characters={PRESETS.katakana}
            loop
            fontSize={22}
            color="#22C55E"
            fontWeight={700}
          />
        </PresetCard>

        <PresetCard title="HEX 디코딩">
          <ScrambleText
            text="0xDEADBEEF"
            characters={PRESETS.hex}
            loop
            fontSize={22}
            color="#F59E0B"
            fontWeight={800}
            style={{ fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
          />
        </PresetCard>

        <PresetCard title="바이너리 (느린 reveal)">
          <ScrambleText
            text="01001000 01101001"
            characters={PRESETS.binary}
            revealSpeed={120}
            loop
            fontSize={18}
            color="#3B82F6"
            style={{ fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
          />
        </PresetCard>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>사용</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto bg-surface p-4 text-sm leading-relaxed">
            <code>{`import { ScrambleText } from '@baneung-pack/effect';

<ScrambleText text="ACCESS GRANTED" color="#16A34A" fontSize={24} />

// 매트릭스 스타일 (카타카나)
<ScrambleText
  text="THE MATRIX"
  characters="ｱｲｳｴｵｶｷｸｹｺ..."
  loop
  color="#22C55E"
/>`}</code>
          </pre>
        </CardContent>
      </Card>

      <Separator />
      <Heading level={2}>{t('componentShell.apiHeading')}</Heading>
      <Card>
        <CardHeader>
          <CardTitle>ScrambleTextProps</CardTitle>
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
        <div
          className="flex min-h-20 items-center justify-center bg-[#0a0e1a] p-4"
          style={{ fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
        >
          {children}
        </div>
      </CardContent>
    </Card>
  );
}

const PROPS_TABLE: { name: string; type: string; default: string; desc: string }[] = [
  { name: 'text', type: 'string', default: '—', desc: '최종 표시할 텍스트 (필수).' },
  {
    name: 'characters',
    type: 'string',
    default: 'A-Z 0-9 !@#$%^&*<>?/\\\\',
    desc: '스크램블에 사용할 글자 풀.',
  },
  { name: 'revealSpeed', type: 'number', default: '60', desc: '글자 자리잡힘 속도 (ms/char).' },
  { name: 'scrambleSpeed', type: 'number', default: '35', desc: '스크램블 갱신 주기 (ms).' },
  { name: 'loop', type: 'boolean', default: 'false', desc: 'true면 다 푼 뒤 잠시 멈췄다 다시.' },
  {
    name: 'pauseAfterRevealMs',
    type: 'number',
    default: '2500',
    desc: 'loop 모드의 reveal 후 대기 시간 (ms).',
  },
  { name: 'resetKey', type: 'number | string', default: '—', desc: '값 변경 시 처음부터 재시작.' },
  { name: 'fontSize', type: 'string | number', default: '—', desc: '폰트 크기.' },
  { name: 'fontWeight', type: "CSSProperties['fontWeight']", default: '—', desc: '폰트 굵기.' },
  { name: 'color', type: 'string', default: '—', desc: '텍스트 색.' },
  { name: 'className', type: 'string', default: '—', desc: '추가 클래스.' },
  { name: 'style', type: 'CSSProperties', default: '—', desc: '인라인 style.' },
];
