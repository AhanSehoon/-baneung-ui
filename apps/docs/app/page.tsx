'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

/**
 * Canvas 2D scene — client-only (window/canvas 즉시 참조).
 */
const HomeScene = dynamic(() => import('@/components/home-scene').then((m) => m.HomeScene), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-white text-sm text-foreground-muted">
      Loading…
    </div>
  ),
});

/**
 * 홈 페이지 — 36 Days of Type 스타일 (흰 배경 + 검정 컴포넌트명 텍스트가 떨어지며 쌓임).
 *
 * 오버레이 최소화: 좌상단 타이틀 + 좌하단 CTA. 조작 안내 등은 의도적으로 생략.
 */
export default function HomePage() {
  return (
    <main className="relative h-[calc(100vh-3.5rem)] overflow-hidden bg-white">
      <div className="absolute inset-0">
        <HomeScene />
      </div>

      {/* ── 좌상단: 타이틀 ─────────────────────────────────────────────────── */}
      <div className="pointer-events-none absolute left-4 top-4 z-10 flex flex-col gap-1 md:left-8 md:top-8">
        <div className="text-[10px] uppercase tracking-[0.3em] text-foreground-muted">
          @baneung-pack · v1.0
        </div>
        {/* 브랜드 토큰 그라데이션 — packages/tokens/src/color.ts의 baneungNavy + baneungTeal 팔레트.
            BANEUNG (line 1): navy-900 → navy-700 → teal-700 — 묵직하게 시작
            Design System (line 2): teal-700 → teal-500 → teal-300 — 액센트로 가볍게 마무리
            두 줄이 teal-700(#3B716C)에서 자연스럽게 연결. */}
        <h1 className="font-black leading-[0.9] tracking-tighter">
          <span
            className="block bg-clip-text text-[40px] text-transparent md:text-[88px]"
            style={{
              backgroundImage: 'linear-gradient(135deg, #1F2937 0%, #3B4B63 55%, #3B716C 100%)',
            }}
          >
            BANEUNG
          </span>
          <span
            className="block bg-clip-text text-[26px] text-transparent md:text-[56px]"
            style={{
              backgroundImage: 'linear-gradient(135deg, #3B716C 0%, #5BA8A0 55%, #85C9BD 100%)',
            }}
          >
            Design System
          </span>
        </h1>
        <p className="mt-3 max-w-[16rem] text-xs leading-relaxed text-foreground-muted md:max-w-sm md:text-sm">
          판교에서 만든 디자인 시스템 — UI · Grid · Chart · Editor.
          <br />
          각진 디자인, WCAG AA 접근성, 한글 우선.
        </p>
      </div>

      {/* ── 좌하단: CTA ────────────────────────────────────────────────────── */}
      <div className="pointer-events-auto absolute bottom-4 left-4 z-10 flex flex-wrap gap-2 md:bottom-8 md:left-8">
        <Link
          href="/intro"
          className="inline-flex h-10 items-center border border-foreground bg-white px-5 text-xs font-semibold uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-foreground hover:text-foreground-inverse"
        >
          패키지 둘러보기 →
        </Link>
        <Link
          href="/install"
          className="inline-flex h-10 items-center px-5 text-xs font-semibold uppercase tracking-[0.2em] text-foreground-muted transition-colors hover:text-foreground"
        >
          설치 가이드
        </Link>
      </div>
    </main>
  );
}
