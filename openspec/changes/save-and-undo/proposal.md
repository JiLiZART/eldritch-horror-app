## Why

A closed tab loses the whole game, and a misclick on an effect button has no way back: the engine state is plain JSON and every step is a pure function, yet the table keeps only the latest state in memory. A long physical game is played over hours and survives a knocked table; this one does not survive a reload.

## What Changes

- Resume after reload: every accepted step saves the game in the browser; opening the table again resumes it as it was; abandoning the game clears the save; an unreadable save is ignored and the New game form shown.
- Undo: a control beside the board reverts the last accepted step, repeatedly, back to the freshly set-up game; a refused step is not a step; the undo history is kept for the session only, so a resumed game starts with nothing to undo.
- **Deviations**: none of this is a rulebook mechanic; the saved game is one slot per browser, named games and export are not offered.
- Non-goals: several saved games, export and import, undo across a reload, replay by action log.

## Capabilities

### New Capabilities
- `game-persistence`: the saved game and the undo history.

### Modified Capabilities
- `new-game`: abandoning the game clears the save.

## Impact

- New `src/table/saved.ts`: load, save and clear with a storage argument, so a fake storage tests it; `src/table/App.tsx`: history beside the game state, Undo in the Game section, save on every accepted step, resume on load, clear on abandon.
- View state only: `GameState` is unchanged. 2D panel only.
- `content/rules/glossary.md`: no terms involved.
