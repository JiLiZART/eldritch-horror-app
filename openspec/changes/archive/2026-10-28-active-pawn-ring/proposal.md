## Why

Whose turn it is shows only in the panel's phase heading; on the table every pawn looks alike, and with four or more investigators the eye hunts for the one that acts. The camera already glides to the active investigator's space when the turn passes; a ring under that pawn makes the turn visible from across the table. No rulebook source: a digital-table convenience.

## What Changes

- A ring lies on the table under the active investigator's pawn in the Action and Encounter phases; none in the Mythos phase or before a game.
- **Deviations**: none.
- Non-goals: ringing the selected space's pawns, animating the ring.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: the active investigator's pawn is ringed.

## Impact

- `src/table/pieces.ts`: an `active` flag on the pawn piece; `src/table/Table.tsx`: a ring mesh under that pawn. View model and 3D table.
