import { Text } from '@react-three/drei';

import { CHART_COLORS } from '../../lib/colors';

import type * as React from 'react';

export interface BarLabelProps {
  /** X 좌표 (해당 막대와 동일). */
  x: number;
  /** Y 좌표 (보통 막대 높이 + 약간의 offset). */
  y: number;
  /** 표시할 텍스트. */
  text: string;
  /** 텍스트 크기 (Three.js 단위). 기본 0.25. */
  fontSize?: number;
  /** 텍스트 색상. 기본 라벨 컬러. */
  color?: string;
}

/**
 * 막대 상단에 떠 있는 라벨 텍스트.
 *
 * Drei의 `<Text>` 컴포넌트를 사용 — three의 TextGeometry보다 가볍고
 * 폰트 로딩이 자동.
 *
 * # 카메라를 향하도록 회전
 * Drei `<Text>`는 기본적으로 +Z를 향하므로 회전이 필요.
 * 단순화를 위해 `<Billboard>`로 감싸지 않고, 카메라가 거의 정면에 있다고
 * 가정한 고정 위치 사용. 필요 시 향후 Billboard 적용.
 *
 * # 한글 폰트
 * Drei의 Text는 기본적으로 영문/숫자만 잘 표시됨. 한글은 폰트 파일 명시 필요하지만
 * MVP 단계에선 기본 폰트(Roboto)로 영문/숫자 위주.
 * 한글 라벨 지원은 후속 (font="/fonts/Pretendard.woff" 등).
 */
export function BarLabel({
  x,
  y,
  text,
  fontSize = 0.25,
  color = CHART_COLORS.label,
}: BarLabelProps): React.ReactElement {
  return (
    <Text
      position={[x, y, 0]}
      fontSize={fontSize}
      color={color}
      anchorX="center"
      anchorY="bottom"
      // 텍스트 외곽선 — 어두운 배경에서도 가독성 확보
      outlineWidth={0.005}
      outlineColor="#ffffff"
    >
      {text}
    </Text>
  );
}
