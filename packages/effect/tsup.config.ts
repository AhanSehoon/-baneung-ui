import { promises as fs } from 'node:fs';
import path from 'node:path';

import { defineConfig } from 'tsup';

/**
 * @baneung-pack/effect 빌드 설정.
 *
 * - 단일 진입점 (index.ts)
 * - ESM + CJS dual + .d.ts
 * - React/react-dom는 peer — 번들 제외
 * - React import가 있는 파일에 'use client' 자동 주입 → Next.js RSC 호환
 * - 스타일 파일 없음 (컴포넌트는 inline style 기반, Tailwind 비종속)
 */
const USE_CLIENT_BANNER = "'use client';\n";
const CLIENT_IMPORT_REGEX = /from\s+["'](react(\/|$|-dom))/;

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
  external: ['react', 'react-dom'],
  outExtension({ format }) {
    return { js: format === 'cjs' ? '.cjs' : '.js' };
  },
  async onSuccess() {
    await injectUseClient(path.resolve('dist'));
  },
});
