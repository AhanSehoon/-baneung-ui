import { siteConfig } from '@/lib/site';

import type { MetadataRoute } from 'next';

/**
 * 동적 robots.txt — `/robots.txt`로 노출.
 *
 * - 모든 일반 검색엔진(Google/Naver/Bing) + AI 크롤러(GPTBot/ClaudeBot/PerplexityBot)에
 *   기본 허용. 디자인 시스템 문서는 GEO(생성형 검색 최적화)에 노출되는 게 유리.
 * - `/api/*`, Next 내부 경로는 제외.
 * - sitemap 위치 명시 → 크롤러가 빠르게 인덱싱.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/sample-*'],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
