## 1. Encounter decks

- [x] 1.1 Add `encounter.test.ts` cases: an empty America deck with three on the discard is rebuilt and one is drawn; drawing the last America card with two on the discard rebuilds the deck at once; deck and discard empty refused naming the deck; the expedition token lands on the rebuilt deck's top card after the last expedition card. Verify: fail.
- [x] 1.2 Add `replenish` and call it before and after the draw in `drawEncounter` (design D1). Verify: 1.1 passes.

## 2. Asset and artifact decks

- [x] 2.1 Add `effects.test.ts` cases: an artifact gained from an empty deck with one on the discard; both empty refused naming the deck. Verify: fail.
- [x] 2.2 Rebuild the asset and artifact decks in `gainCard` (design D2). Verify: 2.1 passes, `pnpm test` passes.

## 3. Finish

- [x] 3.1 Run simplify/deslop over `src/engine/encounter.ts` and `src/engine/effects.ts`; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
