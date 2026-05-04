/**
 * 모션 토큰.
 * `prefers-reduced-motion: reduce` 시 모든 애니메이션은 반드시 비활성화합니다.
 */

export const motion = {
  duration: {
    fast: '100ms',
    base: '150ms',
    slow: '250ms',
  },
  /**
   * cubic-bezier easing.
   * - standard: 일반 진입/퇴장 (Material 표준 곡선)
   * - accelerate: 화면 밖으로 나가는 모션
   * - decelerate: 화면 안으로 들어오는 모션
   */
  easing: {
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
    decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
  },
} as const;

export type Motion = typeof motion;
