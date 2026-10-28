## 1. Panel

- [x] 1.1 Add the `panel.filterSpaces` string to both i18n files and the filter input and state in `Panel.tsx` (design D1). Verify in the browser: typing "lon" leaves London in the list and clearing restores it; in Russian "лон" finds Лондон; `pnpm test` and `pnpm content:validate` pass.

## 2. Finish

- [x] 2.1 Run simplify/deslop over `src/table/Panel.tsx`. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
