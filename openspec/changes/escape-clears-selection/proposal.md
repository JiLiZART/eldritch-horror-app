## Why

Clearing the selection needs a click on empty table, which at full zoom-out means aiming at a sliver of felt between the board and the tableau; a keyboard player tabbing the space list has no way to clear it at all. Escape is what every application means by "never mind". No rulebook source.

## What Changes

- Escape clears the selection; while a route is being picked it cancels the route, as Cancel does.
- **Deviations**: none.
- Non-goals: other shortcuts, Escape closing the glossary or the journal details.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: Escape clears the selection or cancels the route.

## Impact

- `src/table/App.tsx`: one keydown listener on the document. Panel and table.
