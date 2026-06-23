/**
 * chart.js 컨트롤러/스케일/플러그인 일괄 등록.
 *
 * 각 차트 컴포넌트 파일 상단에서 `import { ensureChartJsRegistered } from '../../lib/chartjs-setup'`로
 * import 후 모듈 최상위에서 호출. 함수 호출은 부수효과가 명확해 번들러(tsup + esbuild)가
 * 트리쉐이크하지 못함.
 *
 * # 왜 단순 side-effect import가 아닌가
 * 우리 package.json의 `sideEffects: ["**\/*.css"]` 화이트리스트가 JS 파일을 side-effect-free로
 * 표시하므로 `import './chartjs-setup'` 형태는 tsup이 빌드 시 제거함.
 * 함수 export + 명시적 호출 패턴은 import를 "사용됨"으로 인식시켜 보존된다.
 *
 * # 멱등성
 * register()는 같은 클래스를 여러 번 등록해도 무해. 따라서 컴포넌트가 5개라 5번 호출돼도 OK.
 */
import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  DoughnutController,
  Filler,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PieController,
  PointElement,
  RadarController,
  RadialLinearScale,
  ScatterController,
  Tooltip,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

let registered = false;

/**
 * chart.js에 필요한 모듈을 1회 등록. 멱등 — 중복 호출 안전.
 * datalabels는 글로벌로 등록하되 기본은 비활성(`display: false`).
 * 차트별 `showValues` prop에서 명시적으로 켤 때만 표시.
 */
export function ensureChartJsRegistered(): void {
  if (registered) return;
  ChartJS.register(
    // 컨트롤러 — MixedChart가 Bar + Line 동시 사용시 필수
    BarController,
    LineController,
    PieController,
    DoughnutController,
    ScatterController,
    RadarController,
    // 스케일
    CategoryScale,
    LinearScale,
    RadialLinearScale, // RadarChart 전용 — 방사형 0~max 스케일
    // 엘리먼트
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    // 플러그인
    Legend,
    Tooltip,
    Filler, // AreaChart의 fill 옵션에 필요
    ChartDataLabels, // 데이터 라벨 (showValues 옵션에서 사용)
  );
  // 등록 즉시 모든 차트에 라벨이 뜨지 않도록 글로벌 기본을 비활성.
  // 각 차트가 options.plugins.datalabels.display로 opt-in.
  (ChartJS.defaults as unknown as { set: (k: string, v: unknown) => void }).set?.(
    'plugins.datalabels',
    { display: false },
  );
  registered = true;
}
