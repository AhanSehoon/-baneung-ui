/**
 * @baneung-pack/chart 기본 컬러 팔레트.
 *
 * 바능 브랜드 가이드라인의 navy/teal 계열을 차트 기본값으로 사용.
 * 소비자가 데이텀별로 `color`를 지정하면 그게 우선.
 */
export const CHART_COLORS = {
  /** 바능 navy — 막대 기본 색 (로고 dark). */
  baneungNavy: '#1F2937',
  /** 바능 navy mid — hover 강조용. */
  baneungNavyMid: '#3B4B63',
  /** 바능 teal — 액센트 / 강조 막대. */
  baneungTeal: '#5BA8A0',
  /** 바닥 plane 색 (밝은 회색). */
  ground: '#E5E7EB',
  /** 라벨 텍스트 색. */
  label: '#1F2937',
  /** 툴팁 배경. */
  tooltipBg: 'rgba(31, 41, 55, 0.92)',
  /** 툴팁 텍스트. */
  tooltipText: '#FFFFFF',
} as const;
