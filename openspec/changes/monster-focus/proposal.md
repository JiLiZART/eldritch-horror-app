## Why

A monster token's back carries its special text, the reckoning and spawn effects read when the token is flipped (manual p.3 "Monsters"); the hover badge gives the numbers but not the text, and the panel's thumbnails do not include monsters. Cards brought up turn over on a click; tokens should read the same way. No rulebook source beyond the tokens.

## What Changes

- A double-click on a monster token brings it up to read; a further click shows its back, the next its front; the single click keeps selecting the space.
- **Deviations**: none.
- Non-goals: pawns and other tokens (no text on them), the panel.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: a monster token can be brought up and turned over.

## Impact

- `src/table/pieces.ts`: a `back` on monster pieces; `src/table/Table.tsx`: `Pieces` raises a focus on double-click and shows the back while focused and turned. 3D table and view model.
