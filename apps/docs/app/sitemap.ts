import { componentMetadata } from '@/lib/components-metadata';
import { siteConfig, siteRoutes } from '@/lib/site';

import type { MetadataRoute } from 'next';

/**
 * 동적 sitemap — `/sitemap.xml`로 노출.
 *
 * 포함:
 * - siteRoutes (lib/site.ts) — 정적 핵심 라우트
 * - componentMetadata — 컴포넌트 [slug] 페이지 전체
 *
 * lastModified는 빌드 시점. 컨텐츠가 자주 변하지 않는 문서 사이트라 적정.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = siteRoutes.map((r) => ({
    url: `${siteConfig.url}${r.path}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: r.priority,
  }));

  const componentRoutes: MetadataRoute.Sitemap = componentMetadata.map((c) => ({
    url: `${siteConfig.url}/components/${c.slug}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...componentRoutes];
}
