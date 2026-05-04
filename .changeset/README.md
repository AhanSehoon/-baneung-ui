# Changesets

저장소 변경사항을 기록하고 npm publish 시점을 결정합니다.

사용자에게 노출되는 변경(신규 컴포넌트, props 추가/변경, 토큰 변경 등)이 있으면:

```bash
pnpm changeset
```

을 실행해 변경 종류(major / minor / patch)와 설명을 입력하세요.
자세한 룰은 [CLAUDE.md §6](../CLAUDE.md), [PROJECT_PLAN.md §11.2](../PROJECT_PLAN.md)를 참고하세요.
