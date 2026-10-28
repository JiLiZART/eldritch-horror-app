## Why

Undo history lives in React state, so a reload, a browser crash or switching slots drops it: a misclick right before a reload cannot be taken back. Players expect the Undo they had a moment ago. No rulebook source: a digital-table convenience, like Undo itself.

## What Changes

- The last ten states before accepted steps are saved beside the game in its slot and restored with it; switching slots restores that slot's history; removing a slot removes its history.
- **Deviations**: none.
- Non-goals: redo, history in the downloaded file, histories longer than ten.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `game-persistence`: undo history is saved with the slot, bounded to ten states.

## Impact

- `src/table/saved.ts`: `saveGame` takes the history, `loadGame` returns it, `removeGame` drops it; key `eldritch-horror.history.<id>`.
- `src/table/App.tsx`: seeds the history from the loaded slot and saves it with the state. Panel; no 3D change.
