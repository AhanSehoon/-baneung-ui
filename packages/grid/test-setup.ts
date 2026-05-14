/**
 * Vitest 글로벌 setup.
 * - @testing-library/jest-dom 매처 주입
 * - 매 테스트 후 RTL cleanup (vitest globals=false 환경에서 필수)
 * - jsdom 미구현 API 폴리필 (@tanstack/react-virtual이 ResizeObserver 사용)
 */
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

import '@testing-library/jest-dom/vitest';

afterEach(() => {
  cleanup();
});

const noop = (): void => undefined;

// jsdom에는 ResizeObserver가 없습니다. @tanstack/react-virtual이 사용.
if (typeof globalThis.ResizeObserver === 'undefined') {
  class ResizeObserverNoop {
    observe = noop;
    unobserve = noop;
    disconnect = noop;
  }
  globalThis.ResizeObserver = ResizeObserverNoop as unknown as typeof ResizeObserver;
}
