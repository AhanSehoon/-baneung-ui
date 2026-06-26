'use client';

import * as React from 'react';

import { GradientText } from '@baneung-pack/effect';
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

type Direction = 'horizontal' | 'vertical' | 'diagonal';
type Mode = 'flow' | 'shimmer';

export default function GradientTextDemoPage() {
  const { t } = useI18n();
  const [text, setText] = React.useState('BANEUNG DESIGN SYSTEM');
  const [mode, setMode] = React.useState<Mode>('flow');
  const [colorsText, setColorsText] = React.useState('#1F2937, #3B716C, #5BA8A0, #85C9BD, #1F2937');
  const [direction, setDirection] = React.useState<Direction>('horizontal');
  const [durationMs, setDurationMs] = React.useState(3000);
  const [shimmerColor, setShimmerColor] = React.useState('#ffffff');
  const [baseColor, setBaseColor] = React.useState('#1F2937');
  const [fontSize, setFontSize] = React.useState(40);
  const [fontWeight, setFontWeight] = React.useState(800);

  const colors = colorsText
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>GradientText</Heading>
        <Lead>
          그라데이션이 글자 위를 흐르거나 반짝이며 지나가는 효과. 히어로 타이틀·CTA 강조에 사용.
        </Lead>
      </header>
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>라이브 미리보기</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex min-h-32 items-center justify-center border border-border-default bg-surface p-6">
            <GradientText
              text={text}
              mode={mode}
              colors={colors}
              direction={direction}
              durationMs={durationMs}
              shimmerColor={shimmerColor}
              baseColor={baseColor}
              fontSize={fontSize}
              fontWeight={fontWeight}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Control label="텍스트">
              <Input value={text} onChange={(e) => setText(e.target.value)} maxLength={80} />
            </Control>

            <Control label="모드">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={mode === 'flow' ? 'primary' : 'ghost'}
                  onClick={() => setMode('flow')}
                >
                  Flow (색 순환)
                </Button>
                <Button
                  size="sm"
                  variant={mode === 'shimmer' ? 'primary' : 'ghost'}
                  onClick={() => setMode('shimmer')}
                >
                  Shimmer (반짝)
                </Button>
              </div>
            </Control>

            <Control label="흐름 방향">
              <div className="flex gap-2">
                {(['horizontal', 'vertical', 'diagonal'] as Direction[]).map((d) => (
                  <Button
                    key={d}
                    size="sm"
                    variant={direction === d ? 'primary' : 'ghost'}
                    onClick={() => setDirection(d)}
                  >
                    {d}
                  </Button>
                ))}
              </div>
            </Control>

            <Control label={`Duration (${durationMs}ms)`}>
              <input
                type="range"
                min={500}
                max={8000}
                step={100}
                value={durationMs}
                onChange={(e) => setDurationMs(Number(e.target.value))}
                className="w-full"
              />
            </Control>

            {mode === 'flow' ? (
              <Control label="Flow 색상 (콤마로 구분)">
                <Input
                  value={colorsText}
                  onChange={(e) => setColorsText(e.target.value)}
                  placeholder="#1F2937, #5BA8A0, ..."
                />
              </Control>
            ) : (
              <>
                <Control label="Shimmer 베이스 색">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={baseColor}
                      onChange={(e) => setBaseColor(e.target.value)}
                      className="h-10 w-12 cursor-pointer border border-border-default p-1"
                      aria-label="베이스 색 선택"
                    />
                    <Input value={baseColor} onChange={(e) => setBaseColor(e.target.value)} />
                  </div>
                </Control>
                <Control label="Shimmer 빛 색상">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={shimmerColor}
                      onChange={(e) => setShimmerColor(e.target.value)}
                      className="h-10 w-12 cursor-pointer border border-border-default p-1"
                      aria-label="빛 색상 선택"
                    />
                    <Input value={shimmerColor} onChange={(e) => setShimmerColor(e.target.value)} />
                  </div>
                </Control>
              </>
            )}

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
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <PresetCard title="Flow — 브랜드 navy → teal">
          <GradientText text="BANEUNG" fontSize={36} fontWeight={900} />
        </PresetCard>

        <PresetCard title="Flow — vibrant 무지개">
          <GradientText
            text="REACT · TYPESCRIPT"
            colors={['#FF2D78', '#A21CAF', '#3D5BFF', '#06B6D4', '#16A34A', '#F59E0B', '#FF2D78']}
            fontSize={26}
            fontWeight={800}
            durationMs={5000}
          />
        </PresetCard>

        <PresetCard title="Shimmer — premium 다크">
          <GradientText
            text="PREMIUM ACCESS"
            mode="shimmer"
            baseColor="#1F2937"
            shimmerColor="#FFD700"
            fontSize={28}
            fontWeight={800}
            durationMs={2500}
          />
        </PresetCard>

        <PresetCard title="Diagonal flow">
          <GradientText
            text="ANGULAR DESIGN"
            direction="diagonal"
            colors={['#1F2937', '#3B716C', '#85C9BD', '#1F2937']}
            fontSize={28}
            fontWeight={800}
          />
        </PresetCard>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>사용</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto bg-surface p-4 text-sm leading-relaxed">
            <code>{`import { GradientText } from '@baneung-pack/effect';

// flow — 브랜드 색 순환
<GradientText text="BANEUNG" fontSize={48} fontWeight={900} />

// flow — 커스텀 색상
<GradientText
  text="React · TypeScript"
  colors={['#FF2D78', '#A21CAF', '#3D5BFF', '#FF2D78']}
  durationMs={4000}
/>

// shimmer — 반짝이는 빛
<GradientText
  text="PREMIUM"
  mode="shimmer"
  baseColor="#1F2937"
  shimmerColor="#FFD700"
/>`}</code>
          </pre>
        </CardContent>
      </Card>

      <Separator />
      <Heading level={2}>{t('componentShell.apiHeading')}</Heading>
      <Card>
        <CardHeader>
          <CardTitle>GradientTextProps</CardTitle>
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
        <div className="flex min-h-20 items-center justify-center">{children}</div>
      </CardContent>
    </Card>
  );
}

const PROPS_TABLE: { name: string; type: string; default: string; desc: string }[] = [
  { name: 'text', type: 'string', default: '—', desc: '표시할 텍스트 (필수).' },
  { name: 'mode', type: "'flow' | 'shimmer'", default: "'flow'", desc: '효과 모드.' },
  {
    name: 'colors',
    type: 'string[]',
    default: 'navy → teal 그라데이션',
    desc: 'flow 모드 색상 배열.',
  },
  {
    name: 'direction',
    type: "'horizontal' | 'vertical' | 'diagonal'",
    default: "'horizontal'",
    desc: '흐름 방향.',
  },
  { name: 'durationMs', type: 'number', default: '3000', desc: '한 cycle 완료 시간 (ms).' },
  { name: 'shimmerColor', type: 'string', default: "'#ffffff'", desc: 'shimmer 빛 색상.' },
  { name: 'baseColor', type: 'string', default: 'currentColor', desc: 'shimmer 베이스 텍스트 색.' },
  { name: 'fontSize', type: 'string | number', default: '—', desc: '폰트 크기.' },
  { name: 'fontWeight', type: "CSSProperties['fontWeight']", default: '—', desc: '폰트 굵기.' },
  {
    name: 'color',
    type: 'string',
    default: '—',
    desc: 'shimmer 색 fallback (baseColor 미지정 시).',
  },
  { name: 'className', type: 'string', default: '—', desc: '추가 클래스.' },
  { name: 'style', type: 'CSSProperties', default: '—', desc: '인라인 style.' },
];
