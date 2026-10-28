## Why

Remove and Abandon game delete a saved game on one click, beside Switch and Undo in a row of small buttons; a slip loses a game of several hours with no way back. One confirming click is the usual guard, without a browser dialog. No rulebook source.

## What Changes

- Remove and Abandon game turn into a confirm step inline (Confirm and Cancel) and act only on Confirm; Cancel or a click elsewhere leaves things as they were.
- **Deviations**: none.
- Non-goals: an undo for a removed slot, a trash.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `game-persistence`: removal and abandonment ask first.

## Impact

- `src/table/NewGame.tsx`: the pending state and the two buttons; `content/panel/i18n/{en,ru}.json`: `game.confirm`, `game.cancel`. Panel only.
