## Why

Thirty changes added card-text effects one by one to `src/engine/effects.ts` (360 lines, 40 exports) and their controls to `src/table/Effects.tsx` (376 lines, five groups in one component with eight pieces of local state). Both still read, but every new effect now lands in a file that scrolls, and the panel component re-renders five groups for one select. No rulebook source: maintainability.

## What Changes

- `src/engine/effects.ts` becomes a folder: `investigator.ts` (health, sanity, spending, clues, delay, stand up, improvements, movement), `cards.ts` (gain, discard, possessions of the fallen), `board.ts` (gates, spawns, tokens, random and named spawns, omen tokens), `monsters.ts` (move, toward, discard, ambush, set-aside), `ancient.ts` stays in `ancientOne.ts`; `effects.ts` re-exports everything, so every import and test keeps working.
- `src/table/Effects.tsx` becomes a thin shell with the investigator and space selects, mounting one component per group from `src/table/effects/`, each owning its own local state.
- No behaviour changes: the test suite, the random-play test and the browser checks stay as they are.
- **Deviations**: none; refactor only, `skip_specs`.
- Non-goals: renaming effects, changing labels, new effects.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- none (refactor, `skip_specs: true`)

## Impact

- `src/engine/effects.ts` and the new `src/engine/effects/` files; `src/table/Effects.tsx` and the new `src/table/effects/` files. Imports elsewhere unchanged through the re-exports.
