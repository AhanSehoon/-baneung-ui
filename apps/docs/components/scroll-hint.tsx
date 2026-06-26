'use client';

import * as React from 'react';

/**
 * ScrollHint — 큰 세로 공백 사이에 배치하는 "아래로 스크롤하세요" 인디케이터.
 *
 * - 부드럽게 위아래로 bobbing하는 chevron 두 줄 + 라벨.
 * - `prefers-reduced-motion: reduce` 시 애니메이션 정지 (정적 아이콘만 표시).
 * - 의미 부족한 데코라티브 UI라 `aria-hidden`.
 *
 * SplitTextReveal / CountUp 등 inView 트리거 데모의 60vh 갭 사이에 사용.
 */
export function ScrollHint({ label = '아래로 스크롤' }: { label?: string }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none flex flex-col items-center justify-center gap-2 py-12 text-foreground-subtle"
    >
      <span className="text-xs uppercase tracking-[0.25em]">{label}</span>
      <svg
        viewBox="0 0 24 32"
        width="24"
        height="32"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="baneung-scroll-hint-bob"
      >
        <path d="M5 12 L12 19 L19 12" />
        <path d="M5 20 L12 27 L19 20" />
      </svg>
      <style>{`
        @keyframes baneung-scroll-hint-bob {
          0%, 100% { transform: translateY(0); opacity: 0.6; }
          50% { transform: translateY(6px); opacity: 1; }
        }
        .baneung-scroll-hint-bob {
          animation: baneung-scroll-hint-bob 1.6s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .baneung-scroll-hint-bob { animation: none; opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
