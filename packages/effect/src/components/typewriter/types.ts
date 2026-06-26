import type { CSSProperties } from 'react';

/**
 * Typewriter — 한 글자씩 타이핑되는 텍스트 + 선택적 깜빡이는 커서.
 */
export interface TypewriterProps {
  /** 표시할 텍스트. 변경되면 처음부터 다시 타이핑. */
  text: string;
  /** 타이핑 속도 (ms/char). 기본 50. */
  speedMs?: number;
  /** 지우는 속도 (ms/char). loop=true일 때만 의미. 기본 24. */
  eraseSpeedMs?: number;
  /** 다 친 뒤 지우기 시작까지 대기 (ms). loop=true일 때만. 기본 3000. */
  pauseAfterTypeMs?: number;
  /** 다 지운 뒤 다시 타이핑까지 대기 (ms). loop=true일 때만. 기본 450. */
  pauseAfterEraseMs?: number;
  /** true면 type → pause → erase → pause 무한 반복. false면 1회만. 기본 false. */
  loop?: boolean;
  /** 외부에서 강제 reset 트리거. 값이 바뀌면 처음부터. */
  resetKey?: number | string;

  // ── 시각 커스터마이즈 ─────────────────────────────────────────────────────
  /** 폰트 크기. CSS 값 (예: '24px', '1.5rem'). number면 px로 해석. */
  fontSize?: string | number;
  /** 폰트 굵기 (예: 400, 600, 'bold'). */
  fontWeight?: CSSProperties['fontWeight'];
  /** 텍스트 색상 (CSS color). 커서 색은 자동으로 텍스트 색을 따라감. */
  color?: string;

  // ── 커서 옵션 ────────────────────────────────────────────────────────────
  /** 커서 표시 여부. 기본 true. */
  showCursor?: boolean;
  /** 커서 색상. 미지정 시 텍스트 색(currentColor)을 따라감. */
  cursorColor?: string;
  /** 커서 두께 (px). 기본 2. */
  cursorWidth?: number;
  /**
   * 커서로 사용할 글자.
   * - 미지정: 얇은 막대 (line cursor).
   * - 지정 (예: '_', '▌', '|', '█'): 해당 글자를 깜빡임.
   */
  cursorChar?: string;

  // ── HTML 표준 ────────────────────────────────────────────────────────────
  /** 추가 className (소비자가 Tailwind 등으로 스타일링하고 싶을 때). */
  className?: string;
  /** 인라인 style — 위 fontSize/color/fontWeight보다 우선 적용. */
  style?: CSSProperties;
}
