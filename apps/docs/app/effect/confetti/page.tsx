'use client';

import * as React from 'react';

import { ConfettiProvider, useConfetti, type ConfettiShape } from '@baneung-pack/effect';
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

export default function ConfettiDemoPage() {
  return (
    <ConfettiProvider>
      <ConfettiDemoContent />
    </ConfettiProvider>
  );
}

function ConfettiDemoContent() {
  const { t } = useI18n();
  const confetti = useConfetti();
  const [particleCount, setParticleCount] = React.useState(120);
  const [spread, setSpread] = React.useState(70);
  const [shape, setShape] = React.useState<ConfettiShape>('square');
  const [colors, setColors] = React.useState(
    '#FF3D8E, #3D5BFF, #A6F537, #FFB23D, #D63DFF, #3DECFF',
  );
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const colorArray = colors
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>Confetti</Heading>
        <Lead>
          <code>ConfettiProvider</code> + <code>useConfetti()</code> 명령형 트리거. 결제 완료·성공·
          축하 순간용. Canvas 기반, 0 dependency.
        </Lead>
      </header>
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>발사 트리거</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => confetti.fire({ particleCount, spread, shape, colors: colorArray })}
            >
              화면 가운데 하단에서 (기본)
            </Button>
            <Button
              ref={buttonRef}
              variant="ghost"
              onClick={() =>
                confetti.fire({
                  particleCount,
                  spread,
                  shape,
                  colors: colorArray,
                  origin: buttonRef.current ?? undefined,
                })
              }
            >
              이 버튼에서 발사 ↑
            </Button>
            <Button
              variant="ghost"
              onClick={() =>
                confetti.fire({
                  particleCount,
                  spread,
                  shape,
                  colors: colorArray,
                  origin: { ratioX: 0.1, ratioY: 0.5 },
                  angle: 60,
                })
              }
            >
              왼쪽에서 → 오른쪽으로
            </Button>
            <Button
              variant="ghost"
              onClick={() =>
                confetti.fire({
                  particleCount,
                  spread,
                  shape,
                  colors: colorArray,
                  origin: { ratioX: 0.9, ratioY: 0.5 },
                  angle: 120,
                })
              }
            >
              오른쪽에서 → 왼쪽으로
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                // 연속 발사 — 양쪽에서.
                confetti.fire({
                  particleCount: 60,
                  spread,
                  colors: colorArray,
                  origin: { ratioX: 0.1, ratioY: 0.6 },
                  angle: 60,
                });
                setTimeout(
                  () =>
                    confetti.fire({
                      particleCount: 60,
                      spread,
                      colors: colorArray,
                      origin: { ratioX: 0.9, ratioY: 0.6 },
                      angle: 120,
                    }),
                  120,
                );
              }}
            >
              양쪽에서 동시 발사
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Control label={`입자 개수 (${particleCount})`}>
              <input
                type="range"
                min={20}
                max={400}
                step={10}
                value={particleCount}
                onChange={(e) => setParticleCount(Number(e.target.value))}
                className="w-full"
              />
            </Control>
            <Control label={`Spread (${spread}°)`}>
              <input
                type="range"
                min={20}
                max={180}
                value={spread}
                onChange={(e) => setSpread(Number(e.target.value))}
                className="w-full"
              />
            </Control>
            <Control label="입자 모양">
              <div className="flex gap-2">
                {(['square', 'circle', 'ribbon'] as ConfettiShape[]).map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={shape === s ? 'primary' : 'ghost'}
                    onClick={() => setShape(s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </Control>
            <Control label="색상 (콤마 구분)">
              <Input value={colors} onChange={(e) => setColors(e.target.value)} />
            </Control>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>사용</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto bg-surface p-4 text-sm leading-relaxed">
            <code>{`import { ConfettiProvider, useConfetti } from '@baneung-pack/effect';

// 1. 앱 루트에 Provider
<ConfettiProvider>{children}</ConfettiProvider>

// 2. 컴포넌트에서 호출
function CheckoutButton() {
  const confetti = useConfetti();
  return (
    <button onClick={async () => {
      await checkout();
      confetti.fire({ particleCount: 200 });
    }}>결제</button>
  );
}

// 버튼에서 발사
const ref = useRef<HTMLButtonElement>(null);
confetti.fire({ origin: ref.current });

// 양쪽에서
confetti.fire({ origin: { ratioX: 0.1, ratioY: 0.5 }, angle: 60 });
confetti.fire({ origin: { ratioX: 0.9, ratioY: 0.5 }, angle: 120 });`}</code>
          </pre>
        </CardContent>
      </Card>

      <Separator />
      <Heading level={2}>{t('componentShell.apiHeading')}</Heading>

      <Card>
        <CardHeader>
          <CardTitle>ConfettiProviderProps</CardTitle>
        </CardHeader>
        <CardContent>
          <ApiTable rows={PROVIDER_PROPS} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>useConfetti() → ConfettiApi</CardTitle>
        </CardHeader>
        <CardContent>
          <ApiTable rows={API_PROPS} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ConfettiFireOptions (fire 호출 시)</CardTitle>
        </CardHeader>
        <CardContent>
          <ApiTable rows={FIRE_PROPS} />
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

function ApiTable({
  rows,
}: {
  rows: { name: string; type: string; default: string; desc: string }[];
}) {
  const { t } = useI18n();
  return (
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
          {rows.map((row) => (
            <tr key={row.name} className="border-b border-border-subtle align-top last:border-b-0">
              <td className="px-3 py-2 font-mono text-foreground">{row.name}</td>
              <td className="px-3 py-2 font-mono text-xs">{row.type}</td>
              <td className="px-3 py-2 font-mono text-xs">{row.default}</td>
              <td className="px-3 py-2">{row.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const PROVIDER_PROPS = [
  { name: 'children', type: 'ReactNode', default: '—', desc: '자식 트리.' },
  { name: 'zIndex', type: 'number', default: '2147483647', desc: 'Canvas z-index.' },
];

const API_PROPS = [
  {
    name: 'fire(options?)',
    type: '(opts?: ConfettiFireOptions) => void',
    default: '—',
    desc: '발사. 동시 호출 가능 (양쪽 등).',
  },
];

const FIRE_PROPS = [
  {
    name: 'origin',
    type: '{x,y} | {ratioX,ratioY} | HTMLElement',
    default: '가운데 하단',
    desc: '발사 위치 — 픽셀/비율/요소 중심.',
  },
  { name: 'particleCount', type: 'number', default: '80', desc: '입자 개수.' },
  { name: 'colors', type: 'string[]', default: '7색 vivid', desc: '입자가 무작위 선택.' },
  {
    name: 'shape',
    type: "'square' | 'circle' | 'ribbon'",
    default: "'square'",
    desc: '입자 모양.',
  },
  { name: 'spread', type: 'number', default: '60', desc: '발사 spread 각도 (deg).' },
  { name: 'angle', type: 'number', default: '90', desc: '발사 각도 (90=위, 0=오른쪽).' },
  { name: 'velocity', type: 'number', default: '14', desc: '초기 속도 (px/frame).' },
  { name: 'gravity', type: 'number', default: '0.5', desc: '중력 가속도 (px/frame²).' },
  { name: 'ticks', type: 'number', default: '130', desc: '입자 수명 (frame).' },
  { name: 'size', type: 'number', default: '10', desc: '입자 크기 (px).' },
];
