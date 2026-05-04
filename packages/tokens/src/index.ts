/**
 * @baneung-pack/tokens — 디자인 토큰 SSOT.
 *
 * 모든 컴포넌트 스타일은 여기서 정의된 토큰만 참조합니다.
 * 빌드 후 다음 3개 산출물이 함께 배포됩니다:
 *   - dist/tokens.js / .cjs / .d.ts — TS/JS import
 *   - dist/tokens.css                — CSS 변수 (`:root` + `[data-theme="dark"]`)
 *   - dist/tokens.json               — Style Dictionary 호환 평면 키
 *
 * @see ../../../CLAUDE.md §5
 * @see ../../../PROJECT_PLAN.md §7
 */

export * from './breakpoint';
export * from './color';
export * from './motion';
export * from './radius';
export * from './shadow';
export * from './spacing';
export * from './typography';
export * from './z-index';

export const TOKENS_VERSION = '0.0.0';
