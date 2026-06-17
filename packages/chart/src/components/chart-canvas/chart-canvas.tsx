import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

import { cn } from '../../lib/cn';

import type * as React from 'react';

export interface ChartCanvasProps {
  /** 자식 mesh / scene 요소. */
  children: React.ReactNode;
  /** 초기 카메라 위치 [x, y, z]. 기본 [5, 5, 5]. */
  cameraPosition?: [number, number, number];
  /** 카메라 FOV. 기본 50. */
  cameraFov?: number;
  /** OrbitControls 비활성. 기본 false (회전·줌·팬 활성). */
  controlsDisabled?: boolean;
  /** wrapper div의 추가 className. */
  className?: string;
  /** 접근성 라벨. 스크린리더가 canvas region을 인지할 수 있도록 필수. */
  'aria-label': string;
}

/**
 * 모든 3D 차트 종류가 공유하는 Canvas 래퍼.
 *
 * # 책임
 * - R3F Canvas 생성 + 권장 props 적용 (dpr 캡, shadows, antialias)
 * - OrbitControls 부착 (회전·줌·팬)
 * - 기본 조명 (ambient + directional)
 * - 접근성: role="region" + aria-label 부착
 *
 * # 왜 별도 컴포넌트인가
 * 후속으로 추가될 CityChart3D / TimelineChart3D / MapChart3D가 모두 같은
 * Canvas 셋업을 공유한다. 한 곳에서 관리해 일관성 유지.
 *
 * # 성능
 * - `dpr={[1, 2]}` 필수 — 4K 디스플레이에서 4× 해상도 렌더 방지
 * - `gl.powerPreference: 'high-performance'` — 모바일 GPU 모드 명시
 *
 * @example
 *   <ChartCanvas aria-label="도시별 인구 차트">
 *     <Bars data={data} />
 *   </ChartCanvas>
 */
export function ChartCanvas({
  children,
  cameraPosition = [5, 5, 5],
  cameraFov = 50,
  controlsDisabled = false,
  className,
  'aria-label': ariaLabel,
}: ChartCanvasProps): React.ReactElement {
  return (
    <div role="region" aria-label={ariaLabel} className={cn('relative h-full w-full', className)}>
      <Canvas
        dpr={[1, 2]}
        shadows
        camera={{ position: cameraPosition, fov: cameraFov }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        {/* 기본 조명 — 모든 차트 종류가 공유 */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={1.0}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {children}

        {/*
          OrbitControls — 마우스 인터랙션.
          enableDamping=true: 회전이 부드럽게 감속.
          makeDefault: drei의 다른 헬퍼들이 이 controls를 참조하도록.
        */}
        {!controlsDisabled && <OrbitControls makeDefault enableDamping dampingFactor={0.08} />}
      </Canvas>
    </div>
  );
}
