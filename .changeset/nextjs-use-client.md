---
'@baneung-pack/ui': patch
'@baneung-pack/grid': patch
---

Next.js App Router (RSC) 호환 — 빌드 출력물에 `'use client';` 디렉티브 주입.

대부분 컴포넌트가 Radix UI 기반(내부 hook) 또는 자체 hook을 사용하므로 Next.js
서버 컴포넌트에서 직접 import 시 런타임 오류가 발생하던 문제를 해결.

# 변경
- `tsup` `onSuccess`에서 `dist/**/*.{js,cjs}` 모든 파일의 최상단에 `'use client';` 삽입
- ESM/CJS 양쪽 + 코드 스플리팅 chunk 파일 모두 적용
- 소비자 측에서 추가 설정 없이 RSC 환경에서 그대로 사용 가능
