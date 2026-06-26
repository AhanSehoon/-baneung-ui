'use client';

import * as React from 'react';

import { Typewriter } from '@baneung-pack/effect';
import {
  Badge,
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Textarea,
} from '@baneung-pack/ui';

import { useI18n } from '@/components/i18n-provider';

/**
 * 프로젝트 문의 Dialog — 헤더 "프로젝트 문의" 버튼이 트리거.
 *
 * - 제목 + 내용 + (선택)이메일 입력 → POST /api/contact → Resend로 ash@reacting.kr 발송.
 * - 발송 성공 시 폼을 감추고 thank-you 메시지 노출.
 * - 다이얼로그 다시 열면 상태 리셋.
 *
 * 마케팅 카피·라벨은 i18n 키로 분리 (ko/en 양쪽 지원).
 */
interface ContactDialogProps {
  open: boolean;
  onOpenChange: (next: boolean) => void;
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function ContactDialog({ open, onOpenChange }: ContactDialogProps) {
  const { t } = useI18n();
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState<Status>('idle');
  const [errorMsg, setErrorMsg] = React.useState('');
  // 다이얼로그 열림 횟수 — Typewriter의 resetKey로 사용해 매번 처음부터 타이핑.
  const [openCount, setOpenCount] = React.useState(0);

  // 열릴 때마다 카운터 +1, 닫힐 때 상태 초기화.
  React.useEffect(() => {
    if (open) {
      setOpenCount((c) => c + 1);
    } else {
      setTitle('');
      setContent('');
      setEmail('');
      setStatus('idle');
      setErrorMsg('');
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'submitting') return;
    setStatus('submitting');
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, email }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setStatus('error');
        setErrorMsg(data.error ?? t('contact.errorGeneric'));
        return;
      }
      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMsg(t('contact.errorNetwork'));
    }
  }

  const isSubmitting = status === 'submitting';
  const isDone = status === 'success';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{t('contact.title')}</DialogTitle>
        </DialogHeader>

        {/* 마케팅 카피 — 단일 단락 + 회사 라인 + 홈페이지 Badge.
            Badge는 anchor 안에 직접 → 클릭 영역 = Badge 전체, 새 탭 이동.
            카피는 Typewriter로 시선 끌기 — loop 모드로 타이핑→3초 멈춤→지움→다시 반복. */}
        <div className="mt-2 space-y-3 border-l-2 border-border-strong pl-4 text-sm leading-relaxed text-foreground-muted">
          {/* 본 카피는 시선을 끌어야 하니 한 단계 크고 진하게 (base + semibold).
              min-h로 타이핑 진행 중 레이아웃 흔들림 방지. */}
          <p className="min-h-[4.5em] text-base font-semibold leading-relaxed text-foreground">
            <Typewriter
              text={t('contact.copy')}
              resetKey={openCount}
              loop
              speedMs={45}
              eraseSpeedMs={22}
              pauseAfterTypeMs={3000}
              pauseAfterEraseMs={500}
            />
          </p>
          <p className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="font-semibold text-foreground">{t('contact.company')}</span>
            <a
              href="https://reacting.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              aria-label={`${t('contact.homepageBadge')} — reacting.kr`}
            >
              <Badge
                variant="outline"
                className="cursor-pointer gap-1 transition-colors hover:bg-surface"
              >
                {t('contact.homepageBadge')}
                <span aria-hidden="true">↗</span>
              </Badge>
            </a>
          </p>
        </div>

        {isDone ? (
          <div className="mt-6 border border-border-default bg-surface p-6 text-center">
            <p className="text-sm font-medium text-foreground">{t('contact.successTitle')}</p>
            <p className="mt-1 text-xs text-foreground-muted">{t('contact.successBody')}</p>
            <DialogClose asChild>
              <Button className="mt-4" variant="ghost">
                {t('contact.close')}
              </Button>
            </DialogClose>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-foreground">
                {t('contact.fieldTitle')}{' '}
                <span aria-hidden="true" className="text-danger">
                  *
                </span>
              </span>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={120}
                disabled={isSubmitting}
                placeholder={t('contact.fieldTitlePlaceholder')}
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-foreground">
                {t('contact.fieldContent')}{' '}
                <span aria-hidden="true" className="text-danger">
                  *
                </span>
              </span>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                maxLength={5000}
                disabled={isSubmitting}
                rows={6}
                placeholder={t('contact.fieldContentPlaceholder')}
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-foreground">
                {t('contact.fieldEmail')}{' '}
                <span className="text-foreground-subtle">({t('contact.optional')})</span>
              </span>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                placeholder="you@example.com"
                aria-describedby="contact-email-hint"
              />
              <span id="contact-email-hint" className="text-xs text-foreground-subtle">
                {t('contact.fieldEmailHint')}
              </span>
            </label>

            {status === 'error' && (
              <div
                role="alert"
                className="border border-danger bg-surface px-3 py-2 text-sm text-danger"
              >
                {errorMsg}
              </div>
            )}

            <DialogFooter className="mt-2">
              <DialogClose asChild>
                <Button type="button" variant="ghost" disabled={isSubmitting}>
                  {t('contact.cancel')}
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('contact.sending') : t('contact.send')}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
