## Why

An encounter card is drawn, read and resolved at the table in front of the investigator (manual p.3 "Encounter Phase"); here it shows as a thumbnail in the Encounter panel while the table beside the investigator's sheet stays empty. The mythos card now lies on the table during its phase; the encounter card is the same gap for the other phase.

## What Changes

- While an encounter card is being resolved, it lies to the right of the encountering investigator's sheet; it leaves when the encounter is finished.
- **Deviations**: none.
- Non-goals: combat (monster tokens are on the board), the special and fallen sheet backs, the panel's thumbnail.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: the encounter card lies beside the sheet.

## Impact

- `src/table/App.tsx`: resolves the phase's card to a face per sheet; `src/table/Table.tsx`: `Sheets` lays it; `src/table/geometry.ts`: its position beside the sheet. View model and 3D table.
