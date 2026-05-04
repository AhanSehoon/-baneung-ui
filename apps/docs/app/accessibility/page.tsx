import {
  Card,
  CardContent,
  Heading,
  Kbd,
  Lead,
  Muted,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@baneung-pack/ui';

const checklist = [
  '키보드만으로 모든 동작 가능 (Tab, Shift+Tab, Enter, Space, Esc, 화살표)',
  ':focus-visible 스타일 명확 (2px 토큰 ring)',
  '적절한 ARIA role/state/property',
  '스크린리더 라벨 (aria-label / aria-labelledby)',
  '색대비 WCAG AA — 본문 4.5:1, UI 3:1 (axe-core 검증)',
  'prefers-reduced-motion 존중 (모든 애니메이션 즉시화)',
  'IME(한글 입력) 도중 의도치 않은 submit 방지',
  '모바일 터치 타겟 최소 44×44px',
];

const shortcuts = [
  { keys: ['⌘', 'K'], desc: '명령 팔레트 열기' },
  { keys: ['Esc'], desc: '오버레이 닫기' },
  { keys: ['Tab'], desc: '다음 포커스' },
  { keys: ['Shift', 'Tab'], desc: '이전 포커스' },
  { keys: ['Space'], desc: '버튼/체크박스 활성' },
  { keys: ['Enter'], desc: '버튼 활성 / 옵션 선택' },
  { keys: ['↑', '↓'], desc: '메뉴/리스트 항목 이동' },
  { keys: ['←', '→'], desc: '탭/슬라이더 이동' },
  { keys: ['Home', 'End'], desc: '처음/끝으로 이동' },
];

export default function AccessibilityPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>접근성</Heading>
        <Lead>WCAG 2.1 AA는 협상 불가. 모든 컴포넌트가 다음 체크리스트를 충족합니다.</Lead>
      </header>

      <Separator />

      <section className="flex flex-col gap-4">
        <Heading level={2}>체크리스트</Heading>
        <Card variant="outlined">
          <CardContent className="p-6">
            <ul className="flex flex-col gap-2">
              {checklist.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <span aria-hidden="true" className="mt-0.5 text-success">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="flex flex-col gap-4">
        <Heading level={2}>키보드 단축키</Heading>
        <Card variant="outlined">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>단축키</TableHead>
                  <TableHead>동작</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shortcuts.map((s, i) => (
                  <TableRow key={i}>
                    <TableCell className="space-x-1">
                      {s.keys.map((k, j) => (
                        <Kbd key={j}>{k}</Kbd>
                      ))}
                    </TableCell>
                    <TableCell>{s.desc}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <section className="flex flex-col gap-4">
        <Heading level={2}>한글 IME</Heading>
        <Muted>
          Input/Textarea에서 한글 조합 중 Enter는 submit을 트리거하지 않습니다.
          <code className="ml-1 font-mono text-xs">useComposition</code> 훅으로 자동 처리.
        </Muted>
      </section>
    </div>
  );
}
