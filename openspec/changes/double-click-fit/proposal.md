## Why

Fit table is a button in the panel; a mouse player zoomed deep into a card reaches for the view, not the panel, and on the panel-hidden screen the button is gone. Double-clicking empty table is the map gesture for "show me everything". No rulebook source.

## What Changes

- A double-click on empty table fits the view; a double-click on a piece or card keeps its single-click meaning only.
- **Deviations**: none.
- Non-goals: double-tap on touch (the browser's pinch serves).

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: a double-click fits the view.

## Impact

- `src/table/Table.tsx`: `onDoubleClick` on the canvas raising the fit counter through a prop; `src/table/App.tsx`: the handler. 3D table only.
