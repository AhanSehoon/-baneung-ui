import { defineConfig } from 'tsup';

/**
 * @baneung-pack/ui 빌드 설정.
 *
 * - 메인 진입점 + 컴포넌트별 subpath 진입점을 동시에 생성
 *   ('./typography', './button' 같은 트리쉐이커블 import 지원)
 * - ESM + CJS dual + .d.ts (Tree-shake 가능, sourcemap 포함)
 * - peer 의존성(react/react-dom)은 번들에 포함하지 않음
 * - sideEffects는 CSS만 (package.json)
 * - Tailwind v4 CLI를 onSuccess에서 호출 → src/styles/globals.css → dist/styles.css
 */
export default defineConfig({
  entry: ['src/index.ts', 'src/components/*/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  external: ['react', 'react-dom'],
  outExtension({ format }) {
    return { js: format === 'cjs' ? '.cjs' : '.js' };
  },
  onSuccess: 'tailwindcss -i src/styles/globals.css -o dist/styles.css --minify',
});
