import { CHART_COLORS } from '../../lib/colors';

import type * as React from 'react';

export interface GroundPlaneProps {
  /** plane 크기 (한 변 길이). 막대 그룹보다 충분히 크게. */
  size?: number;
  /** plane 색상. */
  color?: string;
}

/**
 * 바닥 plane — 막대들이 서 있을 평면.
 *
 * # 디자인 결정
 * - 단순 PlaneGeometry. 그림자를 받아 깊이감 부여.
 * - Y=0에 위치. 막대는 Y=height/2 중심이므로 정확히 바닥에 서 있음.
 * - rotation.x = -π/2 → 수평으로 눕힘 (PlaneGeometry는 기본 XY 평면이므로).
 */
export function GroundPlane({
  size = 30,
  color = CHART_COLORS.ground,
}: GroundPlaneProps): React.ReactElement {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial color={color} roughness={0.9} metalness={0} />
    </mesh>
  );
}
