/**
 * React Three Fiber JSX intrinsic elements (<mesh>, <boxGeometry>, <ambientLight> 등)는
 * `@react-three/fiber`가 global JSX namespace를 augment해서 제공한다.
 *
 * 다만 augmentation은 `export *` 로 전파되지 않으므로, 컴포넌트 파일이
 * `@react-three/fiber`에서 무언가를 import하지 않으면 타입을 못 찾는다.
 *
 * 이 파일은 패키지 전역에서 한 번 import하는 효과를 내 모든 .tsx 파일에서
 * R3F intrinsic을 사용할 수 있게 한다.
 */
import '@react-three/fiber';
