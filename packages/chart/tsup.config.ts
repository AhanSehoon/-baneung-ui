import { promises as fs } from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'tsup';

/**
 * @baneung-pack/chart 빌드 설정.
 *
 * - 단일 진입점 (index.ts)
 * - ESM + CJS dual + .d.ts
 * - peer: react/react-dom, 외부: three / @react-three/* 도 번들 제외(피어처럼 동작)
 * - sideEffects는 CSS만
 * - Tailwind v4 CLI를 onSuccess에서 호출 → src/styles/globals.css → dist/styles.css
 * - React/R3F/Three import가 있는 파일에만 'use client' 디렉티브 주입 (RSC 환경 호환)
 */
const USE_CLIENT_BANNER = "'use client';\n";

/**
 * React / R3F / Three import가 있는 파일에만 'use client' 주입.
 * 순수 유틸리티(scale 함수 등)는 server에서도 호출 가능하게 둔다.
 */
const CLIENT_IMPORT_REGEX = /from\s+["'](react(\/|$|-dom)|@react-three\/|three(\/|$))/;

async function injectUseClient(distDir: string): Promise<void> {
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
  // three/R3F는 무거우므로 dep로 두되 번들엔 포함 안 함(소비자가 같은 instance 공유 필요).
  external: ['react', 'react-dom', 'three', '@react-three/fiber', '@react-three/drei'],
  outExtension({ format }) {
    return { js: format === 'cjs' ? '.cjs' : '.js' };
  },
  async onSuccess(): Promise<void> {
    await injectUseClient(path.resolve('dist'));
    const { execSync } = await import('node:child_process');
    execSync('tailwindcss -i src/styles/globals.css -o dist/styles.css --minify', {
      stdio: 'inherit',
    });
  },
});
