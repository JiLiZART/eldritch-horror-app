## Why

The table extent ends exactly at the outermost card, so a card at the table's edge, brought up to read, is clamped with its edge flush against the view's edge; the sheet row's bottom and the held cards' left side touch the screen. A physical table has felt around the cards. A digital-table defect; no rulebook source.

## What Changes

- The extent carries a margin of 0.3 world units on every side; nothing else moves.
- **Deviations**: none.
- Non-goals: a visible table surface, a different zoom-out limit.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: the table carries a margin around its contents.

## Impact

- `src/table/geometry.ts`: `tableExtent` pads its rectangle; its tests adjust. 3D table only.
