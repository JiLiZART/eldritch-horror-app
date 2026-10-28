## Why

Pieces name themselves on hover; the card faces on the table do not, so at full zoom-out the reserve is four unreadable rectangles until one is brought up, and the held cards under a sheet are thumbnails with no names. The panel knows every card's name and value; the badge exists. No rulebook source: the digital table's own convenience.

## What Changes

- Every card face shows its name on hover, a reserve card with its value; nothing else changes about clicks or focus.
- **Deviations**: none.
- Non-goals: card text in the badge (focus reads the card), touch devices.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: card faces name themselves on hover.

## Impact

- `src/table/Table.tsx`: `Face` takes a `label` and shows the badge while hovered; the reserve, tableau and sheets props carry names; `src/table/App.tsx` supplies them. 3D table only.
