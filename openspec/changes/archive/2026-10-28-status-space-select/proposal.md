## Why

The Status table names each investigator's space, but finding the pawn means scanning the board or scrolling the space list for that name. The neighbours in the Selected space section are already buttons that select; the Status table's space cell is plain text. One control, and the table becomes the way to find anyone. No rulebook source.

## What Changes

- Each investigator's space in the Status table is a button that selects the space, so the camera glides to the pawn; keyboard-reachable like the neighbour buttons.
- **Deviations**: none.
- Non-goals: selecting from the journal, highlighting the pawn.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: the Status table's space selects.

## Impact

- `src/table/Panel.tsx` (`Status` takes `onSelect`). Panel only.
