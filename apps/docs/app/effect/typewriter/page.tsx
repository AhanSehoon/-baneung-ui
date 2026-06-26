'use client';

import * as React from 'react';

import { Typewriter } from '@baneung-pack/effect';
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
 * /effect/typewriter — Typewriter 컴포넌트 라이브 데모.
 *
 * - 좌측: 실시간 미리보기 (소비자가 조작 가능)
 * - 우측: 사전 정의 변형 (loop / 큰 글자 / 컬러 / 커서 글자)
 */
export default function TypewriterDemoPage() {
  const { t } = useI18n();
  // 라이브 컨트롤 상태
  const [text, setText] = React.useState(
    'AI Agent · React · Java · C++ · Flutter · Python — 함께 만들 프로젝트가 있으신가요?',
  );
  const [loop, setLoop] = React.useState(true);
  const [fontSize, setFontSize] = React.useState(20);
  const [color, setColor] = React.useState('#1F2937');
  const [fontWeight, setFontWeight] = React.useState(600);
  const [cursorChar, setCursorChar] = React.useState('');
  const [resetKey, setResetKey] = React.useState(0);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>Typewriter</Heading>
        <Lead>
          한 글자씩 등장하는 텍스트 + 깜빡이는 커서. 1회 또는 무한 루프 모드, 크기·색·굵기·커서를
          자유롭게 커스터마이즈.
        </Lead>
      </header>
      <Separator />

      {/* 라이브 컨트롤 */}
      <Card>
        <CardHeader>
          <CardTitle>라이브 미리보기</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* 미리보기 영역 — 충분한 높이 확보로 줄바꿈 시 흔들림 방지 */}
          <div className="flex min-h-32 items-center border border-border-default bg-surface p-6">
            <Typewriter
              text={text}
              loop={loop}
              fontSize={fontSize}
              color={color}
              fontWeight={fontWeight}
              cursorChar={cursorChar || undefined}
              resetKey={resetKey}
            />
          </div>

          {/* 컨트롤 패널 */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Control label="텍스트">
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="표시할 텍스트"
              />
            </Control>

            <Control label="모드">
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={!loop ? 'primary' : 'ghost'}
                  onClick={() => setLoop(false)}
                >
                  1회
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={loop ? 'primary' : 'ghost'}
                  onClick={() => setLoop(true)}
                >
                  Loop
                </Button>
              </div>
            </Control>

            <Control label={`글자 크기 (${fontSize}px)`}>
              <input
                type="range"
                min={12}
                max={48}
                step={1}
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
                  className="h-10 w-12 cursor-pointer rounded-none border border-border-default p-1"
                  aria-label="색상 선택"
                />
                <Input value={color} onChange={(e) => setColor(e.target.value)} />
              </div>
            </Control>

            <Control label="커서 글자 (비우면 막대)">
              <Input
                value={cursorChar}
                onChange={(e) => setCursorChar(e.target.value)}
                placeholder="예: _, |, ▌, █"
                maxLength={3}
              />
            </Control>
          </div>

          <div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setResetKey((k) => k + 1)}
            >
              ↻ 처음부터 다시
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 사전 정의 변형 */}
      <div className="grid gap-4 sm:grid-cols-2">
        <PresetCard title="1회 타이핑 (기본)">
          <Typewriter text="Hello, BANEUNG!" fontSize={22} fontWeight={600} />
        </PresetCard>

        <PresetCard title="무한 루프">
          <Typewriter text="지금 바로 문의해 주세요." loop fontSize={20} fontWeight={500} />
        </PresetCard>

        <PresetCard title="컬러 그라데이션 톤">
          <Typewriter
            text="React · TypeScript · Flutter"
            loop
            fontSize={22}
            color="#5BA8A0"
            fontWeight={700}
          />
        </PresetCard>

        <PresetCard title="언더스코어 커서 (터미널)">
          <Typewriter
            text="$ npm install @baneung-pack/effect"
            loop
            cursorChar="_"
            cursorColor="#16A34A"
            fontSize={16}
            color="#0a0e1a"
            style={{ fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
          />
        </PresetCard>

        <PresetCard title="블록 커서 + 큰 글자">
          <Typewriter
            text="BANEUNG"
            loop
            cursorChar="▌"
            fontSize={36}
            fontWeight={900}
            color="#1F2937"
          />
        </PresetCard>

        <PresetCard title="커서 숨김">
          <Typewriter text="조용한 등장" loop showCursor={false} fontSize={20} />
        </PresetCard>
      </div>

      {/* 설치 안내는 /install 페이지에 통합 — 여기서는 사용 예제만. */}
      <Card>
        <CardHeader>
          <CardTitle>사용</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto bg-surface p-4 text-sm leading-relaxed">
            <code>{`import { Typewriter } from '@baneung-pack/effect';

// 1회 타이핑 (기본)
<Typewriter text="Hello, world!" />

// 무한 루프 + 크기/색 커스터마이즈
<Typewriter
  text="함께 만들 프로젝트가 있으신가요?"
  loop
  fontSize={24}
  color="#1F2937"
  fontWeight={600}
  pauseAfterTypeMs={3000}
/>

// 터미널 스타일 (언더스코어 커서)
<Typewriter
  text="$ npm install"
  loop
  cursorChar="_"
  cursorColor="#16A34A"
/>`}</code>
          </pre>
        </CardContent>
      </Card>

      {/* API 섹션 — Grid/Chart/Editor 페이지와 동일 패턴 (Heading + Card + table). */}
      <Separator />
      <Heading level={2}>{t('componentShell.apiHeading')}</Heading>
      <Card>
        <CardHeader>
          <CardTitle>TypewriterProps</CardTitle>
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

/** 라벨 + 컨트롤 wrapper. */
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
  {
    name: 'text',
    type: 'string',
    default: '—',
    desc: '표시할 텍스트 (필수). 변경 시 처음부터 다시 타이핑.',
  },
  {
    name: 'loop',
    type: 'boolean',
    default: 'false',
    desc: 'true면 type → pause → erase → pause 무한 반복.',
  },
  { name: 'speedMs', type: 'number', default: '50', desc: '타이핑 속도 (ms/char).' },
  {
    name: 'eraseSpeedMs',
    type: 'number',
    default: '24',
    desc: '지우는 속도 (ms/char). loop=true 시.',
  },
  {
    name: 'pauseAfterTypeMs',
    type: 'number',
    default: '3000',
    desc: '다 친 뒤 지우기 시작까지 대기 (ms).',
  },
  {
    name: 'pauseAfterEraseMs',
    type: 'number',
    default: '450',
    desc: '다 지운 뒤 다시 타이핑까지 대기 (ms).',
  },
  {
    name: 'resetKey',
    type: 'number | string',
    default: '—',
    desc: '값이 바뀌면 외부 트리거로 처음부터 재시작.',
  },
  {
    name: 'fontSize',
    type: 'string | number',
    default: '—',
    desc: '폰트 크기. number는 px로 해석.',
  },
  { name: 'fontWeight', type: "CSSProperties['fontWeight']", default: '—', desc: '폰트 굵기.' },
  { name: 'color', type: 'string', default: '—', desc: '텍스트 색 (CSS color).' },
  { name: 'showCursor', type: 'boolean', default: 'true', desc: '커서 표시 여부.' },
  {
    name: 'cursorColor',
    type: 'string',
    default: 'currentColor',
    desc: '커서 색 — 미지정 시 텍스트 색.',
  },
  { name: 'cursorWidth', type: 'number', default: '2', desc: '막대 커서 두께 (px).' },
  { name: 'cursorChar', type: 'string', default: '—', desc: '커서 글자 (미지정 시 막대 형태).' },
  { name: 'className', type: 'string', default: '—', desc: '추가 클래스 (Tailwind 등).' },
  {
    name: 'style',
    type: 'CSSProperties',
    default: '—',
    desc: '인라인 style (fontSize/color/fontWeight보다 우선).',
  },
];
