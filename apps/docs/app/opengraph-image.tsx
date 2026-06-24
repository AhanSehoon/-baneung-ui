import { ImageResponse } from 'next/og';

import { siteConfig } from '@/lib/site';

export const runtime = 'edge';
export const alt = '바능 디자인 시스템 (Baneung Design System)';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Open Graph 이미지 — Next.js의 ImageResponse(Satori)로 동적 생성.
 *
 * - 홈 페이지의 그라데이션 BANEUNG / Design System 타이틀과 통일감.
 * - 흰 배경, 큰 검정 타이포 + 컬러 액센트 → 36 Days of Type 스타일 카드.
 * - SNS/메신저 미리보기 (카카오톡·슬랙·디스코드·트위터·페이스북)에 노출.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '64px 80px',
        background: '#ffffff',
        fontFamily: 'sans-serif',
      }}
    >
      {/* 상단 마크 */}
      <div
        style={{
          fontSize: 22,
          letterSpacing: 6,
          color: '#6B7280',
          textTransform: 'uppercase',
          fontWeight: 600,
        }}
      >
        @baneung-pack
      </div>

      {/* 메인 타이틀 — 두 줄 그라데이션 */}
      <div
        style={{
          marginTop: 40,
          display: 'flex',
          flexDirection: 'column',
          lineHeight: 0.9,
          letterSpacing: -4,
          fontWeight: 900,
        }}
      >
        <div
          style={{
            fontSize: 180,
            backgroundImage: 'linear-gradient(135deg, #1F2937 0%, #3B4B63 55%, #3B716C 100%)',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          BANEUNG
        </div>
        <div
          style={{
            fontSize: 120,
            backgroundImage: 'linear-gradient(135deg, #3B716C 0%, #5BA8A0 55%, #85C9BD 100%)',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Design System
        </div>
      </div>

      {/* 하단 부제 + 패키지 */}
      <div
        style={{
          marginTop: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div style={{ fontSize: 28, color: '#0a0e1a', fontWeight: 700 }}>{siteConfig.tagline}</div>
        <div style={{ fontSize: 20, color: '#6B7280' }}>
          각진 디자인 · WCAG AA 접근성 · 한글 우선 · 판교
        </div>
      </div>
    </div>,
    { ...size },
  );
}
