/**
 * 각 Editor 데모의 소스 코드 스니펫 — 데모 페이지에서 "코드 보기" 버튼으로 노출.
 * 실제 데모 구현은 `apps/docs/lib/editor-demos.tsx`에 있다.
 */

export const basicCode = `import '@baneung-pack/editor/styles.css';
import { Editor } from '@baneung-pack/editor';

export default function MyEditor() {
  return <Editor defaultValue="<p>여기에 자유롭게 입력해 보세요…</p>" />;
}`;

export const controlledCode = `import { Editor } from '@baneung-pack/editor';
import { useState } from 'react';

export default function Controlled() {
  const [html, setHtml] = useState('<p>안녕하세요 👋</p>');
  return (
    <>
      <Editor value={html} onChange={setHtml} />
      <pre>{html}</pre>
    </>
  );
}`;

export const imageCode = `import { Editor } from '@baneung-pack/editor';

// 기본: 붙여넣기/드롭/파일선택 이미지를 base64로 인라인 삽입 (서버 불필요)
export function Inline() {
  return <Editor defaultValue="<p>이미지를 붙여넣거나 드롭하세요.</p>" />;
}

// 서버 업로드 연동: File을 업로드하고 반환 URL을 삽입
export function WithUpload() {
  return (
    <Editor
      onImageUpload={async (file) => {
        const form = new FormData();
        form.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: form });
        const { url } = await res.json();
        return url;
      }}
    />
  );
}`;

export const customToolbarCode = `import { Editor } from '@baneung-pack/editor';

// 그룹(2차원 배열) — 그룹 사이에 구분선이 들어갑니다.
export default function CustomToolbar() {
  return (
    <Editor
      toolbar={[
        ['bold', 'italic', 'underline'],
        ['bulletList', 'orderedList'],
        ['link', 'image'],
      ]}
    />
  );
}`;

export const readOnlyCode = `import { Editor } from '@baneung-pack/editor';

// readOnly로 저장된 HTML을 렌더 — 툴바 비활성, 편집 불가
export default function Viewer({ html }: { html: string }) {
  return <Editor readOnly value={html} />;
}`;

export const fullCode = `import { Editor, type EditorHandle } from '@baneung-pack/editor';
import { useRef, useState } from 'react';

export default function Full() {
  const ref = useRef<EditorHandle>(null);
  const [saved, setSaved] = useState('');
  return (
    <>
      <Editor ref={ref} defaultValue="<h2>제목</h2><p>본문</p>" maxHeight={480} />
      <button onClick={() => setSaved(ref.current?.getHTML() ?? '')}>저장</button>
      <button onClick={() => ref.current?.insertHTML('<p>삽입</p>')}>삽입</button>
      <pre>{saved}</pre>
    </>
  );
}`;
