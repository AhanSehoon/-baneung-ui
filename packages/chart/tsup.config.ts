import { promises as fs } from 'node:fs';
import path from 'node:path';

import { defineConfig } from 'tsup';

/**
 * @baneung-pack/chart 빌드 설정 — grid 패키지와 동일 패턴.
 *
 * - 단일 진입점 (index.ts)
 * - ESM + CJS dual + .d.ts
 * - peer 의존성 (react/react-dom/chart.js/react-chartjs-2) 번들 미포함
 * - React/chart.js/react-chartjs-2 import 있는 파일에만 'use client' 주입 → RSC 호환
 * - Tailwind v4 CLI를 onSuccess에서 호출 → src/styles/globals.css → dist/styles.css
 */
const USE_CLIENT_BANNER = "'use client';\n";

const CLIENT_IMPORT_REGEX = /from\s+["'](react(\/|$|-dom)|chart\.js|react-chartjs-2)/;

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
      if (!CLIENT_IMPORT_REGEX.test(content)) return;
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
  external: [
    'react',
    'react-dom',
    'chart.js',
    'chart.js/auto',
    'chartjs-plugin-datalabels',
    'react-chartjs-2',
  ],
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
