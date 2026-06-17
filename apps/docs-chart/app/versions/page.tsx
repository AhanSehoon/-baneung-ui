import {
  Badge,
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

interface VersionEntry {
  version: string;
  type: 'major' | 'minor' | 'patch';
  summary: string;
  details: string[];
}

const entries: VersionEntry[] = [
  {
    version: '0.1.0',
    type: 'minor',
    summary: '초기 출시 — 3D Bar Chart MVP (React Three Fiber 기반)',
    details: [
      'BarChart3D: 값 크기에 비례한 3D 막대. OrbitControls 회전·줌, hover 툴팁',
      'ChartCanvas: R3F Canvas 래퍼 (DPR 캡, 조명, OrbitControls)',
      'lib/scale.ts: d3-scale 기반 scaleHeight + computeBarXPositions',
      "CSS Cascade Layers '@layer baneung'로 스타일 격리",
      'tsup의 selective use-client 주입으로 RSC 호환',
    ],
  },
];

export default function VersionsPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>Versions</Heading>
        <Lead>`@baneung-pack/chart` 릴리스 히스토리. 첫 출시부터 현재까지 각 버전 변경사항.</Lead>
        <Muted className="text-xs">
          버전 표기: 빨강 = MAJOR (호환성 깨짐) · 회색 = MINOR (기능 추가) · 외곽선 = PATCH (버그
          수정/문서)
        </Muted>
      </header>

      <Separator />

      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <Heading level={2} className="text-2xl">
            @baneung-pack/chart
          </Heading>
          <Muted className="text-xs">
            현재: <strong className="text-foreground">v0.1.0</strong>
          </Muted>
        </div>
        <div className="flex flex-col gap-3">
          {entries.map((entry) => {
            const variant =
              entry.type === 'major' ? 'danger' : entry.type === 'minor' ? 'secondary' : 'outline';
            const label =
              entry.type === 'major' ? 'MAJOR' : entry.type === 'minor' ? 'MINOR' : 'PATCH';
            return (
              <Card key={entry.version} variant="outlined">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">v{entry.version}</CardTitle>
                    <Badge variant={variant} className="text-[10px]">
                      {label}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm text-foreground">
                    {entry.summary}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-foreground-muted">
                    {entry.details.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
