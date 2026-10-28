## Why

Players can name a slot, but Save to file still downloads "eldritch-horror-3-round-4.json": the name they chose for the game is the name they will look for in a folder. No rulebook source.

## What Changes

- The downloaded file is named after the slot's own name when one is set, with characters a file system refuses replaced by dashes; otherwise after the seed and round as today.
- **Deviations**: none.
- Non-goals: putting the title inside the file.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `game-persistence`: the file name follows the slot's name.

## Impact

- `src/table/saved.ts`: `fileName(state, title?)`; `src/table/App.tsx`: passes the current slot's title; `saved.test.ts`. Persistence only.
