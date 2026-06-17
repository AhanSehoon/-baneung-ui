import * as React from 'react';

import { cn } from '../../lib/cn';
import { CHART_COLORS } from '../../lib/colors';
import { computeBarXPositions, scaleHeight } from '../../lib/scale';
import { ChartCanvas } from '../chart-canvas';
import { Bar } from './bar';
import { BarLabel } from './bar-label';
import { GroundPlane } from './ground-plane';
import { Tooltip } from './tooltip';

import type { TooltipState } from './tooltip';
import type { BarChartDatum } from '../../lib/types';
import type { ThreeEvent } from '@react-three/fiber';

export interface BarChart3DProps {
  /** 차트 데이터. label 고유 + value 숫자. */
  data: BarChartDatum[];
  /** 가장 큰 값에 해당하는 막대 높이 (Three.js 단위). 기본 5. */
  maxHeight?: number;
  /** 각 막대의 가로/세로 크기. 기본 0.7. */
  barWidth?: number;
  /** 막대 간 간격. 기본 0.4. */
  gap?: number;
  /** 막대 기본 색상. 데이텀에 color가 있으면 그게 우선. 기본 바능 navy. */
  barColor?: string;
  /** 막대 상단 label 표시 여부. 기본 true. */
  showLabel?: boolean;
  /** 초기 카메라 위치. 기본 [5, 5, 5]. */
  cameraPosition?: [number, number, number];
  /** wrapper div 추가 className. */
  className?: string;
  /** 접근성 region 라벨. 기본 '3D 막대 차트'. */
  'aria-label'?: string;
}

/**
 * 3D Bar Chart — `@baneung-pack/chart`의 MVP 컴포넌트.
 *
 * # 데이터 → 시각화 파이프라인
 * 1. data로부터 d3 linear scale 생성 (`scaleHeight`)
 * 2. X 좌표 배열 계산 (`computeBarXPositions`) — 그룹 중앙 정렬
 * 3. 각 데이텀에 대해 `<Bar>` mesh + `<BarLabel>` text 렌더
 * 4. 막대 hover 시 화면 좌표 기록 → `<Tooltip>`이 HTML로 표시
 *
 * # 접근성
 * - Canvas는 `role="region"` + `aria-label`로 감싸짐 (ChartCanvas 책임).
 * - 별도 sr-only `<table>`로 데이터를 텍스트로도 제공 → 스크린리더 접근.
 *
 * # 확장 포인트 (후속)
 * - barColor를 그라데이션 함수로 받기
 * - 클릭 시 막대 강조 + onSelect 콜백
 * - 애니메이션(막대가 0에서 자라나는 entrance effect)
 *
 * @example
 *   const data = [
 *     { label: '서울', value: 120 },
 *     { label: '부산', value: 80 },
 *     { label: '대전', value: 65 },
 *   ];
 *
 *   <div style={{ width: '100%', height: 480 }}>
 *     <BarChart3D data={data} aria-label="도시별 인구" />
 *   </div>
 */
export function BarChart3D({
  data,
  maxHeight = 5,
  barWidth = 0.7,
  gap = 0.4,
  barColor = CHART_COLORS.baneungNavyMid,
  showLabel = true,
  cameraPosition = [5, 5, 5],
  className,
  'aria-label': ariaLabel = '3D 막대 차트',
}: BarChart3DProps): React.ReactElement {
  // ─── 데이터 → 시각화 변환 (메모이제이션 필수: data 변경 시에만 재계산) ──────
  const scale = React.useMemo(() => scaleHeight(data, { maxHeight }), [data, maxHeight]);
  const xPositions = React.useMemo(
    () => computeBarXPositions(data.length, barWidth, gap),
    [data.length, barWidth, gap],
  );

  // ─── tooltip state — hover 중인 막대의 label/value/좌표 ───────────────────
  const [tooltip, setTooltip] = React.useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    label: '',
    value: 0,
  });

  /** Bar의 onPointerOver/Out에서 호출. 데이텀과 화면 좌표 매핑. */
  const showTooltip = React.useCallback(
    (datum: BarChartDatum, e: ThreeEvent<PointerEvent>): void => {
      setTooltip({
        visible: true,
        // R3F의 ThreeEvent.nativeEvent는 PointerEvent → client 좌표 사용
        x: e.nativeEvent.clientX,
        y: e.nativeEvent.clientY,
        label: datum.label,
        value: datum.value,
      });
    },
    [],
  );

  const hideTooltip = React.useCallback((): void => {
    setTooltip((t) => ({ ...t, visible: false }));
  }, []);

  return (
    <div className={cn('relative h-full w-full', className)}>
      <ChartCanvas cameraPosition={cameraPosition} aria-label={ariaLabel}>
        <GroundPlane />

        {data.map((datum, i) => {
          const x = xPositions[i] ?? 0;
          const height = scale(Math.abs(datum.value));
          const resolvedColor = datum.color ?? barColor;
          return (
            <React.Fragment key={datum.label}>
              <Bar
                x={x}
                height={height}
                width={barWidth}
                color={resolvedColor}
                onPointerOver={(e): void => showTooltip(datum, e)}
                onPointerOut={hideTooltip}
              />
              {showLabel && <BarLabel x={x} y={height + 0.15} text={datum.label} />}
            </React.Fragment>
          );
        })}
      </ChartCanvas>

      {/* HTML 툴팁 — Canvas 위에 오버레이 */}
      <Tooltip state={tooltip} />

      {/* 스크린리더용 데이터 테이블 — WebGL canvas는 보조 기술이 못 읽음 */}
      <table className="sr-only">
        <caption>{ariaLabel}</caption>
        <thead>
          <tr>
            <th scope="col">항목</th>
            <th scope="col">값</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.label}>
              <th scope="row">{d.label}</th>
              <td>{d.value.toLocaleString('ko-KR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
