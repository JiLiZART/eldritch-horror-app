## Why

The random-play test conserves tokens, cards and decks and bounds doom and omen, but says nothing about an investigator's own numbers: health and sanity above the printed maximum or below zero, three tickets, a skill improved three times, a pawn on a space the board lacks, or a defeated investigator with health and sanity both above zero would all pass. Those bounds are rules (manual p.3–4: maximum health and sanity, two tickets, two improvements per skill) and cheap to assert; if one fails, that is a real defect to propose. Tooling only.

## What Changes

- The fuzz invariants gain: health and sanity within zero and the sheet's printed maximum; at most two tickets; each improvement one or two; every investigator's and monster's space on the board; a defeated investigator at zero on the side that fell (devoured excepted); clues never negative.
- **Deviations**: none.
- Non-goals: new engine behaviour; a failing bound becomes its own change.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- none (tests; `skip_specs`).

## Impact

- `src/engine/fuzz.test.ts`.
