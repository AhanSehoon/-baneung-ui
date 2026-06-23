/**
 * Vitest 글로벌 setup — jsdom 폴리필 + jest-dom 매처.
 *
 * chart.js는 canvas + ResizeObserver를 사용. jsdom은 둘 다 없으므로 mock.
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

// jsdom은 HTMLCanvasElement.getContext가 null 반환.
// chart.js가 호출하는 메서드들에 대해 no-op CanvasRenderingContext2D 모킹.
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = function getContext() {
    return {
      canvas: this,
      fillRect: noop,
      clearRect: noop,
      getImageData: () => ({ data: new Uint8ClampedArray(4) }),
      putImageData: noop,
      createImageData: () => ({}),
      setTransform: noop,
      drawImage: noop,
      save: noop,
      restore: noop,
      beginPath: noop,
      closePath: noop,
      moveTo: noop,
      lineTo: noop,
      bezierCurveTo: noop,
      quadraticCurveTo: noop,
      arc: noop,
      arcTo: noop,
      ellipse: noop,
      rect: noop,
      fill: noop,
      stroke: noop,
      clip: noop,
      isPointInPath: () => false,
      isPointInStroke: () => false,
      measureText: () => ({ width: 0 }),
      fillText: noop,
      strokeText: noop,
      translate: noop,
      rotate: noop,
      scale: noop,
      transform: noop,
      resetTransform: noop,
      createLinearGradient: () => ({ addColorStop: noop }),
      createRadialGradient: () => ({ addColorStop: noop }),
      createPattern: () => null,
    } as unknown as CanvasRenderingContext2D;
  } as typeof HTMLCanvasElement.prototype.getContext;
}
