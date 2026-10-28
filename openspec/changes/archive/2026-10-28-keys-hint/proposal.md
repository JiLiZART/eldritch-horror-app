## Why

The table answers the arrow keys, plus, minus and Escape, and nothing on screen says so; a keyboard player finds them by luck. One quiet line beside the Game controls is enough. No rulebook source.

## What Changes

- A one-line keys hint in the Game section, translated.
- **Deviations**: none.
- Non-goals: a help page, a shortcut overlay.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: the keys are stated in the panel.

## Impact

- `src/table/NewGame.tsx`: the line; `content/panel/i18n/{en,ru}.json`: `game.keys`. Panel only.
