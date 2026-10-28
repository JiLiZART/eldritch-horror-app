## 1. Engine

- [x] 1.1 Add tests: `setup.test.ts` the held list holds exactly the starting clue ids and none is in the pool; `effects.test.ts` a gained clue joins the held list, a spent clue moves one id to the discard with the pool unchanged, a devoured investigator's two clues both move; `test.test.ts` a reroll moves one id. Verify: fail.
- [x] 1.2 Add `heldClues`, `spendHeldClue`, the pushes in `gainClue` and setup, the replacement write-back (design D1–D3). Verify: 1.1 passes, `pnpm test` passes.

## 2. Finish

- [x] 2.1 Run simplify/deslop over `src/engine/effects.ts`, `src/engine/setup.ts`; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
