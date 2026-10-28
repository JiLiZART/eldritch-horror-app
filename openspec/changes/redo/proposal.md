## Why

Undo is one click beside Switch and Fit table, and an undo pressed once too often loses the step for good: the state before it is gone from the history. A Redo that holds until a new step is taken is the usual pair. No rulebook source.

## What Changes

- A Redo control beside Undo reapplies undone steps in order until a new step is accepted; disabled when nothing is undone; session-only.
- **Deviations**: none.
- Non-goals: redo across a reload, redo of a loaded file's state.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `game-persistence`: undone steps can be redone.

## Impact

- `src/table/App.tsx`: a redo stack beside the history; `src/table/NewGame.tsx`: the button; `content/panel/i18n/{en,ru}.json`: `game.redo`. View only.
