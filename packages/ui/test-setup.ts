/**
 * Vitest 글로벌 setup.
 * - @testing-library/jest-dom 매처(toBeInTheDocument 등) 주입
 * - 매 테스트 후 RTL cleanup (vitest globals=false 환경에서 필수)
 * - jsdom 미구현 API 폴리필 (ResizeObserver, pointer capture 등 — Radix가 사용)
 */
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

import '@testing-library/jest-dom/vitest';

afterEach(() => {
  cleanup();
});

// jsdom 폴리필용 noop — 실제 트래킹 로직 없이 호출만 흡수.
const noop = (): void => undefined;

// jsdom에는 ResizeObserver가 없습니다. Radix Slider/ScrollArea 등이 사용하므로 noop 폴리필.
if (typeof globalThis.ResizeObserver === 'undefined') {
  class ResizeObserverNoop {
    observe = noop;
    unobserve = noop;
    disconnect = noop;
  }
  globalThis.ResizeObserver = ResizeObserverNoop as unknown as typeof ResizeObserver;
}

// jsdom에는 IntersectionObserver가 없습니다. embla-carousel(Carousel)이 사용 — noop 폴리필.
if (typeof globalThis.IntersectionObserver === 'undefined') {
  class IntersectionObserverNoop {
    readonly root = null;
    readonly rootMargin = '';
    readonly thresholds: number[] = [];
    observe = noop;
    unobserve = noop;
    disconnect = noop;
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }
  globalThis.IntersectionObserver =
    IntersectionObserverNoop as unknown as typeof IntersectionObserver;
}

// jsdom에는 PointerEvent capture 메서드가 없습니다 — Radix가 일부 컴포넌트에서 사용.
if (typeof Element !== 'undefined') {
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = (): boolean => false;
  }
  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = (): void => undefined;
  }
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = (): void => undefined;
  }
}

// jsdom에는 window.matchMedia가 없습니다 — vaul (Drawer) 등이 사용.
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: (): void => undefined,
    removeListener: (): void => undefined,
    addEventListener: (): void => undefined,
    removeEventListener: (): void => undefined,
    dispatchEvent: (): boolean => false,
  });
}
