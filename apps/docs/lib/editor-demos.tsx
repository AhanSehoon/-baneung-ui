'use client';

import * as React from 'react';

import { Editor, type EditorHandle } from '@baneung-pack/editor';
import { Badge, Button, Card, CardContent, Muted } from '@baneung-pack/ui';

/**
 * 모든 Editor 데모 컴포넌트를 한 곳에서 관리.
 * 각 데모 페이지(`/editor/*`)는 여기서 export된 함수형 컴포넌트만 import해서 렌더한다.
 */

const SAMPLE_HTML = `<h2>바능 에디터에 오신 것을 환영합니다 👋</h2>
<p>이 영역은 <strong>굵게</strong>, <em>기울임</em>, <u>밑줄</u>, <s>취소선</s>을 지원하는 <a href="https://ui.baneung.com" target="_blank" rel="noopener noreferrer">리치 텍스트 편집기</a>입니다.</p>
<ul>
  <li>글머리 기호 목록</li>
  <li>번호 매기기 목록</li>
  <li>인용구 · 코드 블록 · 구분선</li>
</ul>
<blockquote>이미지를 복사해서 붙여넣거나(Ctrl+V) 드래그앤드롭 해보세요.</blockquote>`;

// ─────────────────────────────────────────────────────────────────────────────
// 1. 기본 사용 — 비제어
// ─────────────────────────────────────────────────────────────────────────────

export function BasicDemo() {
  return <Editor defaultValue="<p>여기에 자유롭게 입력해 보세요…</p>" />;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. 제어 + 실시간 HTML 미리보기
// ─────────────────────────────────────────────────────────────────────────────

export function ControlledDemo() {
  const [html, setHtml] = React.useState(SAMPLE_HTML);
  return (
    <div className="flex flex-col gap-4">
      <Editor value={html} onChange={setHtml} minHeight={200} />
      <div className="flex flex-col gap-1">
        <Muted className="text-xs">실시간 HTML 출력</Muted>
        <pre className="max-h-48 overflow-auto border border-border-default bg-surface p-3 text-xs">
          {html}
        </pre>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. 이미지 붙여넣기 / 드래그앤드롭
// ─────────────────────────────────────────────────────────────────────────────

export function ImageDemo() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">클립보드 붙여넣기</Badge>
        <Badge variant="secondary">드래그앤드롭</Badge>
        <Badge variant="secondary">파일 선택(🖼 버튼)</Badge>
      </div>
      <Muted className="text-xs">
        이미지를 복사한 뒤 본문에서 Ctrl+V로 붙여넣거나, 파일을 끌어다 놓아보세요. 기본은 base64
        인라인 삽입이며 이미지는 영역 폭에 맞춰 자동 축소됩니다.
      </Muted>
      <Editor defaultValue="<p>이미지를 여기에 붙여넣거나 드롭해 보세요.</p>" minHeight={220} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. 커스텀 툴바
// ─────────────────────────────────────────────────────────────────────────────

export function CustomToolbarDemo() {
  return (
    <Editor
      toolbar={[
        ['bold', 'italic', 'underline'],
        ['bulletList', 'orderedList'],
        ['link', 'image'],
      ]}
      defaultValue="<p>필요한 버튼만 골라 툴바를 구성할 수 있습니다.</p>"
      minHeight={160}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. 읽기 전용
// ─────────────────────────────────────────────────────────────────────────────

export function ReadOnlyDemo() {
  return <Editor readOnly value={SAMPLE_HTML} minHeight={160} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. 전체 기능 + ref API
// ─────────────────────────────────────────────────────────────────────────────

export function FullFeatureDemo() {
  const ref = React.useRef<EditorHandle>(null);
  const [saved, setSaved] = React.useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <Editor ref={ref} defaultValue={SAMPLE_HTML} minHeight={280} maxHeight={480} />
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => setSaved(ref.current?.getHTML() ?? '')}>
          HTML 저장 (getHTML)
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => ref.current?.insertHTML('<p>📌 ref로 삽입된 문단</p>')}
        >
          문단 삽입 (insertHTML)
        </Button>
        <Button size="sm" variant="ghost" onClick={() => ref.current?.focus()}>
          포커스
        </Button>
      </div>
      {saved !== null && (
        <Card variant="outlined">
          <CardContent className="block p-3">
            <Muted className="mb-1 text-xs">저장된 HTML</Muted>
            <pre className="max-h-40 overflow-auto text-xs">{saved}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
