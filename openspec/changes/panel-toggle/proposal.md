## Why

A group playing on a television or projector wants the table alone; the panel takes a quarter of the window and the board shrinks to fit beside it. One player runs the panel on a laptop, the screen shows the table. Nothing today hides the panel. No rulebook source.

## What Changes

- A Hide panel control collapses the panel; a Show panel control stays in the corner; the table refits to the full window; the choice is remembered in the browser.
- **Deviations**: none.
- Non-goals: a second-screen sync between browsers, hiding single sections.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: the panel can be hidden.

## Impact

- `src/table/App.tsx`: the hidden state, remembered under `eh.panel-hidden`; `src/table/table.css`: the layout; `content/panel/i18n/{en,ru}.json`: `game.hidePanel`, `game.showPanel`. Panel and layout.
