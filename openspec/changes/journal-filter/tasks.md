## 1. Panel

- [x] 1.1 Add `panel.filterJournal` to both i18n files and the filter in `Journal` (design D1). Verify in the browser: after a few steps, typing "rest" leaves only the rest lines and clearing restores all; `pnpm test` and `pnpm content:validate` pass.

## 2. Finish

- [x] 2.1 Run simplify/deslop over `src/table/Panel.tsx`. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
