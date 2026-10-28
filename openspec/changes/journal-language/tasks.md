## 1. Panel

- [x] 1.1 Add the four `journal.*` keys to both i18n files and use them in `Journal` (design D1). Verify: `pnpm content:validate` and `src/table/lang.test.ts` pass; in the browser with the board language Russian, after Rest and End turn the journal's lines start with the Russian phase word.

## 2. Finish

- [x] 2.1 Run simplify/deslop over the touched files. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
