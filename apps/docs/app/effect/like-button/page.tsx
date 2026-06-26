'use client';

import * as React from 'react';

import { LikeButton } from '@baneung-pack/ui';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Heading,
  Lead,
  Separator,
} from '@baneung-pack/ui';

import { useI18n } from '@/components/i18n-provider';

export default function LikeButtonDemoPage() {
  const { t } = useI18n();
  const [liked, setLiked] = React.useState(false);
  const [count, setCount] = React.useState(42);

  // 토글 시 count 자동 증감.
  function handleChange(next: boolean) {
    setLiked(next);
    setCount((c) => (next ? c + 1 : Math.max(0, c - 1)));
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>LikeButton</Heading>
        <Lead>
          클릭 시 하트가 채워지며 주변에 작은 입자가 터지는 burst 애니메이션. controlled/
          uncontrolled · 카운트 표시 · 키보드 토글.
        </Lead>
      </header>
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Controlled + count 자동 증감</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-8">
          <LikeButton liked={liked} onLikedChange={handleChange} count={count} size="lg" />
          <span className="text-xs text-foreground-muted">
            현재:{' '}
            <code>
              liked={String(liked)}, count={count}
            </code>
          </span>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>크기 변형</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-8">
          <LikeButton size="sm" defaultLiked count={12} />
          <LikeButton size="md" count={128} />
          <LikeButton size="lg" defaultLiked count={1234} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>색상 변형</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-6">
          <LikeButton color="#FF2D78" defaultLiked count={1} />
          <LikeButton color="#DC2626" defaultLiked count={2} />
          <LikeButton color="#F59E0B" burstColor="#FFD93D" defaultLiked count={3} />
          <LikeButton color="#16A34A" defaultLiked count={4} />
          <LikeButton color="#3B82F6" defaultLiked count={5} />
          <LikeButton color="#A21CAF" defaultLiked count={6} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>burst 입자 개수</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-8">
          <LikeButton burstCount={4} size="lg" />
          <LikeButton burstCount={8} size="lg" />
          <LikeButton burstCount={12} size="lg" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>비활성화</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <LikeButton disabled count={0} />
          <LikeButton disabled defaultLiked count={99} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>사용</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto bg-surface p-4 text-sm leading-relaxed">
            <code>{`import { LikeButton } from '@baneung-pack/ui';

// Controlled + count
<LikeButton
  liked={liked}
  onLikedChange={setLiked}
  count={count}
  size="lg"
/>

// Uncontrolled
<LikeButton defaultLiked count={42} />

// 커스텀 색
<LikeButton color="#F59E0B" burstColor="#FFD93D" />

// 카운트 없이 — 아이콘만
<LikeButton />`}</code>
          </pre>
        </CardContent>
      </Card>

      <Separator />
      <Heading level={2}>{t('componentShell.apiHeading')}</Heading>
      <Card>
        <CardHeader>
          <CardTitle>LikeButtonProps</CardTitle>
        </CardHeader>
        <CardContent>
          <ApiTable rows={PROPS} />
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
  { name: 'liked', type: 'boolean', default: '—', desc: 'Controlled 좋아요 상태.' },
  { name: 'defaultLiked', type: 'boolean', default: 'false', desc: 'Uncontrolled 초기값.' },
  { name: 'onLikedChange', type: '(liked: boolean) => void', default: '—', desc: '변경 콜백.' },
  { name: 'count', type: 'number', default: '—', desc: '카운트 표시 (선택).' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '비활성화.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: '크기.' },
  { name: 'color', type: 'string', default: "'#FF2D78'", desc: '채워진 하트 색.' },
  { name: 'emptyColor', type: 'string', default: "'#9CA5B3'", desc: '빈 하트 stroke.' },
  { name: 'burstColor', type: 'string', default: '= color', desc: 'burst 입자 색.' },
  { name: 'burstCount', type: 'number', default: '6', desc: 'burst 입자 개수.' },
  { name: 'aria-label', type: 'string', default: "'좋아요'", desc: '보조 기술 라벨.' },
];
