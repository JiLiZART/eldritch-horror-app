## 1. Panel

- [x] 1.1 Add the nine `space.*` keys to both i18n files and use them in `Panel.tsx` (design D1). Verify: `pnpm content:validate` and `src/table/lang.test.ts` pass; in the browser with the board language Russian, selecting London shows the Russian field names and clearing the selection shows the Russian prompt.

## 2. Finish

- [x] 2.1 Run simplify/deslop over the touched files. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
