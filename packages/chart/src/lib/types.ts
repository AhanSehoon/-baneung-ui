/**
 * @baneung-pack/chart 공통 타입.
 *
 * 모든 차트 종류가 공유하는 데이터/옵션 인터페이스.
 * React/Three.js 의존성 없는 순수 타입만 정의.
 */

/**
 * 단일 막대(또는 도시 빌딩 등) 한 개를 표현하는 데이터.
 *
 * 후속 차트 종류(City/Timeline/Map)도 기본적으로 같은 형태를 공유하되
 * 필요한 필드를 `meta`에 담아 확장한다 (예: City Chart는 meta.lat/lng).
 */
export interface BarChartDatum {
  /**
   * X축 라벨이자 mesh의 key.
   * 중복되면 React가 경고를 띄우고 mesh 재사용이 깨질 수 있으니 고유해야 함.
   */
  label: string;

  /**
   * 데이터 값. 막대 높이로 변환된다.
   * 음수는 절댓값으로 처리(높이는 항상 양수).
   */
  value: number;

  /**
   * 막대 색상 override. CSS color 문자열 (예: '#5BA8A0', 'rgb(...)').
   * 미지정 시 차트 컴포넌트의 `barColor` prop 기본값 사용.
   */
  color?: string;

  /**
   * tooltip 커스터마이즈나 후속 확장을 위한 임의 데이터.
   */
  meta?: Record<string, unknown>;
}

/**
 * scale 함수 옵션 — 데이터 → 높이 변환 시 사용.
 */
export interface ScaleHeightOptions {
  /**
   * 가장 큰 값에 대응할 막대 높이 (Three.js 단위).
   * 기본값 5. 너무 크면 카메라가 막대 밖으로 벗어남.
   */
  maxHeight?: number;
}
