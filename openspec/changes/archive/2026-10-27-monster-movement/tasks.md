## 1. Monster effects in the engine

- [x] 1.1 Add `effects.test.ts` cases: a Byakhee moved from London to Arkham with the log line; toward nearest from Arkham to London with Leo on London and Lily on Shanghai; already with Leo on London stays with the log line; a monster not on the board refused naming it; unknown space refused; a discarded Byakhee returns to the cup with the log line; a discarded epic monster leaves the game with the log line. Verify: fail.
- [x] 1.2 Split `textPhase` out of `subject` and implement `moveMonster`, `moveMonsterToward`, `discardMonster` in `effects.ts` with `neighbors` and `distance` (design D1–D4). Verify: 1.1 passes.

## 2. Panel

- [x] 2.1 Add the monster row to `Effects.tsx` (design D5). Verify in the browser: with a monster on the board, choose it, Move to Arkham moves the token on the table, Toward nearest investigator moves it one space, Discard removes it and grows the monster cup count.

## 3. Finish

- [x] 3.1 Run simplify/deslop over `src/engine/effects.ts` and `src/table/Effects.tsx`; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
