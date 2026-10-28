## Why

In combat "the monster loses health equal to the number of successes rolled (place health tokens on its token)" (manual p.3). The table keeps a monster's health lost in its hover label only, so a wounded monster looks like a fresh one until the pointer rests on it. The numbered health token art is in the set.

## What Changes

- A monster that has lost health carries a numbered health token on its board token, from the game state; an unhurt monster carries none.
- **Deviations**: none.
- Non-goals: toughness shown, epic monsters treated differently, values above 9.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: a wounded monster carries a health token.

## Impact

- `src/table/pieces.ts`: a `damage` on monster pieces; `src/table/Table.tsx`: `Pieces` draws the token. 3D table only.
