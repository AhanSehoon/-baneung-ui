import { promises as fs } from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'tsup';

/**
 * @baneung-pack/grid 빌드 설정.
 *
 * - 단일 진입점 (index.ts)
 * - ESM + CJS dual + .d.ts
 * - peer 의존성(react/react-dom)은 번들에 포함하지 않음
 * - sideEffects는 CSS만
 * - Tailwind v4 CLI를 onSuccess에서 호출 → src/styles/globals.css → dist/styles.css
 * - 모든 .js/.cjs 출력 파일에 `'use client';` 디렉티브 주입 (가상화/state/ref 사용 → RSC 환경에서 client 필수)
 */
const USE_CLIENT_BANNER = "'use client';\n";

async function injectUseClient(distDir: string) {
  async function walk(dir: string): Promise<string[]> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      entries.map(async (e) => {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) return walk(full);
        if (e.name.endsWith('.js') || e.name.endsWith('.cjs')) return [full];
        return [];
      }),
    );
    return files.flat();
  }
  const files = await walk(distDir);
  await Promise.all(
    files.map(async (file) => {
      const content = await fs.readFile(file, 'utf8');
      if (content.startsWith("'use client'") || content.startsWith('"use client"')) return;
      await fs.writeFile(file, USE_CLIENT_BANNER + content, 'utf8');
    }),
  );
}

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
  async onSuccess() {
    await injectUseClient(path.resolve('dist'));
    const { execSync } = await import('node:child_process');
    execSync('tailwindcss -i src/styles/globals.css -o dist/styles.css --minify', {
      stdio: 'inherit',
    });
  },
});
