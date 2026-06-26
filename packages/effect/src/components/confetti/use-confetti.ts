import * as React from 'react';

import { ConfettiContext } from './confetti-context';

import type { ConfettiApi } from './types';

/**
 * Confetti API. `<ConfettiProvider>` 안에서만 사용 가능.
 *
 * @example
 *   const confetti = useConfetti();
 *   confetti.fire(); // 화면 가운데 하단에서 발사
 *   confetti.fire({ particleCount: 200, origin: buttonRef.current });
 */
export function useConfetti(): ConfettiApi {
  const ctx = React.useContext(ConfettiContext);
  if (!ctx) {
    throw new Error(
      '[@baneung-pack/effect] useConfetti must be used within a <ConfettiProvider>. ' +
        '루트 (예: app/layout.tsx) 또는 페이지 상단에 <ConfettiProvider>를 마운트하세요.',
    );
  }
  return ctx;
}
