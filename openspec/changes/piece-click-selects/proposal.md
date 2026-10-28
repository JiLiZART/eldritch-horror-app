## Why

Markers select their space, but the pieces that stand on them swallow the click: a pawn, a monster or a gate token covers the marker on a busy space, and clicking it does nothing, not even clearing the selection. Players click the thing they see. No rulebook source.

## What Changes

- Clicking a piece selects the space it stands on, like clicking the marker; a drag that starts on a piece still pans.
- **Deviations**: none.
- Non-goals: selecting a piece as such, clicks on track tokens.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: a piece click selects its space.

## Impact

- `src/table/Table.tsx`: `Pieces` gets `onSelect` and a click handler per piece mesh. 3D table only.
