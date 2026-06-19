import { Heading, Lead, Muted, Separator } from '@baneung-pack/ui';

type Row = [prop: string, type: string, defaultValue: string, desc: string];

const editorProps: Row[] = [
  ['value', 'string', '-', '제어 컴포넌트용 HTML 문자열'],
  ['defaultValue', 'string', "''", '비제어 초기 HTML'],
  ['onChange', '(html: string) => void', '-', '내용 변경 콜백'],
  ['placeholder', 'string', "'내용을 입력하세요…'", '빈 상태 안내 문구'],
  ['readOnly', 'boolean', 'false', '읽기 전용 — 편집·툴바 비활성'],
  ['toolbar', 'ToolbarConfig | false', '전체 툴바', '툴바 구성(1D/2D 배열) 또는 숨김'],
  [
    'onImageUpload',
    '(file: File) => Promise<string>',
    'base64 인라인',
    '이미지 업로드 핸들러. 반환 URL을 src로 삽입',
  ],
  ['minHeight', 'number | string', '240', '본문 최소 높이'],
  ['maxHeight', 'number | string', '-', '본문 최대 높이(초과 시 스크롤)'],
  ['className', 'string', '-', '루트 className'],
  ['contentClassName', 'string', '-', '본문(편집) 영역 className'],
  ['ariaLabel', 'string', "'리치 텍스트 편집기'", '본문 ARIA 라벨'],
];

const handleMethods: [method: string, ret: string, desc: string][] = [
  ['getHTML()', 'string', '현재 HTML 반환'],
  ['getText()', 'string', '마크업 제거한 순수 텍스트 반환'],
  ['setHTML(html)', 'void', 'HTML 설정(새니타이즈 후) + onChange 발생'],
  ['insertHTML(html)', 'void', '커서 위치에 HTML 삽입'],
  ['focus()', 'void', '본문 영역 포커스'],
  ['getElement()', 'HTMLDivElement | null', '내부 contentEditable 노드'],
];

const toolbarItems: [item: string, desc: string][] = [
  ['undo · redo', '실행 취소 / 다시 실행'],
  ['blockFormat', '문단/제목/인용구/코드 드롭다운'],
  ['fontSize', '글자 크기 드롭다운'],
  ['bold · italic · underline · strikethrough', '인라인 서식'],
  ['foreColor · backColor', '글자 색 / 형광펜'],
  ['bulletList · orderedList', '글머리 기호 / 번호 매기기 목록'],
  ['indent · outdent', '들여쓰기 / 내어쓰기'],
  ['alignLeft · alignCenter · alignRight · alignJustify', '정렬'],
  ['link · unlink', '링크 삽입·수정 / 제거'],
  ['image', '이미지 삽입(파일·붙여넣기·드롭)'],
  ['blockquote · codeBlock · horizontalRule', '인용구 / 코드 블록 / 구분선'],
  ['clearFormat', '서식 지우기'],
  ['sourceCode · fullscreen', 'HTML 소스 토글 / 전체 화면'],
  ['separator', '시각적 구분선'],
];

function PropsTable({ rows }: { rows: Row[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border-default">
            <th className="px-3 py-2 text-left font-medium">Prop</th>
            <th className="px-3 py-2 text-left font-medium">타입</th>
            <th className="px-3 py-2 text-left font-medium">기본값</th>
            <th className="px-3 py-2 text-left font-medium">설명</th>
          </tr>
        </thead>
        <tbody className="text-foreground-muted">
          {rows.map(([prop, type, def, desc]) => (
            <tr key={prop} className="border-b border-border-subtle">
              <td className="px-3 py-2 font-mono text-foreground">{prop}</td>
              <td className="px-3 py-2 font-mono text-xs">{type}</td>
              <td className="px-3 py-2 font-mono text-xs">{def}</td>
              <td className="px-3 py-2">{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function EditorPropsPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>Editor · Props</Heading>
        <Lead>
          <code>Editor</code> 컴포넌트의 props, <code>ref</code> 핸들 메서드, 툴바 항목 레퍼런스.
        </Lead>
      </header>

      <Separator />

      <section className="flex flex-col gap-4">
        <Heading level={2} className="text-2xl">
          EditorProps
        </Heading>
        <PropsTable rows={editorProps} />
      </section>

      <section className="flex flex-col gap-4">
        <Heading level={2} className="text-2xl">
          EditorHandle (ref)
        </Heading>
        <Muted className="text-xs">
          <code>useRef&lt;EditorHandle&gt;</code>로 명령형 API에 접근합니다.
        </Muted>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border-default">
                <th className="px-3 py-2 text-left font-medium">메서드</th>
                <th className="px-3 py-2 text-left font-medium">반환</th>
                <th className="px-3 py-2 text-left font-medium">설명</th>
              </tr>
            </thead>
            <tbody className="text-foreground-muted">
              {handleMethods.map(([m, ret, desc]) => (
                <tr key={m} className="border-b border-border-subtle">
                  <td className="px-3 py-2 font-mono text-foreground">{m}</td>
                  <td className="px-3 py-2 font-mono text-xs">{ret}</td>
                  <td className="px-3 py-2">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <Heading level={2} className="text-2xl">
          ToolbarItem
        </Heading>
        <Muted className="text-xs">
          <code>toolbar</code> prop에 넣을 수 있는 항목들. 2차원 배열로 그룹을 나눕니다.
        </Muted>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border-default">
                <th className="px-3 py-2 text-left font-medium">항목</th>
                <th className="px-3 py-2 text-left font-medium">설명</th>
              </tr>
            </thead>
            <tbody className="text-foreground-muted">
              {toolbarItems.map(([item, desc]) => (
                <tr key={item} className="border-b border-border-subtle">
                  <td className="px-3 py-2 font-mono text-xs text-foreground">{item}</td>
                  <td className="px-3 py-2">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
