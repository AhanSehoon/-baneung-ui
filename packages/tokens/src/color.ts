/**
 * 컬러 토큰.
 *
 * 두 층으로 구성됩니다:
 *  1. **Primitive** — 변하지 않는 색상 팔레트 (브랜드 navy/teal + 중립 grey).
 *     컴포넌트가 직접 참조하지 말고 Semantic을 거치세요.
 *  2. **Semantic** — 역할(bg/text/border/...)별 토큰. light/dark 두 세트.
 *     컴포넌트는 항상 이 layer를 사용합니다.
 *
 * 브랜드 anchor (CLAUDE.md 5.1):
 *   - baneung-navy-900: #1F2937
 *   - baneung-navy-700: #3B4B63
 *   - baneung-navy-500: #6B7280
 *   - baneung-teal-500: #5BA8A0
 */

export const colorPrimitive = {
  /**
   * 중립 그레이. 본문/보더/배경에 광범위하게 사용.
   */
  neutral: {
    0: '#FFFFFF',
    50: '#F8F9FA',
    100: '#F1F3F5',
    200: '#E9ECEF',
    300: '#DEE2E6',
    400: '#CED4DA',
    500: '#ADB5BD',
    600: '#868E96',
    700: '#495057',
    800: '#343A40',
    900: '#212529',
    1000: '#000000',
  },
  /**
   * 바능 브랜드 네이비. 로고에서 추출한 3개 anchor(500/700/900)를 기준으로 보간한 11단계.
   * 텍스트 1차, 인버스 표면, 강조 보더에 사용.
   */
  baneungNavy: {
    50: '#F1F3F6',
    100: '#DEE3EA',
    200: '#C0C7D2',
    300: '#9CA5B3',
    400: '#818A99',
    500: '#6B7280',
    600: '#525C70',
    700: '#3B4B63',
    800: '#2A3645',
    900: '#1F2937',
  },
  /**
   * 바능 브랜드 청록. 시그니처 액센트 — 포커스 링, 인터랙티브 강조에만 사용.
   * 본문 컬러로 사용하지 마세요.
   */
  baneungTeal: {
    50: '#EBF6F4',
    100: '#D5EDE9',
    200: '#ADDBD3',
    300: '#85C9BD',
    400: '#6CB7AB',
    500: '#5BA8A0',
    600: '#4B8C85',
    700: '#3B716C',
    800: '#2C5552',
    900: '#1D3A37',
  },
} as const;

/**
 * 시맨틱 컬러 (라이트 모드).
 * 컴포넌트는 이 토큰만 사용합니다 — primitive 직접 참조 금지.
 */
export const colorSemanticLight = {
  bg: {
    canvas: '#FFFFFF',
    surface: '#F8F9FA',
    surfaceStrong: '#F1F3F5',
    inverse: '#1F2937',
    overlay: 'rgba(31, 41, 55, 0.5)',
  },
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    tertiary: '#9CA5B3',
    inverse: '#FFFFFF',
    link: '#3B716C',
  },
  border: {
    subtle: '#F1F3F5',
    default: '#E9ECEF',
    strong: '#3B4B63',
  },
  focus: {
    // teal-700 (#3B716C) — teal-500은 흰 배경 위 2.78:1로 WCAG UI 3:1 미달.
    // 라이트 모드는 진한 teal로 가시성 확보.
    ring: '#3B716C',
  },
  status: {
    success: '#16A34A',
    warning: '#D97706',
    danger: '#DC2626',
    info: '#2563EB',
  },
} as const;

/**
 * 시맨틱 컬러 (다크 모드).
 * `[data-theme="dark"]` 셀렉터로 :root 값을 덮어씁니다.
 */
export const colorSemanticDark = {
  bg: {
    canvas: '#1F2937',
    surface: '#2A3645',
    surfaceStrong: '#3B4B63',
    inverse: '#F1F3F6',
    overlay: 'rgba(0, 0, 0, 0.6)',
  },
  text: {
    primary: '#F1F3F6',
    secondary: '#C0C7D2',
    tertiary: '#9CA5B3',
    inverse: '#1F2937',
    link: '#85C9BD',
  },
  border: {
    subtle: '#2A3645',
    default: '#3B4B63',
    strong: '#9CA5B3',
  },
  focus: {
    // 다크 모드는 navy-900 위라 teal-300(#85C9BD)이 충분한 가시성 확보 (≈ 8:1).
    ring: '#85C9BD',
  },
  status: {
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
  },
} as const;

export type ColorPrimitive = typeof colorPrimitive;
export type ColorSemantic = typeof colorSemanticLight;
