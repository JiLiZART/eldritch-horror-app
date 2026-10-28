## Why

The rules say to lay a delayed or defeated investigator's token on its side (`inspired/manual_eng.pdf` p.4 "Delayed", "Defeated"; `inspired/EH_reference.pdf` p.4, p.12), and at a physical table that is how everyone sees who is out of action. On this table the pawn stands upright with a label in the panel, so a glance at the board tells nothing.

## What Changes

- A delayed or defeated investigator's pawn lies on its side on the table; it stands up again when the investigator is neither; a devoured or removed pawn stays gone.
- **Deviations**: no health or sanity token is placed on the lying pawn; the Status line says which.
- Non-goals: pawn models, animation of the fall.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: a delayed or defeated investigator's pawn lies on its side.

## Impact

- `src/table/pieces.ts`: `Piece.lying`; `src/table/Table.tsx`: the pawn plane rotated when lying. 3D table; the panel is untouched.
- `content/rules/glossary.md`: Delayed and Defeated exist; no new terms.
