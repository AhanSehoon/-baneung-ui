'use client';

import * as React from 'react';

import { CountUp } from '@baneung-pack/effect';
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

export default function CountUpDemoPage() {
  const { t } = useI18n();
  const [from, setFrom] = React.useState(0);
  const [to, setTo] = React.useState(1234567);
  const [duration, setDuration] = React.useState(1500);
  const [decimals, setDecimals] = React.useState(0);
  const [separator, setSeparator] = React.useState(',');
  const [prefix, setPrefix] = React.useState('');
  const [suffix, setSuffix] = React.useState('');
  const [fontSize, setFontSize] = React.useState(48);
  const [color, setColor] = React.useState('#1F2937');
  const [fontWeight, setFontWeight] = React.useState(800);
  const [resetKey, setResetKey] = React.useState(0);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>CountUp</Heading>
        <Lead>
          숫자가 부드럽게 증가/감소하는 카운터. 통계 섹션·KPI·achievement 카드에 사용. 마운트 또는
          스크롤 진입 시 발사.
        </Lead>
      </header>
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>라이브 미리보기</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex min-h-32 items-center justify-center border border-border-default bg-surface p-6">
            <CountUp
              key={resetKey}
              from={from}
              to={to}
              duration={duration}
              decimals={decimals}
              separator={separator}
              prefix={prefix}
              suffix={suffix}
              fontSize={fontSize}
              color={color}
              fontWeight={fontWeight}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Control label="From">
              <Input type="number" value={from} onChange={(e) => setFrom(Number(e.target.value))} />
            </Control>

            <Control label="To">
              <Input type="number" value={to} onChange={(e) => setTo(Number(e.target.value))} />
            </Control>

            <Control label={`Duration (${duration}ms)`}>
              <input
                type="range"
                min={200}
                max={5000}
                step={100}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full"
              />
            </Control>

            <Control label={`소수점 자리수 (${decimals})`}>
              <input
                type="range"
                min={0}
                max={4}
                value={decimals}
                onChange={(e) => setDecimals(Number(e.target.value))}
                className="w-full"
              />
            </Control>

            <Control label="천 단위 구분자">
              <div className="flex gap-2">
                {[',', '.', ' ', ''].map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={separator === s ? 'primary' : 'ghost'}
                    onClick={() => setSeparator(s)}
                  >
                    {s === '' ? '(없음)' : s === ' ' ? '(공백)' : s}
                  </Button>
                ))}
              </div>
            </Control>

            <Control label="Prefix / Suffix">
              <div className="flex gap-2">
                <Input
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  placeholder="prefix ($)"
                  maxLength={5}
                />
                <Input
                  value={suffix}
                  onChange={(e) => setSuffix(e.target.value)}
                  placeholder="suffix (%, 명)"
                  maxLength={5}
                />
              </div>
            </Control>

            <Control label={`글자 크기 (${fontSize}px)`}>
              <input
                type="range"
                min={16}
                max={100}
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

      {/* inView 트리거 */}
      <Card>
        <CardHeader>
          <CardTitle>inView 트리거 — KPI 섹션</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-foreground-muted">
            스크롤해서 화면 안에 들어올 때 한 번만 발사됩니다.
          </p>
          <div className="py-8">
            <KpiRow>
              <Kpi label="다운로드" value={1234567} suffix="+" color="#3B716C" />
              <Kpi label="활성 사용자" value={42} suffix="K" color="#1F2937" />
              <Kpi label="만족도" value={99.9} decimals={1} suffix="%" color="#16A34A" />
              <Kpi label="평균 응답" value={0.42} decimals={2} suffix="s" color="#5BA8A0" />
            </KpiRow>
            <div className="flex h-[40vh] items-center justify-center">
              <ScrollHint />
            </div>
            <KpiRow>
              <Kpi label="매출" value={89000000} prefix="₩" color="#1F2937" />
              <Kpi label="고객사" value={128} color="#3B716C" />
              <Kpi label="가동률" value={99.99} decimals={2} suffix="%" color="#16A34A" />
              <Kpi label="응답 시간" value={42} suffix="ms" color="#5BA8A0" />
            </KpiRow>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <PresetCard title="기본 정수 + 콤마">
          <CountUp to={1234567} fontSize={36} color="#1F2937" fontWeight={800} />
        </PresetCard>

        <PresetCard title="소수점 + 퍼센트">
          <CountUp
            to={99.9}
            decimals={1}
            suffix="%"
            fontSize={36}
            color="#16A34A"
            fontWeight={800}
          />
        </PresetCard>

        <PresetCard title="화폐 prefix">
          <CountUp to={89000000} prefix="₩" fontSize={32} color="#3B716C" fontWeight={700} />
        </PresetCard>

        <PresetCard title="감소 카운터 (60 → 0)">
          <CountUp from={60} to={0} suffix="s" fontSize={36} color="#DC2626" fontWeight={800} />
        </PresetCard>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>사용</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto bg-surface p-4 text-sm leading-relaxed">
            <code>{`import { CountUp } from '@baneung-pack/effect';

// 기본 — 천 단위 콤마 자동
<CountUp to={1234567} fontSize={48} fontWeight={800} />

// 소수점 + 퍼센트
<CountUp to={99.9} decimals={1} suffix="%" />

// 화폐 + 스크롤 트리거
<CountUp to={89000000} prefix="₩" trigger="inView" />

// 감소 카운트 (60 → 0)
<CountUp from={60} to={0} suffix="s" duration={2000} />`}</code>
          </pre>
        </CardContent>
      </Card>

      <Separator />
      <Heading level={2}>{t('componentShell.apiHeading')}</Heading>
      <Card>
        <CardHeader>
          <CardTitle>CountUpProps</CardTitle>
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

function KpiRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-4 border border-border-default bg-surface p-6 md:grid-cols-4">
      {children}
    </div>
  );
}

function Kpi({
  label,
  value,
  prefix,
  suffix,
  decimals,
  color,
}: {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  color: string;
}) {
  return (
    <div className="flex flex-col gap-1 text-center">
      <CountUp
        to={value}
        prefix={prefix}
        suffix={suffix}
        decimals={decimals}
        trigger="inView"
        fontSize={32}
        color={color}
        fontWeight={800}
      />
      <span className="text-xs uppercase tracking-wider text-foreground-muted">{label}</span>
    </div>
  );
}

const PROPS_TABLE: { name: string; type: string; default: string; desc: string }[] = [
  { name: 'from', type: 'number', default: '0', desc: '시작 숫자.' },
  { name: 'to', type: 'number', default: '—', desc: '목표 숫자 (필수). from보다 작으면 감소.' },
  { name: 'duration', type: 'number', default: '1500', desc: '애니메이션 전체 시간 (ms).' },
  {
    name: 'separator',
    type: 'string',
    default: "','",
    desc: '천 단위 구분자. 빈 문자열이면 미적용.',
  },
  { name: 'decimals', type: 'number', default: '0', desc: '소수점 자리수.' },
  { name: 'decimalSeparator', type: 'string', default: "'.'", desc: '소수점 구분자.' },
  { name: 'prefix', type: 'string', default: "''", desc: '숫자 앞 문자열 (예: $, ₩).' },
  { name: 'suffix', type: 'string', default: "''", desc: '숫자 뒤 문자열 (예: %, +, 명).' },
  { name: 'trigger', type: "'mount' | 'inView'", default: "'mount'", desc: '발사 시점.' },
  { name: 'threshold', type: 'number', default: '0.3', desc: 'inView 임계값 (0~1).' },
  { name: 'fontSize', type: 'string | number', default: '—', desc: '폰트 크기.' },
  { name: 'fontWeight', type: "CSSProperties['fontWeight']", default: '—', desc: '폰트 굵기.' },
  { name: 'color', type: 'string', default: '—', desc: '텍스트 색.' },
  { name: 'className', type: 'string', default: '—', desc: '추가 클래스.' },
  { name: 'style', type: 'CSSProperties', default: '—', desc: '인라인 style.' },
];
