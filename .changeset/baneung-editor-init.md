---
'@baneung-pack/editor': minor
---

신규 패키지 `@baneung-pack/editor` — contentEditable 기반 리치 텍스트 WYSIWYG 에디터.

- TinyMCE급 툴바: 굵게/기울임/밑줄/취소선, 글자색·형광펜, 글자 크기, 제목·인용구·코드 블록, 목록/들여쓰기, 정렬, 링크, 구분선, 실행취소/다시실행, 서식 지우기, HTML 소스, 전체 화면
- 이미지 클립보드 붙여넣기 · 드래그앤드롭 · 파일 선택 (기본 base64 인라인, `onImageUpload`로 서버 업로드 연동)
- 제어/비제어 지원(`value`/`onChange` 또는 `defaultValue`), `ref` 명령형 API(`getHTML`·`setHTML`·`insertHTML`·`focus`)
- 반응형(툴바 자동 줄바꿈, 이미지 `max-width:100%`), 다크 모드, 경량 HTML 새니타이즈
- 런타임 의존성 0(clsx·tailwind-merge만), `@baneung-pack/tokens` 디자인 토큰 공유
