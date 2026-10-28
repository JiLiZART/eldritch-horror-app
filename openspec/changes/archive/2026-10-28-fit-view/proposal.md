## Why

Bringing a card up, scrolling in or dragging leaves the player zoomed in with no way back but scrolling out and dragging the table into place. A physical player leans back. The rig already glides to a target with a zoom; a control to ask for the whole table is the missing piece. No rulebook source.

## What Changes

- A Fit table button in the panel glides the view to the whole table at the zoom-out limit; translated; keyboard-reachable; selection untouched.
- **Deviations**: none.
- Non-goals: a keyboard shortcut, fitting on every phase change, a button on the canvas itself.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: the view can be fitted to the table again.

## Impact

- `src/table/Table.tsx`: a `fit` prop the rig glides to; `src/table/App.tsx`: the counter; `src/table/Panel.tsx`: the button; `content/panel/i18n/{en,ru}.json`: `panel.fitTable`. Panel and 3D table.
