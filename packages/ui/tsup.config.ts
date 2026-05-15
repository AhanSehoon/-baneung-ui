import { promises as fs } from 'node:fs';
import path from 'node:path';
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
 * - 모든 .js/.cjs 출력 파일 최상단에 `'use client';` 디렉티브 주입
 *   (Next.js App Router RSC 호환 — 대부분 컴포넌트가 Radix/hook 기반)
 */
const USE_CLIENT_BANNER = "'use client';\n";

/**
 * dist 안의 .js / .cjs 파일 중 React/Radix를 사용하는 파일에만
 * 'use client' 디렉티브를 최상단에 삽입.
 *
 * 모든 파일에 무차별로 주입하면 `cn` 같은 순수 유틸리티까지 client-only가 되어
 * 서버 컴포넌트에서 호출할 수 없게 되는 문제가 생긴다.
 * (Next.js: "Attempted to call cn() from the server but cn is on the client")
 *
 * 휴리스틱: react / react-dom / react/jsx-runtime / @radix-ui / sonner / lucide 등
 * UI 런타임 import가 있는 파일만 client 컴포넌트 코드로 간주.
 */
const CLIENT_IMPORT_REGEX =
  /from\s+["'](react(\/|$|-dom)|@radix-ui\/|sonner|lucide-react|cmdk|vaul|@tanstack\/react-)/;

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
      // CJS는 'use strict'가 자동 삽입됨 → 그 앞에 추가
      await fs.writeFile(file, USE_CLIENT_BANNER + content, 'utf8');
    }),
  );
}

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
  async onSuccess() {
    await injectUseClient(path.resolve('dist'));
    // 그 다음 Tailwind CSS 빌드
    const { execSync } = await import('node:child_process');
    execSync('tailwindcss -i src/styles/globals.css -o dist/styles.css --minify', {
      stdio: 'inherit',
    });
  },
});
