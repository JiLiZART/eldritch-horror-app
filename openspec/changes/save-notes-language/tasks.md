## 1. Notes

- [x] 1.1 Test first in `src/table/saved.test.ts`: the three notes are the keys (design D1). Add the keys to both i18n files, return them from `saved.ts`, translate in `App` where the note is stored. Verify in the browser: in Russian a loaded file of junk shows the Russian note; `pnpm test` and `pnpm content:validate` pass.

## 2. Finish

- [x] 2.1 Run simplify/deslop over `src/table/saved.ts`. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
