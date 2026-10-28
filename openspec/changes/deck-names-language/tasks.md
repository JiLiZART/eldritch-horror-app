## 1. Panel

- [ ] 1.1 Add the `deck.*` and `set.*` keys to both i18n files (every deck id, the four piles, the Core set) and use them in `Status` and for the set names (design D1). Verify: `pnpm content:validate` and `src/table/lang.test.ts` pass; in the browser with the board language Russian, the Decks line shows the Russian names.

## 2. Finish

- [ ] 2.1 Run simplify/deslop over the touched files. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
