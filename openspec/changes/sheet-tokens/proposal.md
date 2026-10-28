## Why

At set-up each player takes "health and sanity tokens equal to your maximum health and sanity values" (manual p.3) and keeps them on the sheet; the counts change all game. The sheets now lie on the table, but health and sanity live only in the status table's columns, so a glance at the table shows no one's condition. The token art with numbers 0 to 9 is in the set already.

## What Changes

- A numbered health token lies on each sheet's heart and a numbered sanity token on its brain, from the game state.
- **Deviations**: none.
- Non-goals: improvement tokens, travel tickets, clue tokens on sheets, values above 9 (the core set's maxima are below it), the status table's columns.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: health and sanity tokens lie on the sheets.

## Impact

- `src/table/Table.tsx`: `Sheets` draws two tokens per sheet; `src/table/App.tsx`: health and sanity per sheet. 3D table only.
