## Why

Improvement tokens go on the skill on the sheet (manual p.3 "Improvement token") and travel tickets stay with the investigator; the status table lists them as numbers and words while the sheets on the table show the printed values only. The health and sanity tokens set the pattern; the improvement and ticket art is in the set.

## What Changes

- An improvement token on each improved skill's box (two stacked for +2) and a train or ship token per ticket in the sheet's top-right corner, from the game state.
- **Deviations**: none.
- Non-goals: a +2 face (the art has +1 only; two tokens stack), clue tokens on sheets, the status table.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: improvement and ticket tokens lie on the sheets.

## Impact

- `src/table/Table.tsx`: `Sheets` draws the tokens with the stamp helper; `src/table/App.tsx`: improvements and tickets per sheet. 3D table only.
