## Why

The browser keeps one saved game: starting a second campaign, or opening a saved file to look at a bug, silently replaces the game the group is playing. Save files cover moving a game, not keeping two. No rulebook source: the digital table's own convenience.

## What Changes

- Slots: every game is saved in its own slot, named after the Ancient One, the seed and the round, with the time of the last step; the slot last played resumes on load.
- A Games list in the Game section: switch to another slot, remove a slot, or start a new game in a new slot while the others stay; loading a file fills a new slot too. Abandon removes the current slot, as today.
- A save written before slots existed becomes the first slot on load.
- **Deviations**: slots live in one browser.
- Non-goals: renaming slots, cloud sync, undo across slots.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `game-persistence`: several saved games, switchable and removable.

## Impact

- `src/table/saved.ts`: a slot index and per-slot keys, migration of the old key; `src/table/App.tsx` and `NewGame.tsx`: the current slot, the Games list and its controls. 2D panel only; engine untouched.
