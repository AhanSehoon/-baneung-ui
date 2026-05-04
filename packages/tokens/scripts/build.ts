/**
 * @baneung-pack/tokens 빌드 스크립트.
 *
 * 단일 SSOT(`src/index.ts`)에서 다음 산출물을 생성합니다:
 *   - dist/tokens.css   — :root + [data-theme="dark"]
 *   - dist/tokens.json  — Style Dictionary 호환 평면 키
 *   - dist/tokens.js / .cjs / .d.ts — TS/JS import (via tsup)
 *
 * 실행: `pnpm --filter @baneung-pack/tokens build`
 */

import { mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build as tsupBuild } from 'tsup';

import {
  breakpoint,
  colorPrimitive,
  colorSemanticDark,
  colorSemanticLight,
  motion,
  radius,
  shadow,
  spacing,
  typography,
  zIndex,
} from '../src/index';
import { flatToCssDeclarations } from './utils/css';
import { flatten } from './utils/flatten';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(SCRIPT_DIR, '..');
const DIST = resolve(ROOT, 'dist');
const ENTRY = resolve(ROOT, 'src/index.ts');
const TSCONFIG = resolve(ROOT, 'tsconfig.json');

async function main(): Promise<void> {
  // 1. dist 초기화
  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });

  // 2. 평면화 — 테마-독립 토큰
  const themeIndependent = flatten({
    color: { primitive: colorPrimitive },
    spacing,
    radius,
    motion,
    shadow,
    zIndex,
    breakpoint,
    typography,
  });

  // 3. 평면화 — 시맨틱(라이트/다크 분리)
  const lightSemantic = flatten({ color: colorSemanticLight });
  const darkSemantic = flatten({ color: colorSemanticDark });

  // 4. CSS 출력 — :root에 테마-독립 + 라이트, [data-theme="dark"]에 다크 오버라이드
  const css = [
    '/* @baneung-pack/tokens — auto-generated. DO NOT EDIT. */',
    '',
    ':root {',
    flatToCssDeclarations(themeIndependent),
    '',
    flatToCssDeclarations(lightSemantic),
    '}',
    '',
    '[data-theme="dark"] {',
    flatToCssDeclarations(darkSemantic),
    '}',
    '',
  ].join('\n');
  await writeFile(resolve(DIST, 'tokens.css'), css, 'utf8');

  // 5. JSON 출력 — Style Dictionary 호환 평면 키
  //    라이트 시맨틱은 기본 키, 다크는 같은 키에 `:dark` 접미사
  const flatJson: Record<string, string | number> = {
    ...themeIndependent,
    ...lightSemantic,
    ...Object.fromEntries(Object.entries(darkSemantic).map(([k, v]) => [`${k}:dark`, v])),
  };
  await writeFile(resolve(DIST, 'tokens.json'), `${JSON.stringify(flatJson, null, 2)}\n`, 'utf8');

  // 6. JS + CJS + DTS via tsup (tokens.* 이름으로)
  await tsupBuild({
    entry: { tokens: ENTRY },
    format: ['esm', 'cjs'],
    dts: true,
    outDir: DIST,
    outExtension: ({ format }) => ({ js: format === 'cjs' ? '.cjs' : '.js' }),
    sourcemap: true,
    clean: false,
    treeshake: true,
    tsconfig: TSCONFIG,
    silent: true,
  });

  process.stdout.write(
    `✓ @baneung-pack/tokens build complete → ${[
      'tokens.css',
      'tokens.json',
      'tokens.js',
      'tokens.cjs',
      'tokens.d.ts',
    ].join(', ')}\n`,
  );
}

main().catch((err: unknown) => {
  process.stderr.write(`@baneung-pack/tokens build failed: ${String(err)}\n`);
  process.exit(1);
});
