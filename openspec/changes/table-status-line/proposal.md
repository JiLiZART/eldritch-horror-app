## Why

Hiding the panel gives a shared screen the whole table, and then nothing on that screen says which round or phase it is or whose turn: the ring marks the pawn, but the round and phase live only in the panel heading. One line in the table's corner closes the gap. No rulebook source.

## What Changes

- A status line in the table's top-left corner: round, phase, and the active investigator in the Action and Encounter phases; the outcome when the game is over; nothing without a game. Translated.
- **Deviations**: none.
- Non-goals: doom and omen (they are on the tracks), the journal on the table.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: the round and phase are shown on the table.

## Impact

- `src/table/App.tsx`: the line's text from the state through the panel's strings; `src/table/Table.tsx`: an overlay element over the canvas; `src/table/table.css`: its look. 3D table and view.
