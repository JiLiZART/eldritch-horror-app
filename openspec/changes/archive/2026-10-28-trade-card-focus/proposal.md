## Why

Trading is deciding which card to hand over, and the Trade form lists both investigators' possessions by name beside checkboxes while the cards lie under their sheets; the Status table and the Acquire form now open their cards from the name. No rulebook source.

## What Changes

- In the Trade form each possession's name is a button that brings the held card up under its holder's sheet; the checkbox keeps its own label.
- **Deviations**: none.
- Non-goals: clues and tickets in the form (no card to show).

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: possessions open from the Trade form.

## Impact

- `src/table/Trade.tsx`: the buttons; `src/table/Turn.tsx`: the handler passed on. Panel only; the `held` place exists.
