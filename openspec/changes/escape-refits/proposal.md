## Why

Bringing a card up fills the view with it; putting it down takes Fit table, a double-click on felt the card may cover, or a scroll. Escape is "never mind" everywhere else on the table; with a card up it should put the card down first. No rulebook source.

## What Changes

- Escape with a card brought up fits the view and leaves the selection; the next Escape clears as before.
- **Deviations**: none.
- Non-goals: Escape undoing a keyboard pan.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: Escape puts a card down first.

## Impact

- `src/table/App.tsx`: the Escape branch checks the card focus; `src/table/Table.tsx`: fitting clears the focus (it does already, through the fit key). View only.
