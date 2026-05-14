# @baneung-pack/grid

## 0.2.0

### Minor Changes

- 6fa8183: 새 패키지 `@baneung-pack/grid` 추가 (v0.1.0 MVP).

  데이터 그리드 컴포넌트로 props 하나로 가상화 모드 토글이 가능하고, 내장
  페이지네이션과 외부 페이지네이션 컨트롤 둘 다 지원한다. 셀 렌더링은
  text(기본) + 커스텀 함수 방식. 인라인 편집·드롭다운/날짜/숫자 콤마 등
  빌트인 렌더러·ref API(saved/changed/deleted)는 후속 버전에서 추가 예정.

  가상화는 `@tanstack/react-virtual` 기반. `@baneung-pack/ui`와 같은 디자인
  토큰을 공유하며 모든 스타일을 `@layer baneung`에 격리해 ui와 함께 임포트해도
  스타일이 자연스럽게 머지된다.
