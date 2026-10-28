## Why

The panel is a fixed 24rem: on a wide screen the Status table wraps its skill lists into columns of two letters, on a narrow one the board is a sliver. A drag handle on the panel's edge lets each table set the split it reads best. No rulebook source.

## What Changes

- The panel's left edge is a drag handle; the width is clamped between 16rem and half the window and remembered in the browser; the canvas refits as it changes.
- **Deviations**: none.
- Non-goals: a vertical split, keyboard resizing beyond the browser's own zoom.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: the panel's width is adjustable and remembered.

## Impact

- `src/table/App.tsx`: the width state, remembered under `eh.panel-width`, and a pointer-drag handle; `src/table/table.css`: the grid column from a CSS variable and the handle's look. Layout only.
