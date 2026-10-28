## Why

The encounter card now lies beside the sheet, and every other card the panel shows opens on the table from the panel; the Encounter panel's thumbnail of the drawn card is the one still inert, though it is the card read aloud at that moment. No rulebook source.

## What Changes

- The Encounter panel's card thumbnail is a button that brings the encounter card beside the sheet up on the table.
- **Deviations**: none.
- Non-goals: the special and fallen sheet backs shown in that panel (they are not on the table).

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: the encounter card opens from its panel.

## Impact

- `src/table/Table.tsx`: an `encounter` place with a seat; `src/table/Encounter.tsx`: the button; `src/table/App.tsx`: the handler passed through. Panel and 3D table.
