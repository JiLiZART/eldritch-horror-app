## Why

Saved games are named "Azathoth · seed 3 · round 4", which tells two Azathoth games apart only by seed. A household with two groups, or one player trying two lines from the same seed, wants to call a slot by what it is. The slot index already carries a name per slot; it only lacks a way for the players to set it. No rulebook source.

## What Changes

- A name field beside each saved game sets the players' name for the slot; later saves keep it; an empty name falls back to the Ancient One, seed and round.
- **Deviations**: none.
- Non-goals: names inside the downloaded file, duplicate-name checks.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `game-persistence`: a slot can carry a players' name.

## Impact

- `src/table/saved.ts`: `SlotInfo.title` and `renameGame`; `saveGame` keeps the title; `src/table/NewGame.tsx`: the field; `src/table/App.tsx`: the handler; `content/panel/i18n/{en,ru}.json`: `game.rename`. Persistence and panel.
