## Why

A group wondering "what if we had gone to Tokyo" has to replay from set-up with the same seed; a copy of the slot lets them branch from the moment itself and keep the original. The slot store already holds the state and history as plain text. No rulebook source.

## What Changes

- A Duplicate control per saved game copies its state, history and name into a new slot and switches to it.
- **Deviations**: none.
- Non-goals: merging branches, naming the copy automatically beyond "(copy)".

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `game-persistence`: a slot can be duplicated.

## Impact

- `src/table/saved.ts`: `duplicateGame`; `src/table/NewGame.tsx`: the control; `src/table/App.tsx`: switching to the copy; `content/panel/i18n/{en,ru}.json`: `game.duplicate`. Persistence and panel.
