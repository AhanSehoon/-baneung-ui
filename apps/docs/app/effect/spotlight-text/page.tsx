'use client';

import * as React from 'react';

import { SpotlightText } from '@baneung-pack/effect';
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

export default function SpotlightTextDemoPage() {
  const { t } = useI18n();
  const [text, setText] = React.useState('MOVE YOUR MOUSE OVER THIS TEXT');
  const [radius, setRadius] = React.useState(140);
  const [dimOpacity, setDimOpacity] = React.useState(0.15);
  const [highlightColor, setHighlightColor] = React.useState('#ffffff');
  const [fontSize, setFontSize] = React.useState(36);
  const [color, setColor] = React.useState('#ffffff');
  const [fontWeight, setFontWeight] = React.useState(800);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>SpotlightText</Heading>
        <Lead>
          커서 주변의 글자만 밝아지고 나머지는 어두워지는 스포트라이트 효과. 다크 배경에서 가장
          인상적.
        </Lead>
      </header>
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>라이브 미리보기</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* 다크 배경 — 스포트라이트는 다크에서 가장 잘 보임 */}
          <div className="flex min-h-[260px] items-center justify-center border border-border-default bg-[#0a0e1a] p-12">
            <SpotlightText
              text={text}
              radius={radius}
              dimOpacity={dimOpacity}
              highlightColor={highlightColor}
              fontSize={fontSize}
              color={color}
              fontWeight={fontWeight}
            />
          </div>
          <p className="text-xs text-foreground-muted">
            💡 위 박스 안에서 마우스를 움직여보세요. 커서 주변 글자만 밝아집니다.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <Control label="텍스트">
              <Input value={text} onChange={(e) => setText(e.target.value)} maxLength={80} />
            </Control>

            <Control label={`반경 (${radius}px)`}>
              <input
                type="range"
                min={40}
                max={400}
                step={10}
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full"
              />
            </Control>

            <Control label={`Dim opacity (${dimOpacity.toFixed(2)})`}>
              <input
                type="range"
                min={0}
                max={0.6}
                step={0.05}
                value={dimOpacity}
                onChange={(e) => setDimOpacity(Number(e.target.value))}
                className="w-full"
              />
            </Control>

            <Control label={`글자 크기 (${fontSize}px)`}>
              <input
                type="range"
                min={16}
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

            <Control label="베이스 색 (dim)">
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

            <Control label="하이라이트 색">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={highlightColor}
                  onChange={(e) => setHighlightColor(e.target.value)}
                  className="h-10 w-12 cursor-pointer border border-border-default p-1"
                  aria-label="하이라이트 색"
                />
                <Input value={highlightColor} onChange={(e) => setHighlightColor(e.target.value)} />
              </div>
            </Control>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <PresetCard title="기본 (다크 배경)">
          <SpotlightText text="HOVER ME" fontSize={32} fontWeight={800} color="#ffffff" />
        </PresetCard>
        <PresetCard title="좁은 반경 (80px)">
          <SpotlightText
            text="precision spotlight"
            radius={80}
            fontSize={26}
            fontWeight={700}
            color="#ffffff"
          />
        </PresetCard>
        <PresetCard title="컬러 하이라이트 (teal)">
          <SpotlightText
            text="BANEUNG"
            highlightColor="#5BA8A0"
            fontSize={42}
            fontWeight={900}
            color="#ffffff"
            dimOpacity={0.2}
          />
        </PresetCard>
        <PresetCard title="강한 dim (거의 안 보임)">
          <SpotlightText
            text="DARK MODE"
            dimOpacity={0.05}
            radius={150}
            fontSize={36}
            fontWeight={900}
            color="#ffffff"
            highlightColor="#FFD700"
          />
        </PresetCard>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>사용</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto bg-surface p-4 text-sm leading-relaxed">
            <code>{`import { SpotlightText } from '@baneung-pack/effect';

// 다크 배경에서 사용 권장
<SpotlightText text="HOVER ME" fontSize={32} color="#ffffff" fontWeight={800} />

// 컬러 하이라이트
<SpotlightText
  text="BANEUNG"
  highlightColor="#5BA8A0"
  color="#ffffff"
/>

// 강한 dim — 거의 안 보이다가 커서 주변만 빛남
<SpotlightText text="DARK MODE" dimOpacity={0.05} highlightColor="#FFD700" />`}</code>
          </pre>
        </CardContent>
      </Card>

      <Separator />
      <Heading level={2}>{t('componentShell.apiHeading')}</Heading>
      <Card>
        <CardHeader>
          <CardTitle>SpotlightTextProps</CardTitle>
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
        <div className="flex min-h-[180px] items-center justify-center bg-[#0a0e1a] p-6">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}

const PROPS_TABLE: { name: string; type: string; default: string; desc: string }[] = [
  { name: 'text', type: 'string', default: '—', desc: '표시할 텍스트 (필수).' },
  { name: 'radius', type: 'number', default: '120', desc: '스포트라이트 반경 (px).' },
  { name: 'dimOpacity', type: 'number', default: '0.15', desc: '어두운 영역 투명도 (0~1).' },
  {
    name: 'highlightColor',
    type: 'string',
    default: 'color or currentColor',
    desc: '스포트라이트 안 글자 색.',
  },
  { name: 'fontSize', type: 'string | number', default: '—', desc: '폰트 크기.' },
  { name: 'fontWeight', type: "CSSProperties['fontWeight']", default: '—', desc: '폰트 굵기.' },
  { name: 'color', type: 'string', default: 'currentColor', desc: '베이스(dim) 텍스트 색.' },
  { name: 'className', type: 'string', default: '—', desc: '추가 클래스.' },
  { name: 'style', type: 'CSSProperties', default: '—', desc: '인라인 style.' },
];
