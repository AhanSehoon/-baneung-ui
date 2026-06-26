'use client';

import * as React from 'react';

import { StarRating } from '@baneung-pack/ui';
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

export default function StarRatingDemoPage() {
  const { t } = useI18n();
  const [rating, setRating] = React.useState(3);
  const [halfRating, setHalfRating] = React.useState(2.5);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>StarRating</Heading>
        <Lead>
          별점 입력. hover preview · half-star · controlled/uncontrolled · 키보드 (Arrow / Home /
          End) · readOnly 모드.
        </Lead>
      </header>
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Controlled (정수)</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <StarRating value={rating} onValueChange={setRating} size="lg" />
          <span className="text-sm">
            현재 값: <code>{rating}</code> / 5
          </span>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Half-star (0.5 단위)</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <StarRating value={halfRating} onValueChange={setHalfRating} half size="lg" />
          <span className="text-sm">
            현재 값: <code>{halfRating}</code> / 5
          </span>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>크기 변형</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-8">
          <StarRating size="sm" defaultValue={3} />
          <StarRating size="md" defaultValue={4} />
          <StarRating size="lg" defaultValue={5} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>10점 만점</CardTitle>
        </CardHeader>
        <CardContent>
          <StarRating defaultValue={7} max={10} half />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>색상 커스터마이즈</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <StarRating defaultValue={3} color="#F59E0B" />
          <StarRating defaultValue={3} color="#DC2626" />
          <StarRating defaultValue={3} color="#3B716C" />
          <StarRating defaultValue={3} color="#A21CAF" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>readOnly (표시 전용)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3 text-sm text-foreground-muted">
            평균 평점 표시 등 — hover/클릭 비활성.
          </p>
          <StarRating value={4.5} half readOnly size="lg" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>비활성화</CardTitle>
        </CardHeader>
        <CardContent>
          <StarRating defaultValue={3} disabled />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>키보드 접근성</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3 text-sm text-foreground-muted">
            💡 Tab으로 포커스 → ArrowLeft/Right(또는 Up/Down)로 ±1 (half면 ±0.5), Home/End로 0/max.
          </p>
          <StarRating defaultValue={2.5} half size="lg" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>사용</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto bg-surface p-4 text-sm leading-relaxed">
            <code>{`import { StarRating } from '@baneung-pack/ui';

// Controlled
<StarRating value={rating} onValueChange={setRating} size="lg" />

// Half-star
<StarRating defaultValue={2.5} half onValueChange={save} />

// 10점 만점
<StarRating max={10} defaultValue={7} half />

// readOnly (평균 평점 표시)
<StarRating value={4.5} half readOnly />

// 색
<StarRating defaultValue={3} color="#3B716C" />`}</code>
          </pre>
        </CardContent>
      </Card>

      <Separator />
      <Heading level={2}>{t('componentShell.apiHeading')}</Heading>
      <Card>
        <CardHeader>
          <CardTitle>StarRatingProps</CardTitle>
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
  { name: 'value', type: 'number', default: '—', desc: 'Controlled (0~max).' },
  { name: 'defaultValue', type: 'number', default: '0', desc: 'Uncontrolled 초기값.' },
  { name: 'onValueChange', type: '(value: number) => void', default: '—', desc: '변경 콜백.' },
  { name: 'max', type: 'number', default: '5', desc: '별 개수.' },
  { name: 'half', type: 'boolean', default: 'false', desc: '0.5 단위 지원.' },
  { name: 'readOnly', type: 'boolean', default: 'false', desc: '표시만 (입력 X).' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '비활성화.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: '크기.' },
  { name: 'color', type: 'string', default: "'#F59E0B'", desc: '채워진 별 색.' },
  { name: 'emptyColor', type: 'string', default: "'#E9ECEF'", desc: '빈 별 색.' },
  { name: 'gap', type: 'number', default: '4', desc: '별 사이 간격 (px).' },
  { name: 'aria-label', type: 'string', default: "'별점'", desc: '보조 기술 라벨.' },
];
