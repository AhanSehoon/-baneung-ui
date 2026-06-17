import Link from 'next/link';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Heading,
  Lead,
  Muted,
  Separator,
} from '@baneung-pack/ui';

export default function LandingPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Heading level={1}>@baneung-pack/chart</Heading>
          <Badge variant="secondary">MVP</Badge>
        </div>
        <Lead>
          데이터를 3D 비주얼 콘텐츠로 변환하는 React Three Fiber 기반 차트 라이브러리. 단순 숫자가
          아닌, 보면 즐거운 인터랙티브 시각화.
        </Lead>
        <div className="mt-2 flex gap-2">
          <Button asChild>
            <Link href="/install">시작하기</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/charts/bar-chart-3d">데모 보기</Link>
          </Button>
        </div>
      </header>

      <Separator />

      <section className="flex flex-col gap-4">
        <Heading level={2} className="text-2xl">
          현재 제공 차트
        </Heading>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/charts/bar-chart-3d"
            className="block transition-colors duration-fast ease-standard hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Card variant="outlined" className="h-full">
              <CardHeader>
                <CardTitle className="text-base">BarChart3D</CardTitle>
                <CardDescription className="text-xs">
                  값에 비례한 높이의 3D 막대. OrbitControls 회전·줌, hover 툴팁.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Muted className="text-xs">v0.1.0 · MVP</Muted>
              </CardContent>
            </Card>
          </Link>
          <Card variant="outlined" className="h-full opacity-60">
            <CardHeader>
              <CardTitle className="text-base">CityChart3D</CardTitle>
              <CardDescription className="text-xs">
                도시 빌딩 형태의 데이터 시각화. 후속 출시 예정.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Muted className="text-xs">계획됨</Muted>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      <section className="flex flex-col gap-3">
        <Heading level={2} className="text-2xl">
          설계 원칙
        </Heading>
        <ul className="list-disc pl-6 text-sm leading-relaxed text-foreground-muted">
          <li>처음부터 범용 차트 라이브러리를 만들지 않는다 — 한 종류씩 완성도 있게.</li>
          <li>데이터 계산 로직(lib/)과 Three.js 렌더(components/)를 분리.</li>
          <li>모바일·성능 최적화는 초기부터 고려 (DPR 캡, mesh 재사용).</li>
          <li>예쁜 비주얼이 전부가 아님 — 숫자 라벨·툴팁으로 데이터 해석 가능.</li>
          <li>웹표준·접근성 준수 — canvas 옆에 sr-only 데이터 테이블 제공.</li>
        </ul>
      </section>
    </div>
  );
}
