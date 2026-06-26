import type { EventSegment } from './event-utils';

/**
 * Lane 할당된 segment — segment + 세로 lane 인덱스.
 */
export interface LaidOutSegment extends EventSegment {
  /** 0-indexed lane (세로 위치). 0이 최상단. */
  lane: number;
}

/**
 * Greedy lane 할당.
 *
 *  1) segment를 (startCol asc, duration desc) 정렬
 *  2) 각 segment에 대해, 같은 컬럼 범위에서 안 겹치는 가장 낮은 lane 인덱스 할당
 *
 * 시간 복잡도: O(N²) — week당 최대 ~수십 개 일정 가정.
 * 안정성: 결정적 (같은 입력 → 같은 lane 배치).
 *
 * @example
 *   segments:
 *     - A: col 0-3
 *     - B: col 1-2
 *     - C: col 4-5
 *   → A lane 0, B lane 1 (A와 겹침), C lane 0 (A 끝나서 사용 가능)
 */
export function assignLanes(segments: EventSegment[]): LaidOutSegment[] {
  // 정렬 — 시작 빠른 순, 같으면 긴 것 먼저 (긴 일정이 위에 가도록)
  const sorted = [...segments].sort((a, b) => {
    if (a.startCol !== b.startCol) return a.startCol - b.startCol;
    return b.endCol - b.startCol - (a.endCol - a.startCol);
  });

  const lanes: LaidOutSegment[][] = []; // lanes[laneIdx] = segments in that lane

  const result: LaidOutSegment[] = [];

  for (const seg of sorted) {
    // 첫 번째 빈 lane 찾기 — 이 lane의 모든 기존 segment가 새 seg와 컬럼 겹침 없음
    let assigned = -1;
    for (let i = 0; i < lanes.length; i++) {
      const lane = lanes[i];
      if (!lane) continue;
      const hasOverlap = lane.some(
        (existing) => !(seg.endCol < existing.startCol || seg.startCol > existing.endCol),
      );
      if (!hasOverlap) {
        assigned = i;
        break;
      }
    }
    if (assigned === -1) {
      // 모든 lane이 겹침 → 새 lane 추가
      assigned = lanes.length;
      lanes.push([]);
    }
    const laid: LaidOutSegment = { ...seg, lane: assigned };
    const targetLane = lanes[assigned];
    if (targetLane) targetLane.push(laid);
    result.push(laid);
  }

  return result;
}

/**
 * 주어진 컬럼(0~6)에서 lane <= maxLane인 segment가 그 컬럼을 cover하는지 카운트.
 * "+N 더보기" 계산용 — 셀에 보이는 lane은 0..maxVisible-1, 그 이상은 숨김.
 */
export function countHiddenAtColumn(
  segments: LaidOutSegment[],
  column: number,
  maxVisible: number,
): number {
  return segments.filter((s) => s.lane >= maxVisible && column >= s.startCol && column <= s.endCol)
    .length;
}
