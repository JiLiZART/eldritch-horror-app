## Why

The investigator bounds added to the random-play test found a combat loss below zero within six seeds. The board's own numbers are still unchecked: a monster standing with health lost at or past its toughness, a cup token carrying damage, a gate or clue laid twice on one space or on no space, a negative count of eldritch tokens on a space or an omen space, a negative mystery token count. Each is a rule, cheap to assert, and a failure would be a defect to propose. Tooling only.

## What Changes

- The fuzz invariants gain: a monster on the board has health lost at or above zero and, when its toughness is a number, below it; a monster in the cup or set aside has none; gates and clues lie on distinct known spaces; rumor and eldritch spaces are known with counts at or above zero; the eldritch counts on the omen track and the mystery tokens are at or above zero.
- **Deviations**: none.
- Non-goals: new engine behaviour; a failing bound becomes its own change.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- none (tests; `skip_specs`).

## Impact

- `src/engine/fuzz.test.ts`.
