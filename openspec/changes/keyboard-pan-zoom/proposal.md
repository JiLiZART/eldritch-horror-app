## Why

Every control on the table now has a keyboard path except moving the view itself: panning needs a drag and zooming a wheel, so a keyboard-only player can bring cards up and fit the table but not look around it. Arrow keys and plus and minus are what maps use. No rulebook source.

## What Changes

- With no form field focused, the arrow keys pan the view by a fifth of its size and plus and minus zoom it by a step; the clamp and the zoom limits apply.
- **Deviations**: none.
- Non-goals: rotating, a key for Fit table (the button is focusable).

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: the view pans and zooms by keyboard.

## Impact

- `src/table/App.tsx`: the keys in the existing document listener, as a `nudge` request; `src/table/Table.tsx`: the rig applies a nudge through the controls. Table and view.
