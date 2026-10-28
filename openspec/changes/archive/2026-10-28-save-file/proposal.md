## Why

The saved game lives in one browser slot: it cannot move to another device, cannot be kept beside a second game, and cannot be sent along with a bug report. The state is plain JSON already, so a file is the slot with a name. No rulebook source: the digital table's own convenience.

## What Changes

- Save to file: while a game runs, a control downloads the state as `eldritch-horror-<seed>-round-<round>.json`.
- Load from file: a file input, shown with the New game form and beside Abandon while a game runs, reads a file through the same checks as the browser slot, replaces the game, clears the undo history and saves the slot as usual; an unreadable or older file is refused with the slot's notes and nothing changes.
- **Deviations**: plain JSON, no signature; one file at a time.
- Non-goals: cloud sync, named slots in the browser, autosave to files.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `game-persistence`: the game is saved to and loaded from a file.

## Impact

- `src/table/saved.ts`: `parseGame(text)` shared by the slot loader and the file loader, `fileName(state)`; `src/table/NewGame.tsx` and `App.tsx`: the Save to file control and the file input. 2D panel only; the engine is untouched.
- `content/rules/glossary.md`: no terms involved.
