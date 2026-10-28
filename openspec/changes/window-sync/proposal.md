## Why

The panel can now be hidden for a shared screen, but that window then shows a table nobody can act on; the group plays in another window and the display falls behind until someone reloads it. Browsers tell every window when another writes to local storage, and every accepted step is already saved there. No rulebook source.

## What Changes

- A window showing a slot reloads that slot's state whenever another window saves it; its undo history follows too; a window in the New game form stays as it is.
- **Deviations**: none.
- Non-goals: syncing across browsers or machines, resolving two windows acting at once (the last save wins, as with any shared file).

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `game-persistence`: a second window of the same browser follows the game.

## Impact

- `src/table/App.tsx`: a `storage` event listener for the current slot's game key. View only.
