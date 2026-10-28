## Why

The set toggles draw an expansion's spaces on the board, and the engine now plays on the core set alone; a player who toggles Under the Pyramids on and plans a route to Cairo meets a refusal with no hint why. One line under the toggles says what they are. No rulebook source.

## What Changes

- A translated note under the Sets controls while any expansion is on: its spaces are a preview, the game plays on the core set.
- **Deviations**: none.
- Non-goals: disabling the toggles, expansion content.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: the preview note.

## Impact

- `src/table/Panel.tsx`; `content/panel/i18n/{en,ru}.json`: `panel.previewNote`. Panel only.
