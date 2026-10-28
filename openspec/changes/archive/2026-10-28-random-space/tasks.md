## 1. Engine

- [x] 1.1 Add `effects.test.ts` cases: a random move lands on the top clue token's space with that token on the discard and the log line; a random spawn spawns there or where the back sends the monster; an empty pool is rebuilt from the discard first; pool and discard empty refused naming the lead investigator. Verify: fail.
- [x] 1.2 Add `randomSpace`, `moveInvestigatorRandomly`, `spawnMonsterRandomly` (design D1, D2). Verify: 1.1 passes, `pnpm test` passes.

## 2. Panel

- [x] 2.1 Add the two buttons (design D3). Verify in the browser: Move to a random space moves Leo to the space the log names and the clue pool count drops by 1.

## 3. Finish

- [x] 3.1 Run simplify/deslop over `src/engine/effects.ts`; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
