## Why

The zoom-out limit fits the board, but the camera centres on the selected space, so at full zoom-out a corner space pushes a third of the board off-screen, and the tableau beside the board is never in the fitted view. Panning can also drift into empty black. A digital-table defect; no rulebook source.

## What Changes

- The view is clamped to the table: the board, plus the tableau column during a game. Full zoom-out fits the whole table; a glide or a drag stops at its edges.
- **Deviations**: none.
- Non-goals: different fits per phase, remembering the zoom across reloads.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: the view stays within the table, which includes the tableau during a game.

## Impact

- `src/table/geometry.ts`: `tableExtent`; `src/table/Table.tsx`: `CameraRig` fits and clamps to it. 3D table only.
