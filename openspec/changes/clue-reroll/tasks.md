## 1. Waiting roll and reroll

- [x] 1.1 Add `test.test.ts` cases: a reroll spends 1 clue, replaces the chosen die and recounts; the new face stands even when lower (seed chosen so it is); no clue refused; nothing waiting refused. Add `actions.test.ts` case: a rerolled Acquire roll measures the cards against the recounted result. Verify: fail.
- [x] 1.2 Add `Roll` and `rerollDie` to `test.ts`, make `acquiring` a `Roll` (design D1, D2). Verify: 1.1 passes.

## 2. Combat in steps

- [x] 2.1 Rewrite the `encounter.test.ts` fight cases to continue through the waiting Will and Strength rolls with a helper, and add: the Will dice wait with no sanity lost; a draw during a fight is refused; a reroll during the Will step is logged. Verify: fail.
- [x] 2.2 Split `fight` into the opening roll and `continueFight`, add `EncounterPhase.combat`, refuse draw, finish and a second fight while it waits (design D3). Verify: 2.1 passes, `pnpm test` passes.

## 3. Panel

- [x] 3.1 Add `Dice.tsx` with Reroll buttons, use it in `Acquire.tsx`, and render the waiting combat roll with Continue in `Encounter.tsx` (design D4). Verify in the browser: Fight shows the Will dice; Reroll changes one die and lowers the clue count in Status; Continue shows the Strength dice; Continue again ends the fight with the losses logged.

## 4. Finish

- [x] 4.1 Run simplify/deslop over `src/engine/test.ts`, `src/engine/encounter.ts`, `src/table/Dice.tsx`, `src/table/Encounter.tsx`; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
