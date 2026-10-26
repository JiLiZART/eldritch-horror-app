## 1. Content: asset values and traits

- [x] 1.1 Add a `core-set.test.ts` case: ".38 Revolver" has value 1 and traits Item, Weapon; add `validate.test.ts` cases: an asset without a value or without traits fails naming the card. Verify: fail.
- [x] 1.2 Write `scripts/asset-values.ts` by reading the 40 core asset card images; add `Card.value` to `src/content/types.ts`; merge the table in `copy-core-assets.ts`; regenerate `cards.json`; add the validator checks (design D1). Verify: 1.1 passes; `pnpm content:validate` passes; images unchanged.

## 2. Skill test

- [x] 2.1 Add `test.test.ts` cases per spec: 4 dice for Charlie Kane, 3 with modifier -1, 1 die minimum, successes count only 5 and 6, the same seed replays the same faces, `rolls` increments. Verify: fails to compile.
- [x] 2.2 Implement `src/engine/test.ts`, add `rolls` and `assetDiscard` to `GameState` and setup (design D2, D4). Verify: 2.1 and `setup.test.ts` pass.

## 3. Acquire Assets

- [x] 3.1 Add `actions.test.ts` cases per spec scenario: roll stored, cards gained with refill, too expensive, nothing gained with a discard, discard refused with a gain, not a city, monster present, end of turn and other actions refused mid-choice, deck reshuffled from the discard. Verify: fail.
- [x] 3.2 Implement `acquireAssets`, `takeAssets`, `refillReserve`, the `acquiring` guard in `mayAct` and `endTurn`, and `acquire-assets` in `ActionName` (design D3, D4). Verify: 3.1 passes.

## 4. Panel

- [x] 4.1 Show the reserve with values in `Status`; add the Acquire Assets button, dice, result, card checkboxes, discard select and Take button to `Turn` (design D5). Verify in the browser: Charlie Kane on San Francisco, Acquire Assets shows 4 dice, taking cards within the result moves them to his possessions and refills the reserve; ending the turn mid-choice is refused.

## 5. Finish

- [x] 5.1 Spot-check 10 random entries of `scripts/asset-values.ts` against the card images; run simplify/deslop over `src/engine/` and `src/table/`. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
