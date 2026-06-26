import type { CSSProperties } from 'react';

/**
 * CircularText — 원형 경로를 따라 배치된 텍스트가 회전.
 *
 * 배지/도장/CD 라벨/스피너 라벨 등에 사용.
 *
 * @example
 *   <CircularText text="BANEUNG · DESIGN · SYSTEM · " radius={80} />
 */
export interface CircularTextProps {
  /** 표시할 텍스트. 한 바퀴를 채우려면 마침표·구분자로 자연스럽게 끝나는 게 좋음. */
  text: string;
  /** 원의 반지름 (px). 컨테이너 크기는 (radius*2 + fontSize)로 자동 계산. 기본 80. */
  radius?: number;
  /** 한 바퀴 회전 시간 (ms). 0 또는 음수면 회전 정지. 기본 12000. */
  durationMs?: number;
  /** 회전 방향. cw = 시계, ccw = 반시계. 기본 'cw'. */
  direction?: 'cw' | 'ccw';
  /** 시작 각도 (deg). 0이면 12시 방향. 기본 0. */
  startAngleDeg?: number;

  // ── 시각 커스터마이즈 ─────────────────────────────────────────────────────
  fontSize?: string | number;
  fontWeight?: CSSProperties['fontWeight'];
  color?: string;

  // ── HTML 표준 ────────────────────────────────────────────────────────────
  className?: string;
  style?: CSSProperties;
}
