## Why

The random-play bounds added by `fuzz-bounds` fail on four of the first six seeds: after a combat test the investigator's health is −1. The fight subtracts the loss and defeats the investigator without flooring at zero, so the defeated token carries a negative number, which the sheet's health token cannot show and a later heal counts from. Health and sanity never fall below zero (manual p.4 "Defeated Investigators": an investigator with 0 health or sanity is defeated).

## What Changes

- The Will and Strength tests floor the loss at zero; a defeat records zero on the fallen side. A regression test covers damage past zero; the fuzz bounds pass.
- **Deviations**: none.
- Non-goals: card-text losses (already floored by the effects).

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `combat-encounter`: losses floor at zero.

## Impact

- `src/engine/encounter.ts` (`continueFight`); `src/engine/encounter.test.ts`. Engine only.
