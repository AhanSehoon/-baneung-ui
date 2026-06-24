import { siteConfig } from './site';

import type { Metadata } from 'next';

/**
 * 페이지 단위 메타데이터 빌더.
 *
 * root layout이 OG/Twitter 기본값을 제공하므로 페이지에선 title·description·path만
 * 넘기면 canonical/og:url/og:title 등이 자동으로 페이지 단위로 override됨.
 */
export function buildPageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  /** OG image 경로 override. 기본은 site OG image. */
  image?: string;
  /** OG type. 기본 'website'. 글/문서성 페이지는 'article'. */
  type?: 'website' | 'article';
  /** noindex 등 추가 robots 설정. */
  noIndex?: boolean;
}): Metadata {
  const { title, description, path, image, type = 'website', noIndex } = opts;
  const url = path;
  const ogImage = image ?? siteConfig.ogImage;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    ...(noIndex && { robots: { index: false, follow: false } }),
  };
}
