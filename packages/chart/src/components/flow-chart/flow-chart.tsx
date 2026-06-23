'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { cn } from '../../lib/cn';

import type { ReactNode } from 'react';

/**
 * 노드의 어느 면에서 엣지가 출발/도착하는지.
 * 자동 모드는 두 노드의 상대 위치를 보고 가장 자연스러운 면을 선택.
 */
export type FlowHandlePosition = 'top' | 'right' | 'bottom' | 'left' | 'auto';

export interface FlowNode {
  /** 고유 식별자 — edges의 source/target에서 참조. */
  id: string;
  /** 노드 안에 표시할 텍스트. 미지정 시 id. */
  label?: string;
  /** SVG 좌표계의 좌상단 위치. */
  x: number;
  y: number;
  /** 노드 박스 크기. 기본 160×44. */
  width?: number;
  height?: number;
  /** 채움 색. 기본 흰색. */
  fill?: string;
  /** 테두리 색. 기본 navy-700. */
  stroke?: string;
  /** 텍스트 색. 기본 foreground. */
  textColor?: string;
}

/**
 * 엣지 path 계산 함수에 전달되는 매개변수.
 * 사용자가 `edgeTypes`에 등록한 함수도 같은 시그니처.
 */
export interface FlowEdgePathArgs {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: FlowHandlePosition;
  targetPosition: FlowHandlePosition;
}

/** 엣지 path 생성 함수 — SVG `d` 속성 문자열을 반환. */
export type FlowEdgePathFn = (args: FlowEdgePathArgs) => string;

/** 내장 edge 타입 이름. */
export type FlowEdgeBuiltinType = 'straight' | 'bezier' | 'step' | 'smoothstep';

export interface FlowEdge {
  /** 고유 식별자 (옵션). React key 안정성 목적. */
  id?: string;
  /** 출발 노드 id. */
  source: string;
  /** 도착 노드 id. */
  target: string;
  /**
   * 엣지 타입 — 내장 4종 또는 `edgeTypes`에 등록된 사용자 정의 키.
   * 기본 'bezier'.
   */
  type?: FlowEdgeBuiltinType | string;
  /** 엣지 중앙에 표시할 라벨. */
  label?: string;
  /** 선 색상. 기본 navy-700. */
  color?: string;
  /** 선 두께(px). 기본 1.5. */
  width?: number;
  /** 점선 (dashArray). false면 실선. 기본 false. */
  dashed?: boolean;
  /**
   * 흐름 애니메이션 — dash가 흘러가는 효과 (true면 자동 dashed).
   * 기본 false.
   */
  animated?: boolean;
  /** 출발 면. 기본 'auto' (상대 위치 기반 자동 선택). */
  sourcePosition?: FlowHandlePosition;
  /** 도착 면. 기본 'auto'. */
  targetPosition?: FlowHandlePosition;
  /** 도착점에 화살표 머리 표시. 기본 true. */
  arrow?: boolean;
}

export interface FlowChartProps {
  nodes: FlowNode[];
  edges: FlowEdge[];
  /**
   * 사용자 정의 edge 타입.
   * key는 `edge.type`에서 참조. 값은 path 문자열을 반환하는 함수.
   * 내장 타입(straight/bezier/step/smoothstep)도 같은 키로 override 가능.
   *
   * @example
   *   edgeTypes={{
   *     wavy: ({ sourceX, sourceY, targetX, targetY }) => {
   *       const midX = (sourceX + targetX) / 2;
   *       return `M ${sourceX} ${sourceY} Q ${midX} ${sourceY - 30}, ${targetX} ${targetY}`;
   *     },
   *   }}
   */
  edgeTypes?: Record<string, FlowEdgePathFn>;
  /** 차트 높이(px). 너비는 부모 100%. 기본 400. */
  height?: number;
  /** 마우스 드래그로 캔버스 pan 가능 여부. 기본 true. */
  pannable?: boolean;
  /** 배경 그리드 표시. 기본 true. */
  showGrid?: boolean;
  /** 외부 wrapper className. */
  className?: string;
  /** 빈 상태 노드. */
  emptyState?: ReactNode;
}

// ─────────────────────────────────────────────────────────────────────────────
// 내장 edge path 함수
// ─────────────────────────────────────────────────────────────────────────────

/** 두 점을 잇는 직선. */
function straightPath({ sourceX, sourceY, targetX, targetY }: FlowEdgePathArgs): string {
  return `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
}

/**
 * 베지어 곡선 — 출발/도착 면이 좌우 horizontal일 땐 cubic with X-tangent,
 * 상하 vertical일 땐 cubic with Y-tangent. 양쪽 손잡이 길이는 두 점 간 거리의 절반.
 */
function bezierPath(args: FlowEdgePathArgs): string {
  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } = args;
  const dx = Math.abs(targetX - sourceX);
  const dy = Math.abs(targetY - sourceY);
  const isHorizontal =
    sourcePosition === 'left' ||
    sourcePosition === 'right' ||
    targetPosition === 'left' ||
    targetPosition === 'right';
  // 손잡이 길이 — 너무 짧으면 곡선이 안 보이므로 최소값.
  const handle = Math.max(30, isHorizontal ? dx * 0.5 : dy * 0.5);
  if (isHorizontal) {
    const sCp = sourcePosition === 'left' ? sourceX - handle : sourceX + handle;
    const tCp = targetPosition === 'left' ? targetX - handle : targetX + handle;
    return `M ${sourceX} ${sourceY} C ${sCp} ${sourceY}, ${tCp} ${targetY}, ${targetX} ${targetY}`;
  }
  const sCp = sourcePosition === 'top' ? sourceY - handle : sourceY + handle;
  const tCp = targetPosition === 'top' ? targetY - handle : targetY + handle;
  return `M ${sourceX} ${sourceY} C ${sourceX} ${sCp}, ${targetX} ${tCp}, ${targetX} ${targetY}`;
}

/** 직각 꺾임 — 중간점에서 한 번 꺾어 도착. */
function stepPath({ sourceX, sourceY, targetX, targetY }: FlowEdgePathArgs): string {
  const midX = (sourceX + targetX) / 2;
  return `M ${sourceX} ${sourceY} L ${midX} ${sourceY} L ${midX} ${targetY} L ${targetX} ${targetY}`;
}

/**
 * 부드러운 직각 꺾임 — 코너에 작은 반지름(arc).
 * 너무 가까우면 곡선 반지름이 거리보다 커져 path가 깨질 수 있어 clamp.
 */
function smoothStepPath({ sourceX, sourceY, targetX, targetY }: FlowEdgePathArgs): string {
  const midX = (sourceX + targetX) / 2;
  const dy = targetY - sourceY;
  const r = Math.min(12, Math.abs(midX - sourceX), Math.abs(dy) / 2 || 12);
  if (r <= 1) return stepPath({ sourceX, sourceY, targetX, targetY } as FlowEdgePathArgs);
  // 두 90도 코너에 quadratic curve.
  const ySign = dy >= 0 ? 1 : -1;
  return `M ${sourceX} ${sourceY} L ${midX - r} ${sourceY} Q ${midX} ${sourceY}, ${midX} ${sourceY + ySign * r} L ${midX} ${targetY - ySign * r} Q ${midX} ${targetY}, ${midX + r} ${targetY} L ${targetX} ${targetY}`;
}

const BUILTIN_EDGES: Record<FlowEdgeBuiltinType, FlowEdgePathFn> = {
  straight: straightPath,
  bezier: bezierPath,
  step: stepPath,
  smoothstep: smoothStepPath,
};

// ─────────────────────────────────────────────────────────────────────────────
// 핸들 위치 계산
// ─────────────────────────────────────────────────────────────────────────────

/** 노드의 지정된 면의 중심점 좌표. */
function handleCoord(
  node: FlowNode,
  side: Exclude<FlowHandlePosition, 'auto'>,
): { x: number; y: number } {
  const w = node.width ?? 160;
  const h = node.height ?? 44;
  switch (side) {
    case 'top':
      return { x: node.x + w / 2, y: node.y };
    case 'right':
      return { x: node.x + w, y: node.y + h / 2 };
    case 'bottom':
      return { x: node.x + w / 2, y: node.y + h };
    case 'left':
      return { x: node.x, y: node.y + h / 2 };
  }
}

/**
 * 두 노드의 상대 위치를 보고 가장 자연스러운 핸들 면을 추론.
 * source 노드 중심에서 target 노드 중심으로의 벡터의 우세 방향으로 결정.
 */
function autoHandlePositions(
  source: FlowNode,
  target: FlowNode,
): {
  sourcePos: Exclude<FlowHandlePosition, 'auto'>;
  targetPos: Exclude<FlowHandlePosition, 'auto'>;
} {
  const sw = source.width ?? 160;
  const sh = source.height ?? 44;
  const tw = target.width ?? 160;
  const th = target.height ?? 44;
  const dx = target.x + tw / 2 - (source.x + sw / 2);
  const dy = target.y + th / 2 - (source.y + sh / 2);
  if (Math.abs(dx) >= Math.abs(dy)) {
    // 좌→우 또는 우→좌 흐름
    return dx >= 0
      ? { sourcePos: 'right', targetPos: 'left' }
      : { sourcePos: 'left', targetPos: 'right' };
  }
  // 위→아래 또는 아래→위 흐름
  return dy >= 0
    ? { sourcePos: 'bottom', targetPos: 'top' }
    : { sourcePos: 'top', targetPos: 'bottom' };
}

// ─────────────────────────────────────────────────────────────────────────────
// 컴포넌트
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 플로우 차트 — 노드와 엣지로 그래프를 그리는 SVG 컴포넌트.
 *
 * # 핵심 기능
 * - **내장 4 edge types**: `straight` / `bezier` / `smoothstep` / `step`
 * - **커스텀 edge**: `edgeTypes` prop에 path 생성 함수를 등록해서 사용
 * - **자동 핸들 선택**: 두 노드의 상대 위치로 가장 자연스러운 면 추론
 * - **화살표 머리** (옵션)
 * - **엣지 라벨** (옵션)
 * - **흐름 애니메이션** (dash flow)
 * - **마우스 드래그 pan** (옵션)
 *
 * # 설계 노트
 * 단순한 시각화에 초점. 노드 자체를 마우스로 옮기거나 인터랙티브 그래프 편집은 제공 X
 * — 그런 시나리오에는 react-flow 같은 전용 라이브러리 권장.
 * 본 컴포넌트는 "사전 정의된 흐름도/파이프라인을 시각화"하는 용도.
 *
 * @example
 *   <FlowChart
 *     nodes={[
 *       { id: 'a', label: 'Start', x: 40, y: 40 },
 *       { id: 'b', label: 'Process', x: 240, y: 40 },
 *       { id: 'c', label: 'End', x: 440, y: 40 },
 *     ]}
 *     edges={[
 *       { source: 'a', target: 'b', label: '1' },
 *       { source: 'b', target: 'c', type: 'step', label: '2', animated: true },
 *     ]}
 *   />
 */
export function FlowChart({
  nodes,
  edges,
  edgeTypes,
  height = 400,
  pannable = true,
  showGrid = true,
  className,
  emptyState,
}: FlowChartProps) {
  // view = { zoom, panX, panY }. 노드 좌표는 그대로 두고 wrapper <g>에 transform.
  // zoom-to-cursor가 panX/panY를 동시에 조정하므로 단일 state로 묶음.
  const [view, setView] = useState<{ zoom: number; panX: number; panY: number }>({
    zoom: 1,
    panX: 0,
    panY: 0,
  });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const MIN_ZOOM = 0.3;
  const MAX_ZOOM = 3;

  // ⚠️ window 글로벌 리스너 대신 SVG의 setPointerCapture를 사용.
  // 빠르게 드래그하면 마우스가 SVG 영역을 벗어났다 들어오기를 반복하며 native drag로
  // 인식되거나 pointermove가 다른 element에 흡수돼 원위치로 snap-back 되는 버그가 있음.
  // setPointerCapture는 해당 pointer의 모든 후속 이벤트를 캡처 element에 강제로 전달하여
  // 화면 밖으로 나가도 추적이 끊기지 않음.
  // 핸들러는 SVG의 onPointerMove/Up/Cancel에 직접 부착 (아래 JSX).

  // 휠 줌 — 네이티브 listener로 부착해 preventDefault 가능 (페이지 스크롤 차단).
  // 커서 위치를 기준으로 zoom-to-cursor: world point가 휠 전후 같은 화면 좌표에 머무름.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault(); // 페이지 스크롤 차단 (Flow 영역 내에선 줌으로 소비)
      const rect = containerRef.current?.getBoundingClientRect();
      const cx = e.clientX - (rect?.left ?? 0);
      const cy = e.clientY - (rect?.top ?? 0);
      setView((prev) => {
        const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
        const nextZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev.zoom * factor));
        if (nextZoom === prev.zoom) return prev;
        const k = nextZoom / prev.zoom;
        // 변환 후에도 (cx,cy) 아래 world 좌표가 동일하도록 panX/panY 보정.
        // screen = world * zoom + pan → world = (screen - pan) / zoom 이 동일해야.
        return {
          zoom: nextZoom,
          panX: cx + k * (prev.panX - cx),
          panY: cy + k * (prev.panY - cy),
        };
      });
    };
    svg.addEventListener('wheel', onWheel, { passive: false });
    return () => svg.removeEventListener('wheel', onWheel);
  }, []);

  // 각 edge path DOM element 참조 — DOM 기반 tangent 계산용.
  const pathRefs = useRef<Map<string, SVGPathElement | null>>(new Map());
  // edge key → 실제 path 끝점의 tangent 각도(라디안). DOM 계산 결과 캐시.
  // custom edge type의 정확한 화살표 방향을 위해 필요 — heuristic으로는 불가능.
  const [domTangents, setDomTangents] = useState<Map<string, number>>(new Map());

  // path가 렌더된 후 실제 끝점 tangent를 SVG API로 계산.
  // useLayoutEffect로 paint 전에 동기 계산 → 한 프레임만에 정확한 각도 반영.
  useLayoutEffect(() => {
    const next = new Map<string, number>();
    pathRefs.current.forEach((path, key) => {
      if (!path) return;
      try {
        const len = path.getTotalLength();
        if (len < 1) return;
        // ⚠️ sampling 거리: 1px이 아니라 ~15px(또는 path 길이의 30%) 뒤에서 sample.
        // 이유: bezier curve는 마지막 1px에선 이미 face perpendicular로 휘어들어가
        //   수학적 tangent(수평)와 사용자가 보는 line 진행 방향(비스듬한 곡선)이 다름.
        //   더 긴 segment를 평균내면 시각적으로 line과 삼각형 회전이 자연스럽게 일치.
        // getPointAtLength는 path 자체 좌표계 기반이라 wrapper <g> zoom transform과 무관.
        const sampleBack = Math.min(15, len * 0.3);
        const p1 = path.getPointAtLength(Math.max(0, len - sampleBack));
        const p2 = path.getPointAtLength(len);
        const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        if (Number.isFinite(angle)) next.set(key, angle);
      } catch {
        // path가 detach됐거나 invalid path — 무시하고 heuristic fallback 사용.
      }
    });
    // 변경 있을 때만 setState (무한 re-render 방지).
    setDomTangents((prev) => {
      if (next.size !== prev.size) return next;
      for (const [k, v] of next) {
        const old = prev.get(k);
        if (old === undefined || Math.abs(old - v) > 0.005) return next;
      }
      return prev;
    });
  });

  // id로 노드 빠른 lookup.
  const nodeMap = useMemo(() => {
    const m = new Map<string, FlowNode>();
    for (const n of nodes) m.set(n.id, n);
    return m;
  }, [nodes]);

  // 엣지 path 함수 — 내장 + 사용자 정의 병합. 사용자 키가 우선.
  const allEdgeTypes: Record<string, FlowEdgePathFn> = useMemo(
    () => ({ ...BUILTIN_EDGES, ...edgeTypes }),
    [edgeTypes],
  );

  // 빈 상태
  if (nodes.length === 0 && emptyState) {
    return <div className={cn('flex items-center justify-center', className)}>{emptyState}</div>;
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full overflow-hidden border border-border-default bg-canvas',
        className,
      )}
      style={{ height }}
    >
      <svg
        ref={svgRef}
        width="100%"
        height={height}
        style={{
          cursor: pannable ? 'grab' : 'default',
          touchAction: 'none',
          userSelect: 'none',
        }}
        // 네이티브 drag(이미지 드래그·텍스트 선택 드래그) 차단 — fast move 시 snap-back 방지.
        onDragStart={(e) => e.preventDefault()}
        onPointerDown={
          pannable
            ? (e) => {
                // pointer capture: 이 pointer의 모든 후속 이벤트가 SVG로만 전달됨.
                // 마우스가 SVG 영역을 벗어나도 추적이 유지되어 fast drag도 정상 동작.
                e.currentTarget.setPointerCapture(e.pointerId);
                isDraggingRef.current = true;
                dragStartRef.current = {
                  x: e.clientX,
                  y: e.clientY,
                  panX: view.panX,
                  panY: view.panY,
                };
              }
            : undefined
        }
        onPointerMove={
          pannable
            ? (e) => {
                // ⚠️ dragStartRef.current를 지역 변수로 캡처 — React 18의 batched
                // setView 콜백이 나중에 실행될 때 ref가 null이 됐을 수 있음
                // (pointerup이 setView 스케줄과 commit 사이에 끼어들면).
                // 지역 const는 클로저에 고정되므로 null 참조 race 차단.
                const start = dragStartRef.current;
                if (!isDraggingRef.current || !start) return;
                const dx = e.clientX - start.x;
                const dy = e.clientY - start.y;
                // pan은 화면 픽셀 단위 — 줌과 무관하게 1:1 이동.
                // 절대 좌표(drag 시작 panX + 누적 dx) 방식이라 중간 손실에도 jump 없음.
                setView((prev) => ({
                  ...prev,
                  panX: start.panX + dx,
                  panY: start.panY + dy,
                }));
              }
            : undefined
        }
        onPointerUp={
          pannable
            ? (e) => {
                if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                  e.currentTarget.releasePointerCapture(e.pointerId);
                }
                isDraggingRef.current = false;
                dragStartRef.current = null;
              }
            : undefined
        }
        // 브라우저가 drag를 강제 취소하는 경우 (탭 전환·시스템 다이얼로그 등) 정리.
        onPointerCancel={
          pannable
            ? () => {
                isDraggingRef.current = false;
                dragStartRef.current = null;
              }
            : undefined
        }
      >
        <defs>
          {/* 배경 그리드 패턴 */}
          {showGrid && (
            <pattern id="baneung-flow-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="var(--color-border-subtle, #e5e7eb)" />
            </pattern>
          )}
        </defs>

        {/* 그리드는 pan/zoom과 함께 무한 평면 느낌을 위해 매우 크게 깐다.
            pan을 그리드에도 적용해 노드가 움직이는 게 아니라 배경이 흐르는 인상.
            줌 시에도 그리드 간격이 따라 늘어나도록 scale 적용. */}
        {showGrid && (
          <g
            transform={`translate(${view.panX % (20 * view.zoom)}, ${view.panY % (20 * view.zoom)}) scale(${view.zoom})`}
          >
            <rect
              x={-5000}
              y={-5000}
              width={10000}
              height={10000}
              fill="url(#baneung-flow-grid)"
              pointerEvents="none"
            />
          </g>
        )}

        {/* 모든 노드/엣지를 감싸는 group에 pan + zoom transform 적용.
            transform 순서: translate 먼저, scale 나중 → 줌 중심이 원점 기준이 아닌
            현재 pan 위치 기준이 되어 zoom-to-cursor 수식과 일치. */}
        <g transform={`translate(${view.panX}, ${view.panY}) scale(${view.zoom})`}>
          {/* 엣지 (먼저 렌더 → 노드 뒤에 깔림) */}
          {edges.map((edge, i) => {
            const source = nodeMap.get(edge.source);
            const target = nodeMap.get(edge.target);
            if (!source || !target) return null;
            const edgeKey = edge.id ?? `${edge.source}-${edge.target}-${i}`;

            // 핸들 면 결정: 자동 모드면 추론.
            const auto = autoHandlePositions(source, target);
            const sourcePosition =
              (edge.sourcePosition ?? 'auto') === 'auto'
                ? auto.sourcePos
                : (edge.sourcePosition as Exclude<FlowHandlePosition, 'auto'>);
            const targetPosition =
              (edge.targetPosition ?? 'auto') === 'auto'
                ? auto.targetPos
                : (edge.targetPosition as Exclude<FlowHandlePosition, 'auto'>);
            const sCoord = handleCoord(source, sourcePosition);
            const tCoord = handleCoord(target, targetPosition);

            const edgeType = edge.type ?? 'bezier';
            const pathFn = allEdgeTypes[edgeType] ?? bezierPath;
            const d = pathFn({
              sourceX: sCoord.x,
              sourceY: sCoord.y,
              targetX: tCoord.x,
              targetY: tCoord.y,
              sourcePosition,
              targetPosition,
            });

            const color = edge.color ?? '#3B4B63'; // navy-700
            const strokeW = edge.width ?? 1.5;
            const animated = edge.animated ?? false;
            const dashed = edge.dashed ?? animated;
            const arrow = edge.arrow ?? true;
            const midX = (sCoord.x + tCoord.x) / 2;
            const midY = (sCoord.y + tCoord.y) / 2;

            // ──────────────────────────────────────────────
            // 화살표 — SVG <marker>는 dash 패턴과 상호작용이 까다로워
            // (last dash가 marker 위치에 걸치며 깨짐) 폐기.
            // 대신 <polygon>으로 직접 그리고 회전 각도는 edge type별 명시 계산.
            // ──────────────────────────────────────────────
            // tangent 각도(라디안). 화살표 tip의 방향.
            let tipAngle = 0;
            if (edgeType === 'straight') {
              tipAngle = Math.atan2(tCoord.y - sCoord.y, tCoord.x - sCoord.x);
            } else if (edgeType === 'bezier') {
              // bezier control points는 targetPosition face와 정렬됨 → tangent도 동일.
              tipAngle =
                targetPosition === 'left'
                  ? 0
                  : targetPosition === 'right'
                    ? Math.PI
                    : targetPosition === 'top'
                      ? Math.PI / 2
                      : -Math.PI / 2;
            } else if (edgeType === 'step' || edgeType === 'smoothstep') {
              // step의 마지막 segment는 항상 horizontal (midX→targetX). 동일 column이면 vertical.
              if (Math.abs(sCoord.x - tCoord.x) < 0.5) {
                tipAngle = tCoord.y > sCoord.y ? Math.PI / 2 : -Math.PI / 2;
              } else {
                tipAngle = tCoord.x > sCoord.x ? 0 : Math.PI;
              }
            } else {
              // 사용자 정의 edge: source→target 직선 방향으로 fallback.
              tipAngle = Math.atan2(tCoord.y - sCoord.y, tCoord.x - sCoord.x);
            }

            // DOM 기반 tangent가 있으면 우선 — custom edge type도 정확.
            // 첫 paint 직전 useLayoutEffect에서 채워지므로 사실상 항상 사용됨.
            const finalAngle = domTangents.get(edgeKey) ?? tipAngle;

            // 화살표 polygon — tip at (0,0), tail at (-len, ±half).
            // strokeWidth 1.5 기준 len=10, half=4 → 비율감 좋음.
            const len = Math.max(8, Math.min(14, strokeW * 6));
            const half = Math.max(3, Math.min(6, strokeW * 2.6));
            const arrowPoints = `0,0 -${len},${half} -${len},-${half}`;

            // dashed/animated edge는 마지막 dash가 화살표 직전 gap에 떨어지면
            // dash와 삼각형이 분리돼 보임. 해결: 삼각형 길이만큼 끝부분에 solid line을 덮어
            // dash↔arrow 사이를 시각적으로 연결.
            const tipBridgeLen = len + 2; // 삼각형 길이 + 2px 여유
            const bridgeStartX = tCoord.x - Math.cos(finalAngle) * tipBridgeLen;
            const bridgeStartY = tCoord.y - Math.sin(finalAngle) * tipBridgeLen;

            return (
              <g key={edgeKey}>
                <path
                  ref={(el) => {
                    // null을 ref에 저장하면 cleanup 시 Map에서 제거.
                    // path가 unmount되면 다음 useLayoutEffect는 이 key를 건너뜀.
                    if (el) pathRefs.current.set(edgeKey, el);
                    else pathRefs.current.delete(edgeKey);
                  }}
                  d={d}
                  fill="none"
                  stroke={color}
                  strokeWidth={strokeW}
                  strokeDasharray={dashed ? '6 4' : undefined}
                  strokeLinecap="round"
                >
                  {animated && (
                    <animate
                      attributeName="stroke-dashoffset"
                      values="20;0"
                      dur="0.8s"
                      repeatCount="indefinite"
                    />
                  )}
                </path>
                {/* dashed line인 경우 끝부분에 solid bridge — dash gap 노출 방지.
                    solid line은 항상 화살표와 같은 색·두께라 시각적으로 한 줄로 보임. */}
                {dashed && arrow && (
                  <line
                    x1={bridgeStartX}
                    y1={bridgeStartY}
                    x2={tCoord.x}
                    y2={tCoord.y}
                    stroke={color}
                    strokeWidth={strokeW}
                    strokeLinecap="round"
                  />
                )}
                {/*
                  화살표를 path 위에 별도 polygon으로 그림 — solid fill이라 dash와 무관.
                  rotate 후 translate 순서 주의: SVG transform은 right-to-left 적용,
                  즉 polygon은 (0,0) 기준 회전 → 그 결과를 tCoord로 translate. JSX 문자열로는
                  왼쪽이 먼저 적용되므로 translate ... rotate ... 순서로 작성.
                */}
                {arrow && (
                  <polygon
                    points={arrowPoints}
                    fill={color}
                    transform={`translate(${tCoord.x} ${tCoord.y}) rotate(${(finalAngle * 180) / Math.PI})`}
                  />
                )}
                {edge.label && (
                  <g>
                    {/* 라벨 배경 — 가독성 위해 흰색 알약 */}
                    <rect
                      x={midX - String(edge.label).length * 4 - 6}
                      y={midY - 10}
                      width={String(edge.label).length * 8 + 12}
                      height={20}
                      rx={4}
                      fill="var(--color-bg-canvas, #ffffff)"
                      stroke={color}
                      strokeWidth={1}
                    />
                    <text
                      x={midX}
                      y={midY + 4}
                      textAnchor="middle"
                      fontSize={11}
                      fill={color}
                      style={{ pointerEvents: 'none' }}
                    >
                      {edge.label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* 노드 */}
          {nodes.map((node) => {
            const w = node.width ?? 160;
            const h = node.height ?? 44;
            return (
              <g key={node.id}>
                <rect
                  x={node.x}
                  y={node.y}
                  width={w}
                  height={h}
                  rx={2}
                  fill={node.fill ?? 'var(--color-bg-canvas, #ffffff)'}
                  stroke={node.stroke ?? '#3B4B63'}
                  strokeWidth={1.5}
                />
                <text
                  x={node.x + w / 2}
                  y={node.y + h / 2 + 4}
                  textAnchor="middle"
                  fontSize={13}
                  fill={node.textColor ?? '#1F2937'}
                  style={{ pointerEvents: 'none' }}
                >
                  {node.label ?? node.id}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
