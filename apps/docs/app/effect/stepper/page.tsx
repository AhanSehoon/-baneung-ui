'use client';

import * as React from 'react';

import { Stepper, type StepperStep } from '@baneung-pack/ui';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Heading,
  Lead,
  Separator,
} from '@baneung-pack/ui';

import { useI18n } from '@/components/i18n-provider';

const CHECKOUT_STEPS: StepperStep[] = [
  { label: '장바구니', description: '상품 확인' },
  { label: '배송 정보', description: '주소 · 연락처' },
  { label: '결제', description: '카드/계좌' },
  { label: '완료', description: '주문 확인' },
];

const SHORT_STEPS: StepperStep[] = [{ label: '1단계' }, { label: '2단계' }, { label: '3단계' }];

export default function StepperDemoPage() {
  const { t } = useI18n();
  const [current, setCurrent] = React.useState(1);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>Stepper</Heading>
        <Lead>
          다단계 진행 표시기. 가로/세로, 연결선이 단계 전환에 부드럽게 채워짐. 클릭 이동 콜백 지원.
        </Lead>
      </header>
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Horizontal — 체크아웃 예시 (클릭으로 이동)</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <Stepper steps={CHECKOUT_STEPS} current={current} onStepClick={setCurrent} />
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
            >
              ← 이전
            </Button>
            <Button
              size="sm"
              onClick={() => setCurrent((c) => Math.min(CHECKOUT_STEPS.length - 1, c + 1))}
              disabled={current === CHECKOUT_STEPS.length - 1}
            >
              다음 →
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setCurrent(0)}>
              처음으로
            </Button>
            <span className="self-center text-xs text-foreground-muted">
              현재 단계: <code>{current + 1}</code> / {CHECKOUT_STEPS.length}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vertical</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-sm">
            <Stepper steps={CHECKOUT_STEPS} current={2} orientation="vertical" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>크기 변형</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wider text-foreground-muted">
              sm
            </div>
            <Stepper steps={SHORT_STEPS} current={1} size="sm" />
          </div>
          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wider text-foreground-muted">
              md
            </div>
            <Stepper steps={SHORT_STEPS} current={1} size="md" />
          </div>
          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wider text-foreground-muted">
              lg
            </div>
            <Stepper steps={SHORT_STEPS} current={1} size="lg" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>색상 변형</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Stepper steps={SHORT_STEPS} current={1} activeColor="#3B716C" />
          <Stepper steps={SHORT_STEPS} current={1} activeColor="#16A34A" />
          <Stepper steps={SHORT_STEPS} current={1} activeColor="#DC2626" />
          <Stepper steps={SHORT_STEPS} current={1} activeColor="#A21CAF" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>사용</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto bg-surface p-4 text-sm leading-relaxed">
            <code>{`import { Stepper } from '@baneung-pack/ui';

const STEPS = [
  { label: '장바구니', description: '상품 확인' },
  { label: '배송', description: '주소 · 연락처' },
  { label: '결제', description: '카드/계좌' },
  { label: '완료' },
];

// Horizontal (기본)
<Stepper steps={STEPS} current={1} />

// Vertical
<Stepper steps={STEPS} current={2} orientation="vertical" />

// 클릭으로 이동
<Stepper steps={STEPS} current={current} onStepClick={setCurrent} />

// 색
<Stepper steps={STEPS} current={1} activeColor="#3B716C" />`}</code>
          </pre>
        </CardContent>
      </Card>

      <Separator />
      <Heading level={2}>{t('componentShell.apiHeading')}</Heading>

      <Card>
        <CardHeader>
          <CardTitle>StepperProps</CardTitle>
        </CardHeader>
        <CardContent>
          <ApiTable rows={PROPS} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>StepperStep</CardTitle>
        </CardHeader>
        <CardContent>
          <ApiTable rows={STEP_PROPS} />
        </CardContent>
      </Card>
    </div>
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

const PROPS = [
  { name: 'steps', type: 'StepperStep[]', default: '—', desc: '단계 배열.' },
  { name: 'current', type: 'number', default: '—', desc: '현재 활성 인덱스 (0-based).' },
  {
    name: 'orientation',
    type: "'horizontal' | 'vertical'",
    default: "'horizontal'",
    desc: '방향.',
  },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: '크기.' },
  { name: 'activeColor', type: 'string', default: "'#1F2937'", desc: '활성/완료 색.' },
  { name: 'inactiveColor', type: 'string', default: "'#CED4DA'", desc: '미완료 색.' },
  { name: 'duration', type: 'number', default: '400', desc: '연결선 채움 시간 (ms).' },
  {
    name: 'onStepClick',
    type: '(index: number) => void',
    default: '—',
    desc: '클릭 콜백 (있으면 단계가 button으로 렌더).',
  },
];

const STEP_PROPS = [
  { name: 'label', type: 'ReactNode', default: '—', desc: '단계 라벨.' },
  { name: 'description', type: 'ReactNode', default: '—', desc: '보조 설명 (라벨 아래/옆).' },
  { name: 'icon', type: 'ReactNode', default: '—', desc: '숫자/체크 대신 사용자 아이콘.' },
];
