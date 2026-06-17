import * as React from 'react';
import * as THREE from 'three';

import type { ThreeEvent } from '@react-three/fiber';

export interface BarProps {
  /** 막대 X 위치 (Z=0 고정, Y는 height/2로 자동 계산). */
  x: number;
  /** 막대 높이 (Three.js 단위). */
  height: number;
  /** 막대 가로/세로 크기. */
  width: number;
  /** 막대 색상 (CSS color 문자열). */
  color: string;
  /** hover 시 강조 색상. 미지정 시 color를 자동 강조. */
  hoverColor?: string;
  /** hover 시작. tooltip 표시용. */
  onPointerOver?: (e: ThreeEvent<PointerEvent>) => void;
  /** hover 종료. tooltip 숨김용. */
  onPointerOut?: (e: ThreeEvent<PointerEvent>) => void;
}

/**
 * 단일 3D 막대 mesh.
 *
 * BoxGeometry 사용 — 가장 단순하면서 빌딩 형태로 확장 가능 (도시 차트 대비).
 *
 * # 좌표 시스템
 * Three.js 기준 Y축 양수 방향으로 성장. 막대 중심 Y = height/2이므로
 * 바닥 plane(y=0) 위에 정확히 서 있다.
 *
 * # hover 효과
 * 내부 useState로 hover 상태 관리 → meshStandardMaterial color를 강조 색으로 전환.
 * 부모 컴포넌트는 onPointerOver/Out 콜백으로 tooltip을 별도 관리.
 *
 * # 성능
 * geometry/material은 R3F가 자동 dispose하므로 별도 처리 불필요.
 * 100개 이상의 막대가 필요하면 부모에서 InstancedMesh로 전환 권장 (현재 5~20개 가정).
 */
export function Bar({
  x,
  height,
  width,
  color,
  hoverColor,
  onPointerOver,
  onPointerOut,
}: BarProps): React.ReactElement {
  // 1. hover 상태 — 색상 강조용
  const [hovered, setHovered] = React.useState(false);

  // 2. hover 색상 계산. 명시 안 됐으면 THREE.Color로 자동 밝게 (multiplyScalar 1.4)
  //    원본 color를 매번 변환하지 않도록 useMemo로 캐싱
  const resolvedHoverColor = React.useMemo(() => {
    if (hoverColor) return hoverColor;
    return new THREE.Color(color).multiplyScalar(1.4).getStyle();
  }, [color, hoverColor]);

  return (
    <mesh
      position={[x, height / 2, 0]}
      castShadow
      receiveShadow
      onPointerOver={(e): void => {
        e.stopPropagation();
        setHovered(true);
        // 부모 콜백 — tooltip 표시 트리거
        onPointerOver?.(e);
        // 커서 변경 (R3F 표준 패턴)
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e): void => {
        e.stopPropagation();
        setHovered(false);
        onPointerOut?.(e);
        document.body.style.cursor = '';
      }}
    >
      <boxGeometry args={[width, height, width]} />
      <meshStandardMaterial
        color={hovered ? resolvedHoverColor : color}
        roughness={0.5}
        metalness={0.1}
      />
    </mesh>
  );
}
