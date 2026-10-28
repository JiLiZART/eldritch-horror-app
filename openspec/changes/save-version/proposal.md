## Why

Every rules change adds a field to the game state, and the saved game keeps the old shape: a save from before the clue discard has no held tokens and the first spent clue throws in the middle of a round. The loader only checks that a phase exists, so the failure comes late and without explanation. No rulebook source: this is the digital table's own robustness.

## What Changes

- The state carries a shape version; setup writes the current one. A save with another version, or none, is set aside on load and the New game form shown with a note that the saved game could not be resumed, instead of resuming a game that breaks later.
- Bumping the version is part of any change that adds or renames a state field, recorded in the state's own doc comment.
- **Deviations**: no migration of older saves; a game in progress across such a change is started again.
- Non-goals: migrations, exporting a save before it is set aside.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `game-persistence`: an older save is set aside with a note.

## Impact

- `src/engine/types.ts`: `STATE_VERSION` and `GameState.version`; `src/engine/setup.ts` writes it; `src/table/saved.ts` checks it and reports why a slot was set aside; `src/table/App.tsx` and `NewGame.tsx` show the note. 2D panel only.
- `content/rules/glossary.md`: no terms involved.
