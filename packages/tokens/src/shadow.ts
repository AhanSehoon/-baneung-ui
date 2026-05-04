/**
 * 그림자 토큰.
 * 미니멀 디자인 — `sm`/`md` 두 단계만. 깊은 그림자는 의도적으로 제외.
 * 색은 navy-900에 알파를 적용해 브랜드 톤을 유지합니다.
 */

export const shadow = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(31, 41, 55, 0.05)',
  md: '0 2px 4px -1px rgba(31, 41, 55, 0.10), 0 1px 2px -1px rgba(31, 41, 55, 0.06)',
} as const;

export type Shadow = typeof shadow;
