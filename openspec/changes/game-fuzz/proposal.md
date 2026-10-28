## Why

Thirty-odd changes have grown the engine by hand, each with its own tests, and the state carries invariants no single test watches: every monster token is in exactly one of cup, board and set-aside pile; the held clue list matches the counts on the sheets; every deck plus its discard keeps its card count; the journal only grows. A random-play test that drives whole games through the public engine functions catches the interaction bugs the unit tests cannot (`openspec/config.yaml` asks for tests first; no rulebook source, this is engineering hygiene).

## What Changes

- A seeded random-play test: for a handful of seeds it sets up a game with 2 to 4 investigators, then plays up to 20 rounds choosing random legal steps from the engine's public functions in every phase (actions, fights, draws, finishes, card-text effects, mythos resolution, replacements), swallowing refusals and failing on any other throw.
- After every step it checks the invariants: monster tokens partition across cup, board and set-aside pile with no duplicate; held clues equal the sum of the investigators' clues; each deck with its discard keeps the setup count, the mythos deck only shrinking; clue tokens partition across pool, board, discard and held; doom stays within the track; the journal never shrinks; the state survives a JSON round trip.
- Fixes for whatever the test finds, each with its own regression test.
- **Deviations**: none; no spec changes, the change is marked `skip_specs`.
- Non-goals: performance, exhaustive rule coverage, a fuzzing harness beyond vitest.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- none (test-only change, `skip_specs: true`)

## Impact

- New `src/engine/fuzz.test.ts`; any engine file the findings touch, with regression tests beside the existing ones.
