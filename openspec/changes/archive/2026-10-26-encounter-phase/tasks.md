## 1. Content: monster backs

- [x] 1.1 Add a `core-set.test.ts` case: the Byakhee has Will modifier 0, horror 1, Strength modifier 0, damage 2, toughness 2; add `validate.test.ts` cases: a non-epic monster without toughness or without any test fails naming the monster. Verify: fail.
- [x] 1.2 Write `scripts/monster-stats.ts` by reading the 37 core token backs; add `Monster.combat` to `src/content/types.ts`; merge the table in `copy-core-assets.ts`; regenerate `monsters.json`; add the validator checks (design D1). Verify: 1.1 passes; `pnpm content:validate` passes; images unchanged.

## 2. Phase and state shape

- [x] 2.1 Add `encounter.test.ts` cases: the last seat's end of turn opens the Encounter phase with the lead encountering; finishing with no monster and no card advances to the next seat; the last finish draws the mythos card; update the `actions.test.ts` and `mythos.test.ts` cases that expect the Mythos phase after the last seat. Verify: fail.
- [x] 2.2 Add the `encounter` phase, `MonsterOnBoard.health`, `InvestigatorState.defeated`, `GameState.discards` to `types.ts`; `startEncounters` and `finishEncounter` in `src/engine/encounter.ts`; `endTurn` calls `startEncounters` (design D2, D3). Verify: 2.1 and `setup.test.ts` pass.

## 3. Combat

- [x] 3.1 Add `encounter.test.ts` cases per `combat-encounter` scenario: order of choice, elsewhere refused, non-epic first, losses by the difference, monster defeated to the cup, wounded monster finished, missing test skipped, fight logged. Verify: fail.
- [x] 3.2 Implement `fight` (design D3). Verify: 3.1 passes.

## 4. Draw and defeat

- [x] 4.1 Add cases: location, research, other world and expedition draws; deck not allowed; second draw refused; monster blocks the draw; finish discards the card and moves the expedition token; defeat by sanity advances doom and skips the seat; lead passes; defeated skipped in the Action phase; all defeated loses. Verify: fail.
- [x] 4.2 Implement `drawEncounter`, the discard and expedition move in `finishEncounter` (helper extracted from `setupGame`), `defeat`, and the defeated-skipping in `endTurn`, `nextRound` and `startEncounters` (design D3, D4). Verify: 4.1 passes.

## 5. Panel

- [x] 5.1 Add `src/table/Encounter.tsx` and wire it in `App` (design D5): monsters with backs and Fight, log, deck buttons, drawn card, Finish; defeated mark in `Status`; standing investigators only in the Mythos lead select; lost health on monster pieces. Verify in the browser: Leo then Lily, seed with a monster on a starting space or after a mythos surge, Fight lists both rolls and losses, Finish passes to Lily, her Finish opens the Mythos phase.

## 6. Finish

- [x] 6.1 Spot-check 10 random entries of `scripts/monster-stats.ts` against the token backs; run simplify/deslop over `src/engine/` and `src/table/`. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
