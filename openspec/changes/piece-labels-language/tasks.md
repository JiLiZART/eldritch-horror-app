## 1. Strings and view model

- [ ] 1.1 Add the nine `piece.*` keys to both i18n files from the glossary's terms (design D2). In `src/table/pieces.test.ts`, bind `translate` to the English file and add a failing test that a Russian binding yields the Russian gate label; then thread `t` through `piecesOnSpace` (design D1) and `App.tsx`. Verify: `pnpm test` and `pnpm content:validate` pass.

## 2. Browser

- [ ] 2.1 Verify in the browser: with the board language Russian, hovering Leo Anderson's pawn shows his name, and the selected space's piece list for a gate space reads the Russian gate word; `pnpm test` passes.

## 3. Finish

- [ ] 3.1 Run simplify/deslop over the touched files. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
