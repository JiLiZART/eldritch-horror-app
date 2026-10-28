## Why

A second window follows the game it shows, but its Saved games list is read once at load: a slot started, named, duplicated or removed in the other window does not appear until a reload, and a removed one can still be switched to. The slot index changes are storage writes like the game's. No rulebook source.

## What Changes

- The storage listener also follows the slot index: the list refreshes when another window changes it, and a current slot removed elsewhere puts this window aside to the form.
- **Deviations**: none.
- Non-goals: following the panel-hidden or language choices of another window.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `game-persistence`: the Saved games list follows other windows.

## Impact

- `src/table/App.tsx`: the listener handles the index key. View only.
