/**
 * lint-staged 설정.
 *
 * # 왜 함수형 + 별도 파일인가
 * 두 가지 문제를 동시에 풀어야 했음:
 *
 *  1. ESLint base의 `ignorePatterns`에 `*.config.*`가 포함돼 있어 스테이지된
 *     `tsup.config.ts` 등을 그대로 ESLint에 넘기면 "File ignored…" 경고가 나옴.
 *     ESLint v8에는 `--no-warn-ignored`가 없어 `--max-warnings 0`과 충돌.
 *
 *  2. 초기 커밋처럼 수백 개 파일이 한 번에 staged되면 lint-staged가 모든
 *     경로를 한 줄 명령에 펼쳐 ESLint를 spawn하는데, Windows에서 그 child
 *     process가 KILLED 되는 사례가 있었음(메모리/세그먼트 한계 추정).
 *
 * # 해결
 * - ESLint는 staged 파일 list 대신 **워크스페이스 전체**를 한 번 검사 (`pnpm -w lint`).
 *   파일이 0개든 500개든 항상 단일 process — Windows spawn 이슈 회피.
 *   ignorePatterns도 평소대로 동작.
 * - Prettier만 staged 파일을 직접 받아 변경 파일에 한정해 포맷 수정.
 *
 * 부수 효과: ESLint 검사 범위가 커져 pre-commit이 다소 느려짐 (turbo 캐시로 완화).
 */
const quote = (files) => files.map((f) => `"${f}"`).join(' ');

module.exports = {
  '*.{ts,tsx,js,jsx}': (files) => [
    'pnpm -w lint',
    `prettier --write ${quote(files)}`,
  ],
  '*.{json,md,css,yml,yaml}': (files) => `prettier --write ${quote(files)}`,
};
