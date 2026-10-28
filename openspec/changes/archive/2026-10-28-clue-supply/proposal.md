## Why

Running the fuzz test over sixty seeds (seed 60, round 9) breaks the held-clues invariant: a replacement investigator whose sheet grants a starting clue is recorded with that clue while an empty clue pool hands over none, so the sum of investigators' clues exceeds the held tokens. Clue tokens are a limited supply, unlike most tokens (manual p.4 "Tokens"); the newcomer gets only what is left.

## What Changes

- `placeInvestigator` counts the clues actually taken from the pool, not the sheet's number. A regression test seats a newcomer with an empty pool; `pnpm test:fuzz` passes again.
- **Deviations**: none.
- Non-goals: starting cards missing from the decks (still refused), tracking clues on paper as the manual allows.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `investigator-replacement`: the newcomer's starting clues are bounded by the pool.

## Impact

- `src/engine/setup.ts` (`placeInvestigator`, shared with set-up), `src/engine/mythos.test.ts`. Engine only.
