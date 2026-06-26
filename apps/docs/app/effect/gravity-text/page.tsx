'use client';

import * as React from 'react';

import { GravityText } from '@baneung-pack/effect';
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

type Trigger = 'mount' | 'hover' | 'inView';

export default function GravityTextDemoPage() {
  const { t } = useI18n();
  const [text, setText] = React.useState('FALLING WORDS');
  const [trigger, setTrigger] = React.useState<Trigger>('hover');
  const [duration, setDuration] = React.useState(1400);
  const [stagger, setStagger] = React.useState(40);
  const [spread, setSpread] = React.useState(0.6);
  const [gravity, setGravity] = React.useState(280);
  const [rotation, setRotation] = React.useState(120);
  const [fontSize, setFontSize] = React.useState(48);
  const [color, setColor] = React.useState('#1F2937');
  const [fontWeight, setFontWeight] = React.useState(800);
  const [resetKey, setResetKey] = React.useState(0);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>GravityText</Heading>
        <Lead>글자가 중력에 떨어지거나 흩어지는 물리 효과. mount/hover/inView 트리거 지원.</Lead>
      </header>
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>라이브 미리보기</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex min-h-[260px] items-center justify-center border border-border-default bg-surface p-6">
            <GravityText
              key={resetKey}
              text={text}
              trigger={trigger}
              duration={duration}
              stagger={stagger}
              spread={spread}
              gravity={gravity}
              rotation={rotation}
              fontSize={fontSize}
              color={color}
              fontWeight={fontWeight}
            />
          </div>
          {trigger === 'hover' && (
            <p className="text-xs text-foreground-muted">
              💡 마우스를 텍스트 위에 올려보세요. 글자가 흩어졌다가 떼면 복귀합니다.
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Control label="텍스트">
              <Input value={text} onChange={(e) => setText(e.target.value)} maxLength={40} />
            </Control>

            <Control label="트리거">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={trigger === 'mount' ? 'primary' : 'ghost'}
                  onClick={() => setTrigger('mount')}
                >
                  mount
                </Button>
                <Button
                  size="sm"
                  variant={trigger === 'hover' ? 'primary' : 'ghost'}
                  onClick={() => setTrigger('hover')}
                >
                  hover
                </Button>
                <Button
                  size="sm"
                  variant={trigger === 'inView' ? 'primary' : 'ghost'}
                  onClick={() => setTrigger('inView')}
                >
                  inView
                </Button>
              </div>
            </Control>

            <Control label={`Duration (${duration}ms)`}>
              <input
                type="range"
                min={500}
                max={3500}
                step={100}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full"
              />
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

            <Control label={`Spread (${spread.toFixed(2)})`}>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={spread}
                onChange={(e) => setSpread(Number(e.target.value))}
                className="w-full"
              />
            </Control>

            <Control label={`Gravity (${gravity}px)`}>
              <input
                type="range"
                min={80}
                max={600}
                step={20}
                value={gravity}
                onChange={(e) => setGravity(Number(e.target.value))}
                className="w-full"
              />
            </Control>

            <Control label={`Rotation (${rotation}°)`}>
              <input
                type="range"
                min={0}
                max={360}
                value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
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
        <PresetCard title="hover (마우스 올려보세요)">
          <GravityText
            text="HOVER ME"
            trigger="hover"
            fontSize={36}
            fontWeight={900}
            color="#1F2937"
          />
        </PresetCard>
        <PresetCard title="mount 1회">
          <GravityText
            text="DROP"
            trigger="mount"
            fontSize={48}
            fontWeight={900}
            color="#DC2626"
            spread={0.8}
            rotation={180}
          />
        </PresetCard>
        <PresetCard title="강한 흩어짐 (spread=1)">
          <GravityText
            text="SCATTER"
            trigger="hover"
            spread={1}
            gravity={400}
            rotation={300}
            fontSize={38}
            fontWeight={800}
            color="#3B716C"
          />
        </PresetCard>
        <PresetCard title="수직 낙하 (spread=0, 회전 X)">
          <GravityText
            text="STRAIGHT FALL"
            trigger="hover"
            spread={0}
            rotation={0}
            fontSize={32}
            fontWeight={700}
            color="#5BA8A0"
          />
        </PresetCard>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>사용</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto bg-surface p-4 text-sm leading-relaxed">
            <code>{`import { GravityText } from '@baneung-pack/effect';

// mount 시 1회 떨어짐
<GravityText text="FALLING" />

// hover 시 흩어졌다 복귀
<GravityText text="Hover Me" trigger="hover" />

// 강한 흩어짐 + 큰 회전
<GravityText text="SCATTER" spread={1} rotation={300} gravity={400} />

// 스크롤 진입 시 1회
<GravityText text="ON SCROLL" trigger="inView" />`}</code>
          </pre>
        </CardContent>
      </Card>

      <Separator />
      <Heading level={2}>{t('componentShell.apiHeading')}</Heading>
      <Card>
        <CardHeader>
          <CardTitle>GravityTextProps</CardTitle>
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
        <div className="flex min-h-[220px] items-center justify-center overflow-hidden">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}

const PROPS_TABLE: { name: string; type: string; default: string; desc: string }[] = [
  { name: 'text', type: 'string', default: '—', desc: '표시할 텍스트 (필수).' },
  {
    name: 'trigger',
    type: "'mount' | 'hover' | 'inView'",
    default: "'mount'",
    desc: '발사 시점. hover는 토글 가능.',
  },
  { name: 'duration', type: 'number', default: '1400', desc: '낙하 시간 (ms).' },
  { name: 'stagger', type: 'number', default: '30', desc: '글자 간 시차 (ms).' },
  { name: 'spread', type: 'number', default: '0.5', desc: '가로 흩어짐 강도 (0~1).' },
  { name: 'gravity', type: 'number', default: '320', desc: '낙하 거리 (px).' },
  { name: 'rotation', type: 'number', default: '90', desc: '회전 강도 — 최대 각도 (deg).' },
  { name: 'threshold', type: 'number', default: '0.2', desc: 'inView 임계값 (0~1).' },
  { name: 'fontSize', type: 'string | number', default: '—', desc: '폰트 크기.' },
  { name: 'fontWeight', type: "CSSProperties['fontWeight']", default: '—', desc: '폰트 굵기.' },
  { name: 'color', type: 'string', default: '—', desc: '텍스트 색.' },
  { name: 'className', type: 'string', default: '—', desc: '추가 클래스.' },
  { name: 'style', type: 'CSSProperties', default: '—', desc: '인라인 style.' },
];
