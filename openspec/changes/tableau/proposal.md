## Why

The rules put the Ancient One sheet "faceup ... near the board", the mystery card "near the ancient one sheet" and the ongoing mythos cards beside them (manual p.3). On the table they appear only as thumbnails in the status panel, so a player reading the mystery squints at a list while the board has room beside it.

## What Changes

- The Ancient One sheet (back once awakened), the current mystery card and the ongoing mythos cards lie as card faces to the right of the board, like the reserve cards lie in their slots.
- **Deviations**: none.
- Non-goals: the reference card, solved mysteries, the investigator sheets, reading the cards by zoom (MapControls already zooms), moving the panel thumbnails.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: a tableau of the Ancient One's cards beside the board.

## Impact

- `src/table/Table.tsx`: a `Tableau` component beside the board driven by a `tableau` prop; `src/table/geometry.ts`: its positions; `src/table/App.tsx`: the prop from the game state. 3D table; the panel keeps its thumbnails.
