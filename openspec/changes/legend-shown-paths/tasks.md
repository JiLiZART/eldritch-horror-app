## 1. Legend

- [x] 1.1 Test first in `src/table/sets.test.ts`: `pathTypes` keeps the legend order and drops absent types (design D1). Implement it and use it in `Panel`. Verify in the browser: the legend reads train, ship, uncharted with the core alone and adds local once The Dreamlands is on; `pnpm test` passes.

## 2. Finish

- [x] 2.1 Run simplify/deslop over `src/table/sets.ts` and `src/table/Panel.tsx`. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
