## 1. Engine

- [x] 1.1 Add `effects.test.ts` cases: Leo Anderson devoured at doom 12 with Hired Muscle, 1 clue and Lore +1: doom 11, the asset on the discard, clue and improvement gone, marked devoured, Lily Chen encountering, log line; the lead passes; the last standing investigator devoured loses the game naming him; `mythos.test.ts` case: a devoured Leo Anderson is replaced by Charlie Kane; `pieces.test.ts` case: no pawn for a devoured investigator. Verify: fail.
- [x] 1.2 Add the `"devoured"` value, split `fall` out of `defeat`, add `devour`, skip the pawn (design D1–D3). Verify: 1.1 passes, `pnpm test` passes.

## 2. Panel

- [x] 2.1 Add Devour to the Investigator group and the Status wording (design D3). Verify in the browser: Devour on Leo marks him devoured in Status, removes his pawn from the table, and the Mythos panel offers his replacement.

## 3. Finish

- [x] 3.1 Run simplify/deslop over `src/engine/effects.ts`, `src/engine/encounter.ts`; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
