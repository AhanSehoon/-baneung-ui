import {
  Badge,
  Button,
  ButtonGroup,
  Heading,
  Lead,
  Muted,
  Separator,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  cn,
} from '@baneung-pack/ui';

const variants = ['primary', 'secondary', 'outline', 'ghost', 'destructive'] as const;
const sizes = ['sm', 'md', 'lg'] as const;

export default function HomePage() {
  return (
    <main className={cn('mx-auto max-w-3xl px-8 py-16', 'flex flex-col gap-10')}>
      <header className="flex flex-col gap-2">
        <Heading level={1}>@baneung-pack/ui</Heading>
        <Lead>바능 디자인 시스템 — 각진 디자인, 절제된 컬러, 강한 타이포 위계.</Lead>
        <Muted>Phase 4 — Buttons &amp; Toggles 데모</Muted>
      </header>

      <Separator />

      <section className="flex flex-col gap-4">
        <Heading level={2}>Button — variant × size</Heading>
        <table className="border-collapse">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-foreground-muted">
                variant \ size
              </th>
              {sizes.map((s) => (
                <th
                  key={s}
                  className="px-3 py-2 text-left text-xs font-medium text-foreground-muted"
                >
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {variants.map((v) => (
              <tr key={v}>
                <td className="px-3 py-2 text-xs text-foreground-muted">{v}</td>
                {sizes.map((s) => (
                  <td key={s} className="px-3 py-2">
                    <Button variant={v} size={s}>
                      Button
                    </Button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="flex flex-col gap-3">
        <Heading level={2}>Loading + asChild</Heading>
        <div className="flex gap-3">
          <Button loading>저장 중</Button>
          <Button asChild variant="outline">
            <a href="https://github.com" rel="noreferrer noopener" target="_blank">
              GitHub로 이동
            </a>
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <Heading level={2}>ButtonGroup</Heading>
        <div className="flex flex-col gap-3">
          <ButtonGroup aria-label="페이지 이동">
            <Button variant="outline">이전</Button>
            <Button variant="outline">현재</Button>
            <Button variant="outline">다음</Button>
          </ButtonGroup>
          <ButtonGroup orientation="vertical" aria-label="세로 그룹">
            <Button variant="outline">A</Button>
            <Button variant="outline">B</Button>
            <Button variant="outline">C</Button>
          </ButtonGroup>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <Heading level={2}>Toggle &amp; ToggleGroup</Heading>
        <div className="flex flex-wrap items-center gap-4">
          <Toggle aria-label="굵게" defaultPressed>
            B
          </Toggle>
          <ToggleGroup type="single" defaultValue="left" aria-label="정렬">
            <ToggleGroupItem variant="outline" value="left">
              왼쪽
            </ToggleGroupItem>
            <ToggleGroupItem variant="outline" value="center">
              가운데
            </ToggleGroupItem>
            <ToggleGroupItem variant="outline" value="right">
              오른쪽
            </ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup type="multiple" aria-label="포맷">
            <ToggleGroupItem variant="outline" value="bold">
              B
            </ToggleGroupItem>
            <ToggleGroupItem variant="outline" value="italic">
              I
            </ToggleGroupItem>
            <ToggleGroupItem variant="outline" value="underline">
              U
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </section>

      <Separator />

      <footer className="flex items-center gap-2 text-sm text-foreground-subtle">
        <Badge variant="success">출시 준비</Badge>
        <span>@baneung-pack/ui — Phase 4</span>
      </footer>
    </main>
  );
}
