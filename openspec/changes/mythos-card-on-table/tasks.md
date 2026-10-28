## 1. App

- [x] 1.1 Prepend the drawn card in the Mythos phase in `App.tsx` (design D1). Verify in the browser: with one investigator, Rest, End turn and End turn (or the encounter's finish) into the Mythos phase shows the drawn card in the tableau's mythos row; after the phase it is gone unless ongoing; `pnpm test` passes.

## 2. Finish

- [x] 2.1 Run simplify/deslop over `src/table/App.tsx`. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
