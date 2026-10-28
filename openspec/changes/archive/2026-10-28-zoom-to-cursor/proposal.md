## Why

Scrolling to zoom enlarges the view around the controls' target, which at full zoom-out is the table's centre; a player who scrolls over Sydney lands on the Heart of Africa and then drags across the table. Every map application zooms toward the pointer. A digital-table defect; no rulebook source.

## What Changes

- Scroll zoom keeps the point under the pointer fixed. Pan, the glide and the clamp are unchanged; the clamp still runs on the resulting change.
- **Deviations**: none.
- Non-goals: pinch gestures beyond what MapControls already maps, keyboard zoom.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: scroll zoom lands under the pointer.

## Impact

- `src/table/Table.tsx`: one MapControls prop. 3D table only.
