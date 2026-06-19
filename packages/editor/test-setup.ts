/**
 * Vitest 글로벌 setup.
 * - @testing-library/jest-dom 매처 주입
 * - 매 테스트 후 RTL cleanup (vitest globals=false 환경에서 필수)
 * - jsdom 미구현 API 폴리필 (execCommand / queryCommandState)
 */
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

import '@testing-library/jest-dom/vitest';

afterEach(() => {
  cleanup();
});

const noop = (): boolean => false;

// jsdom에는 document.execCommand / queryCommandState가 구현되어 있지 않습니다.
// 에디터 명령 호출이 throw하지 않도록 no-op 폴리필을 주입합니다.
if (typeof document !== 'undefined') {
  if (typeof document.execCommand !== 'function') {
    document.execCommand = noop as unknown as typeof document.execCommand;
  }
  if (typeof document.queryCommandState !== 'function') {
    document.queryCommandState = noop as unknown as typeof document.queryCommandState;
  }
  if (typeof document.queryCommandValue !== 'function') {
    document.queryCommandValue = (() => '') as unknown as typeof document.queryCommandValue;
  }
}
