'use client';

import {
  Card,
  CardContent,
  Heading,
  Kbd,
  Lead,
  Muted,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@baneung-pack/ui';

import { useI18n } from '@/components/i18n-provider';

/** 8개 체크리스트 — i18n 키만 들고 본문은 t()로 번역. */
const checklistKeys = [
  'a11y.checklist.0',
  'a11y.checklist.1',
  'a11y.checklist.2',
  'a11y.checklist.3',
  'a11y.checklist.4',
  'a11y.checklist.5',
  'a11y.checklist.6',
  'a11y.checklist.7',
];

/** 9개 단축키 + 번역 키. keys는 문자 그대로(시각 키캡). */
const shortcuts: { keys: string[]; descKey: string }[] = [
  { keys: ['⌘', 'K'], descKey: 'a11y.shortcut.cmdK' },
  { keys: ['Esc'], descKey: 'a11y.shortcut.esc' },
  { keys: ['Tab'], descKey: 'a11y.shortcut.tab' },
  { keys: ['Shift', 'Tab'], descKey: 'a11y.shortcut.shiftTab' },
  { keys: ['Space'], descKey: 'a11y.shortcut.space' },
  { keys: ['Enter'], descKey: 'a11y.shortcut.enter' },
  { keys: ['↑', '↓'], descKey: 'a11y.shortcut.upDown' },
  { keys: ['←', '→'], descKey: 'a11y.shortcut.leftRight' },
  { keys: ['Home', 'End'], descKey: 'a11y.shortcut.homeEnd' },
];

export default function AccessibilityPage() {
  const { t, locale } = useI18n();
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>{t('a11y.title')}</Heading>
        <Lead>{t('a11y.lead')}</Lead>
      </header>

      <Separator />

      <section className="flex flex-col gap-4">
        <Heading level={2}>{t('a11y.checklistTitle')}</Heading>
        <Muted>{t('a11y.checklistIntro')}</Muted>
        <Card variant="outlined">
          <CardContent className="p-6">
            <ul className="flex flex-col gap-2">
              {checklistKeys.map((key) => (
                <li key={key} className="flex items-start gap-2 text-sm">
                  <span aria-hidden="true" className="mt-0.5 text-success">
                    ✓
                  </span>
                  <span>{t(key)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="flex flex-col gap-4">
        <Heading level={2}>{t('a11y.shortcutsTitle')}</Heading>
        <Muted>{t('a11y.shortcutsIntro')}</Muted>
        <Card variant="outlined">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('a11y.shortcutKeyLabel')}</TableHead>
                  <TableHead>{t('a11y.shortcutActionLabel')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shortcuts.map((s, i) => (
                  <TableRow key={i}>
                    <TableCell className="space-x-1">
                      {s.keys.map((k, j) => (
                        <Kbd key={j}>{k}</Kbd>
                      ))}
                    </TableCell>
                    <TableCell>{t(s.descKey)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      {locale === 'ko' && (
        <section className="flex flex-col gap-4">
          <Heading level={2}>한글 IME</Heading>
          <Muted>
            Input/Textarea에서 한글 조합 중 Enter는 submit을 트리거하지 않습니다.
            <code className="ml-1 font-mono text-xs">useComposition</code> 훅으로 자동 처리.
          </Muted>
        </section>
      )}

      <section className="flex flex-col gap-4">
        <Heading level={2}>{t('a11y.motionTitle')}</Heading>
        <Muted>{t('a11y.motionIntro')}</Muted>
        <Card variant="outlined">
          <CardContent className="p-6">
            <ul className="flex flex-col gap-2 text-sm">
              <li className="flex items-start gap-2">
                <span aria-hidden="true" className="mt-0.5 text-success">
                  ✓
                </span>
                <span>{t('a11y.motion.reduced')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span aria-hidden="true" className="mt-0.5 text-success">
                  ✓
                </span>
                <span>{t('a11y.motion.ariaLabel')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span aria-hidden="true" className="mt-0.5 text-success">
                  ✓
                </span>
                <span>{t('a11y.motion.ariaHidden')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span aria-hidden="true" className="mt-0.5 text-success">
                  ✓
                </span>
                <span>{t('a11y.motion.touch')}</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
