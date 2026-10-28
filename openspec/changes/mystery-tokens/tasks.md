## 1. Engine

- [ ] 1.1 Add `ancientOne.test.ts` cases: two placements count 2 with the log; removal below 0 refused; solving resets the count to 0; setup starts at 0. Verify: fail.
- [ ] 1.2 Add `mysteryTokens`, `changeMysteryTokens` and the reset in `solveMystery` (design D1, D2). Verify: 1.1 passes, `pnpm test` passes.

## 2. Panel

- [ ] 2.1 Add the count to `Status` and the two buttons to the Ancient One group (design D3). Verify in the browser: two Place token clicks show "2 tokens" by the mystery; Solve mystery shows "0 tokens".

## 3. Finish

- [ ] 3.1 Run simplify/deslop over `src/engine/ancientOne.ts`; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
