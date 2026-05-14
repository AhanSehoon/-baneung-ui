import { defineConfig } from 'tsup';

/**
 * @baneung-pack/grid 빌드 설정.
 *
 * - 단일 진입점 (index.ts)
 * - ESM + CJS dual + .d.ts
 * - peer 의존성(react/react-dom)은 번들에 포함하지 않음
 * - sideEffects는 CSS만
 * - Tailwind v4 CLI를 onSuccess에서 호출 → src/styles/globals.css → dist/styles.css
 */
export default defineConfig({
  entry: ['src/index.ts'],
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
