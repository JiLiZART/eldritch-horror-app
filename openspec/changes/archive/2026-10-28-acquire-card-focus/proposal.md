## Why

Acquire Assets is the moment a player weighs the reserve, and the form names the four cards beside their checkboxes while the cards themselves lie on the table a glance away; every other panel name now opens its card. No rulebook source.

## What Changes

- In the Acquire Assets form each reserve card's name is a button that brings the card up on the table; the checkbox keeps its own label.
- **Deviations**: none.
- Non-goals: the discard choice's names.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: reserve cards open from the Acquire Assets form.

## Impact

- `src/table/Acquire.tsx`: the buttons; `src/table/Turn.tsx` and `src/table/App.tsx`: the handler passed through. Panel only.
