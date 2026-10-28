## Why

The random-play test only checks that the journal never shrinks. Each entry carries a round, a phase and an optional investigator (game-journal "Every phase's lines and every action are kept"); an entry with a round past the game's, a phase the game was not in, an unknown investigator or empty text would pass unnoticed. Tooling only.

## What Changes

- The fuzz invariants gain: every journal entry's round is between 1 and the state's round, its `who` names a seated investigator when present, its text is not empty, and the entries' rounds never decrease along the journal; the entries that existed before a step are unchanged after it.
- **Deviations**: none.
- Non-goals: new engine behaviour; a failing bound becomes its own change.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- none (tests; `skip_specs`).

## Impact

- `src/engine/fuzz.test.ts`.
