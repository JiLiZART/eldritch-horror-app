## Why

Cards gained are placed "faceup near your investigator sheet" (manual p.4). The sheets now lie below the board, but the cards an investigator holds show only as names in the status table, so checking what a weapon does means the panel's card viewer. With the sheets on the table, their cards belong under them, readable by the card focus.

## What Changes

- Each investigator's possessions, then conditions, lie as small faces under their sheet, three per row, wrapping; the table extent grows to the deepest row; a click reads a card.
- **Deviations**: none.
- Non-goals: the back of a condition (its reckoning side), tokens on cards, trading by drag, artifacts or spells drawn differently from assets.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: held cards lie under the sheets.

## Impact

- `src/table/geometry.ts`: `heldPosition`, `tableExtent` takes the deepest row; `src/table/Table.tsx`: `Sheets` draws the cards; `src/table/App.tsx`: the images per investigator. 3D table only.
