## Why

Every piece on the table carries a label, "Byakhee (1 health lost)", "Lily Chen (delayed)", "Eldritch token", but the table shows only the image; to read the label a player selects the space and reads the panel's piece list. At a physical table one leans in and reads the token. No rulebook source: the digital table's own convenience.

## What Changes

- Pointing at a piece shows its label beside it until the pointer leaves; one label at a time; nothing else changes about selection or clicks.
- **Deviations**: none.
- Non-goals: touch devices without hover (the panel's piece list serves them), labels on the track tokens.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: pointing at a piece shows its label.

## Impact

- `src/table/Table.tsx`: pointer events on the piece meshes and one floating label; `src/table/table.css` for its look. 3D table; the panel is untouched.
