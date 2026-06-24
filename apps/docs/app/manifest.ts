import { siteConfig } from '@/lib/site';

import type { MetadataRoute } from 'next';

/**
 * Web App Manifest — `/manifest.webmanifest`로 노출.
 * 모바일 홈 추가 시 앱 이름·아이콘·테마 컬러 통일.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1f2937',
    lang: 'ko',
    icons: [
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
      { src: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
    ],
  };
}
