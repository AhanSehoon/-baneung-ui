'use client';

import * as React from 'react';

import {
  AnimatedButton,
  type AnimatedButtonStatus,
  type AnimatedButtonVariant,
} from '@baneung-pack/ui';
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

export default function AnimatedButtonDemoPage() {
  const { t } = useI18n();
  // 외부 제어 데모용 status.
  const [controlledStatus, setControlledStatus] = React.useState<AnimatedButtonStatus>('idle');

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>AnimatedButton</Heading>
        <Lead>
          idle → loading → success/error 상태가 부드럽게 모핑되는 버튼. <code>onClick</code>이
          Promise면 자동 처리, 아니면 <code>status</code> prop으로 외부 제어.
        </Lead>
      </header>
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>1. Promise 자동 모드</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-foreground-muted">
            <code>onClick</code>이 Promise를 반환하면 자동으로 loading → success/error로 전환.
          </p>
          <div className="flex flex-wrap gap-3">
            <AnimatedButton
              onClick={async () => {
                await sleep(1500);
              }}
            >
              저장 (1.5초 성공)
            </AnimatedButton>
            <AnimatedButton
              variant="danger"
              onClick={async () => {
                await sleep(1500);
                throw new Error('실패');
              }}
            >
              삭제 (1.5초 후 실패)
            </AnimatedButton>
            <AnimatedButton
              variant="secondary"
              loadingText="업로드 중…"
              successText="완료"
              onClick={async () => {
                await sleep(2000);
              }}
            >
              업로드 (커스텀 텍스트)
            </AnimatedButton>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. 외부 제어 모드</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-foreground-muted">
            <code>status</code> prop으로 직접 제어. (Promise 자동 모드보다 우선)
          </p>
          <div className="flex flex-wrap gap-2">
            {(['idle', 'loading', 'success', 'error'] as const).map((s) => (
              <Button
                key={s}
                size="sm"
                variant={controlledStatus === s ? 'primary' : 'ghost'}
                onClick={() => setControlledStatus(s)}
              >
                {s}
              </Button>
            ))}
          </div>
          <div>
            <AnimatedButton status={controlledStatus} resetMs={0}>
              제어된 버튼
            </AnimatedButton>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. 크기 / variant</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wider text-foreground-muted">
              크기
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {(['sm', 'md', 'lg'] as const).map((s) => (
                <AnimatedButton key={s} size={s} onClick={async () => await sleep(1000)}>
                  {s} 버튼
                </AnimatedButton>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wider text-foreground-muted">
              Variant
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {(['primary', 'secondary', 'ghost', 'danger'] as AnimatedButtonVariant[]).map((v) => (
                <AnimatedButton key={v} variant={v} onClick={async () => await sleep(1000)}>
                  {v}
                </AnimatedButton>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>사용</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto bg-surface p-4 text-sm leading-relaxed">
            <code>{`import { AnimatedButton } from '@baneung-pack/ui';

// 1. Promise 자동 모드 — onClick이 Promise면 자동으로 loading → success/error
<AnimatedButton onClick={async () => await api.save()}>
  저장
</AnimatedButton>

// 커스텀 텍스트
<AnimatedButton
  loadingText="업로드 중…"
  successText="완료"
  errorText="다시 시도"
  onClick={async () => await api.upload(file)}
>
  업로드
</AnimatedButton>

// 2. 외부 제어 — status prop으로 직접
<AnimatedButton status={status} onClick={() => /* sync */}>
  제어된 버튼
</AnimatedButton>`}</code>
          </pre>
        </CardContent>
      </Card>

      <Separator />
      <Heading level={2}>{t('componentShell.apiHeading')}</Heading>
      <Card>
        <CardHeader>
          <CardTitle>AnimatedButtonProps</CardTitle>
        </CardHeader>
        <CardContent>
          <ApiTable rows={PROPS} />
        </CardContent>
      </Card>
    </div>
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
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
  { name: 'children', type: 'ReactNode', default: '—', desc: '기본 버튼 라벨.' },
  {
    name: 'onClick',
    type: '(e) => void | Promise<unknown>',
    default: '—',
    desc: 'Promise 반환 시 자동 loading → success/error.',
  },
  {
    name: 'status',
    type: "'idle' | 'loading' | 'success' | 'error'",
    default: '—',
    desc: '외부 제어 (지정 시 자동 모드 우회).',
  },
  {
    name: 'resetMs',
    type: 'number',
    default: '1800',
    desc: 'success/error → idle 자동 복귀 (ms). 0이면 비활성.',
  },
  {
    name: 'variant',
    type: "'primary' | 'secondary' | 'ghost' | 'danger'",
    default: "'primary'",
    desc: '색상 변형.',
  },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: '크기.' },
  {
    name: 'loadingText',
    type: 'ReactNode',
    default: 'children 유지',
    desc: 'loading 상태 텍스트.',
  },
  { name: 'successText', type: 'ReactNode', default: '아이콘만', desc: 'success 상태 텍스트.' },
  { name: 'errorText', type: 'ReactNode', default: '아이콘만', desc: 'error 상태 텍스트.' },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    desc: '비활성화 (loading 중에도 자동 적용).',
  },
];
