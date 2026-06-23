import { formatValue, type NumberFormat } from './format';

import type { ChartDatum } from './types';

/**
 * 접근성용 sr-only data table.
 *
 * # 왜 필요한가
 * canvas 차트는 시각적으로만 데이터를 표시 — 스크린리더가 읽을 수 없음.
 * WCAG 2.1 AA 준수 (1.1.1 Non-text Content)를 위해 동일한 데이터를
 * 시각적으로 숨긴(`sr-only`) HTML `<table>`로 함께 제공.
 *
 * `display: none`이 아닌 `sr-only` 패턴 (absolute + 1px clip)을 사용해
 * 스크린리더는 읽지만 시각적 레이아웃엔 영향 없음.
 *
 * # API
 * 차트 컴포넌트가 `data + keys + labels`를 그대로 전달.
 * 별도 데이터 변환 불필요 — 그리드/막대/선 차트가 같은 wide-format이라 통일 가능.
 */

interface ChartA11yTableProps {
  /** 차트와 같은 데이터. */
  data: ChartDatum[];
  /** X축(행 헤더)으로 쓸 키. */
  xKey: string;
  /** 시리즈(열 헤더)로 쓸 키들. */
  yKeys: string[];
  /** 시리즈 표시명 매핑 (헤더). 미지정 시 키 그대로. */
  labels?: Record<string, string>;
  /** 표 caption (스크린리더가 먼저 읽음). 미지정 시 비표시. */
  caption?: string;
  /** 숫자 셀 포맷 (차트 valueFormat과 동일하게 전달). */
  valueFormat?: NumberFormat;
}

/**
 * sr-only 클래스 인라인 스타일.
 * Tailwind의 `sr-only`와 동일 — 외부 CSS 의존 없이 패키지 단독 동작.
 */
const SR_ONLY_STYLE: React.CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

export function ChartA11yTable({
  data,
  xKey,
  yKeys,
  labels,
  caption,
  valueFormat = 'plain',
}: ChartA11yTableProps) {
  if (data.length === 0) return null;
  return (
    <table style={SR_ONLY_STYLE} aria-hidden={false}>
      {caption && <caption>{caption}</caption>}
      <thead>
        <tr>
          <th scope="col">{xKey}</th>
          {yKeys.map((k) => (
            <th key={k} scope="col">
              {labels?.[k] ?? k}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            <th scope="row">{String(row[xKey] ?? '')}</th>
            {yKeys.map((k) => (
              <td key={k}>{formatValue(row[k], valueFormat)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/**
 * 카테고리형 차트(Pie/Doughnut)용 sr-only 테이블 — name/value 단일 시리즈.
 */
interface ChartA11yCategoryTableProps {
  data: ChartDatum[];
  nameKey: string;
  valueKey: string;
  caption?: string;
  valueFormat?: NumberFormat;
}

export function ChartA11yCategoryTable({
  data,
  nameKey,
  valueKey,
  caption,
  valueFormat = 'plain',
}: ChartA11yCategoryTableProps) {
  if (data.length === 0) return null;
  // 퍼센트 계산 — 파이/도넛은 비율이 더 의미 있음.
  const total = data.reduce((sum, row) => sum + (Number(row[valueKey]) || 0), 0) || 1;
  return (
    <table style={SR_ONLY_STYLE} aria-hidden={false}>
      {caption && <caption>{caption}</caption>}
      <thead>
        <tr>
          <th scope="col">{nameKey}</th>
          <th scope="col">{valueKey}</th>
          <th scope="col">비율</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => {
          const v = Number(row[valueKey]) || 0;
          return (
            <tr key={i}>
              <th scope="row">{String(row[nameKey] ?? '')}</th>
              <td>{formatValue(v, valueFormat)}</td>
              <td>{((v / total) * 100).toFixed(1)}%</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
