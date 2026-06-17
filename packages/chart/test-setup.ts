/**
 * Vitest 글로벌 setup.
 * - @testing-library/jest-dom 매처 주입
 * - 매 테스트 후 RTL cleanup
 * - jsdom 미구현 API 폴리필 (R3F가 ResizeObserver / WebGL 컨텍스트 요구)
 *
 * Three.js / R3F 자체는 jsdom 환경에서 WebGL 미존재로 렌더가 불가하므로
 * Three.js를 거치는 통합 테스트는 mock 또는 vitest의 happy-dom + GL stub로 별도 처리.
 * 현재 단계의 테스트는 데이터/스케일 유틸 위주.
 */
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

import '@testing-library/jest-dom/vitest';

afterEach(() => {
  cleanup();
});

const noop = (): void => undefined;

if (typeof globalThis.ResizeObserver === 'undefined') {
  class ResizeObserverNoop {
    observe = noop;
    unobserve = noop;
    disconnect = noop;
  }
  globalThis.ResizeObserver = ResizeObserverNoop as unknown as typeof ResizeObserver;
}
