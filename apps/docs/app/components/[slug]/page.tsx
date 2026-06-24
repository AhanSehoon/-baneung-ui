import { notFound } from 'next/navigation';

import { ComponentShellLoader } from '@/components/component-shell-loader';
import { componentMetadata, findComponentMeta } from '@/lib/components-metadata';

import type { Metadata } from 'next';

export function generateStaticParams() {
  return componentMetadata.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const meta = findComponentMeta(params.slug);
  if (!meta) return {};
  const title = `${meta.title} — @baneung-pack/ui`;
  const path = `/components/${meta.slug}`;
  return {
    title,
    description: meta.description,
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      title,
      description: meta.description,
      url: path,
    },
    twitter: { title, description: meta.description },
  };
}

export default function ComponentDetailPage({ params }: { params: { slug: string } }) {
  const meta = findComponentMeta(params.slug);
  if (!meta) {
    notFound();
  }
  // 실제 라이브 예제·API 테이블은 client에서 registry를 조회해 렌더.
  return <ComponentShellLoader slug={params.slug} />;
}
