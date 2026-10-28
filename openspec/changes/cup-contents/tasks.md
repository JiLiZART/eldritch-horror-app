## 1. Panel

- [x] 1.1 Add `status.cup` to both i18n files and the fold in `Status` (design D1). Verify in the browser: the fold lists the cup's kinds with counts summing to the cup's size shown in the Decks line; `pnpm test` and `pnpm content:validate` pass.

## 2. Finish

- [x] 2.1 Run simplify/deslop over `src/table/Panel.tsx`. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
