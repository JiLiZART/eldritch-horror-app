## Why

Each player keeps their investigator sheet in front of them (manual p.3 "Setup", step 2: players take an investigator sheet). On the table the sheets appear only behind a Show sheet button in the status panel, so a player checking a skill or a special ability leaves the board. The tableau and card focus now give the table a place and a way to read cards; the sheets belong there too.

## What Changes

- The investigators' sheets lie in a row below the board in seat order; the table extent grows to hold them; clicking one brings it up to read.
- **Deviations**: none.
- Non-goals: possessions, conditions or tokens laid on the sheets, flipping to the back, hiding a defeated investigator's sheet (it stays until they are removed), the panel's Show sheet button.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: the investigator sheets lie below the board.

## Impact

- `src/table/geometry.ts`: `sheetPosition`, `tableExtent` grows downward and rightward; `src/table/Table.tsx`: a `Sheets` component beside `Tableau`; `src/table/App.tsx`: the sheet images in seat order. 3D table only.
