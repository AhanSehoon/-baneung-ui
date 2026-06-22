# @baneung-pack/editor

> 바능 디자인 시스템 리치 텍스트 에디터 — 풀스택 WYSIWYG 툴바 + 이미지 붙여넣기/드롭 + 반응형

[![npm](https://img.shields.io/npm/v/@baneung-pack/editor.svg)](https://www.npmjs.com/package/@baneung-pack/editor)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://github.com/BaneungCop/-baneung-ui/blob/master/LICENSE)

Keywords: **WYSIWYG** · **editor** · rich-text · contenteditable · React · design-system

**📖 데모 / 컴포넌트 카탈로그**: https://ui.baneung.com

`@baneung-pack/ui`·`@baneung-pack/grid`와 같은 디자인 토큰을 공유하는 리치 텍스트 에디터입니다. `contentEditable` 기반으로 외부 에디터 라이브러리 의존성 없이(런타임 deps 0) 동작하며, 다크 모드와 반응형을 기본 지원합니다.

## 기능

- **인라인 서식**: 굵게 · 기울임 · 밑줄 · 취소선, 글자색 · 형광펜, 글자 크기
- **블록**: 제목(H1–H3) · 본문 · 인용구 · 코드 블록, 구분선
- **목록**: 글머리 기호 / 번호 매기기, 들여쓰기 · 내어쓰기
- **정렬**: 왼쪽 / 가운데 / 오른쪽 / 양쪽
- **링크**: 삽입 · 수정 · 제거 (Ctrl+K)
- **이미지**: 파일 선택 · **클립보드 붙여넣기** · **드래그앤드롭** — 기본 base64 인라인, `onImageUpload`로 서버 업로드 연동
- **기타**: 실행취소 / 다시실행, 서식 지우기, HTML 소스 보기, 전체 화면
- **제어 / 비제어**: `value`+`onChange` 또는 `defaultValue`
- **반응형**: 툴바 자동 줄바꿈, 이미지 `max-width:100%`
- **보안**: 붙여넣기 · 소스 입력 시 경량 새니타이즈(script · 이벤트 핸들러 · `javascript:` 제거)

## 설치

```bash
pnpm add @baneung-pack/editor
# or: npm install @baneung-pack/editor / yarn add @baneung-pack/editor
```

Peer dependencies:

- React `^18 || ^19`
- React DOM `^18 || ^19`

## 사용

```tsx
import '@baneung-pack/editor/styles.css';
import { Editor } from '@baneung-pack/editor';
import { useState } from 'react';

export default function MyPage() {
  const [html, setHtml] = useState('<p>안녕하세요 👋</p>');
  return <Editor value={html} onChange={setHtml} placeholder="내용을 입력하세요…" />;
}
```

### 비제어 + ref API

```tsx
import { Editor, type EditorHandle } from '@baneung-pack/editor';
import { useRef } from 'react';

function Form() {
  const ref = useRef<EditorHandle>(null);
  return (
    <>
      <Editor ref={ref} defaultValue="<p>초기 내용</p>" />
      <button onClick={() => console.log(ref.current?.getHTML())}>저장</button>
    </>
  );
}
```

### 이미지 서버 업로드

```tsx
<Editor
  onImageUpload={async (file) => {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: form });
    const { url } = await res.json();
    return url; // 삽입할 <img src>
  }}
/>
```

`onImageUpload`를 주지 않으면 붙여넣기·드롭·파일선택 이미지는 모두 base64 data URL로 인라인 삽입됩니다(서버 불필요).

### 툴바 커스터마이즈

```tsx
// 그룹(2차원 배열) — 그룹 사이에 구분선이 들어갑니다.
<Editor toolbar={[['bold', 'italic', 'underline'], ['bulletList', 'orderedList'], ['link', 'image']]} />

// 평면(1차원) 배열도 가능
<Editor toolbar={['bold', 'italic', 'separator', 'link']} />

// 툴바 숨김
<Editor toolbar={false} />
```

## Props 요약

| Prop               | 타입                              | 기본값                 | 설명                             |
| ------------------ | --------------------------------- | ---------------------- | -------------------------------- |
| `value`            | `string`                          | —                      | 제어 컴포넌트용 HTML             |
| `defaultValue`     | `string`                          | `''`                   | 비제어 초기 HTML                 |
| `onChange`         | `(html: string) => void`          | —                      | 내용 변경 콜백                   |
| `placeholder`      | `string`                          | `'내용을 입력하세요…'` | 빈 상태 안내 문구                |
| `readOnly`         | `boolean`                         | `false`                | 읽기 전용                        |
| `toolbar`          | `ToolbarConfig \| false`          | 전체 툴바              | 툴바 구성 (1D/2D 배열) 또는 숨김 |
| `onImageUpload`    | `(file: File) => Promise<string>` | base64 인라인          | 이미지 업로드 핸들러             |
| `minHeight`        | `number \| string`                | `240`                  | 본문 최소 높이                   |
| `maxHeight`        | `number \| string`                | —                      | 본문 최대 높이(초과 시 스크롤)   |
| `className`        | `string`                          | —                      | 루트 className                   |
| `contentClassName` | `string`                          | —                      | 본문 영역 className              |
| `ariaLabel`        | `string`                          | `'리치 텍스트 편집기'` | 본문 ARIA 라벨                   |

### `EditorHandle` (ref)

| 메서드          | 설명                      |
| --------------- | ------------------------- |
| `getHTML()`     | 현재 HTML 반환            |
| `getText()`     | 순수 텍스트 반환          |
| `setHTML(s)`    | HTML 설정(새니타이즈 후)  |
| `insertHTML(s)` | 커서 위치에 HTML 삽입     |
| `focus()`       | 본문 포커스               |
| `getElement()`  | 내부 contentEditable 노드 |

## 라이선스

Apache-2.0
