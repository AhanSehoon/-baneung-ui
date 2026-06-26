import type { ReactNode } from 'react';

export type ConfettiShape = 'square' | 'circle' | 'ribbon';

/** confetti.fire() 호출 시 넘기는 옵션. */
export interface ConfettiFireOptions {
  /**
   * 발사 위치 — 한 가지로 지정.
   * - `{ x, y }`: viewport 픽셀 좌표
   * - `{ ratioX, ratioY }`: viewport 비율 0~1 (반응형 용이)
   * - `HTMLElement`: 해당 요소의 중심에서 발사
   * - 미지정: 화면 가운데 하단
   */
  origin?: { x: number; y: number } | { ratioX: number; ratioY: number } | HTMLElement;
  /** 입자 개수. 기본 80. */
  particleCount?: number;
  /** 색상 배열 — 입자가 무작위로 선택. */
  colors?: string[];
  /** 입자 모양. 기본 'square'. */
  shape?: ConfettiShape;
  /** 발사 spread 각도 (deg). 기본 60. */
  spread?: number;
  /** 발사 각도 (deg, 0=오른쪽, 90=위, 180=왼쪽, 270=아래). 기본 90 (위). */
  angle?: number;
  /** 입자 초기 속도 픽셀/프레임. 기본 14. */
  velocity?: number;
  /** 중력 가속도 픽셀/프레임^2. 기본 0.5. */
  gravity?: number;
  /** 입자 수명 (frame). 기본 130. */
  ticks?: number;
  /** 입자 크기 (px). 기본 10. */
  size?: number;
}

/** useConfetti가 반환하는 API. */
export interface ConfettiApi {
  /** 한 번 발사. options 미지정 시 기본값. */
  fire: (options?: ConfettiFireOptions) => void;
}

export interface ConfettiProviderProps {
  children: ReactNode;
  /** z-index. 기본 2147483647 (max). */
  zIndex?: number;
}
