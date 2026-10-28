## Why

The drawn mythos card lies first in the tableau during its phase, and every other card the panels show now opens on the table from its thumbnail; the Mythos panel's is the last one that does not. No rulebook source.

## What Changes

- The Mythos panel's card thumbnail is a button that brings the drawn card up in the tableau.
- **Deviations**: none.
- Non-goals: none beyond the thumbnail.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: the mythos card opens from its panel.

## Impact

- `src/table/Mythos.tsx`: the button; `src/table/App.tsx`: the handler passed through. Panel only; the `mythos` place with index 0 exists.
