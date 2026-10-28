## Why

The camera rig pulls the view back toward the selected space on every frame, not only when the selection changes. Since the active investigator's space is selected each turn, a player who drags the table to read the tableau, or any far corner, watches it slide back; panning works only after clicking empty table to clear the selection. A digital-table defect; no rulebook source.

## What Changes

- The camera glides to a newly selected space once; from then on the player's panning holds until the next selection. A drag during the glide ends it.
- **Deviations**: none.
- Non-goals: zoom changes on selection, keyboard panning.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: the follow is a single glide per selection, not a tether.

## Impact

- `src/table/Table.tsx`: `CameraRig` keeps a gliding flag set when the target changes, cleared when it arrives or a drag starts. 3D table only.
