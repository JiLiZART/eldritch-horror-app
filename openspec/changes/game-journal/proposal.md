## Why

Each phase writes a log in rule words, and each log vanishes when the seat passes: by the Mythos phase nobody can see what Leo Anderson rolled in his encounter, and the Action phase writes nothing at all. A physical game leaves no trace either, but a digital table can, and a game that is saved and resumed across days needs its own record of what happened. No rulebook source: this is the digital table's own convenience.

## What Changes

- A journal in the game state: every line a phase logs is kept when the phase or seat passes, under its round, phase and investigator; every action performed in the Action phase is kept as a line of its own. The journal is part of the saved game and survives undo like the rest of the state.
- The journal is shown beside the board, folded by default, grouped by round, oldest first, newest at the end.
- **Deviations**: none, no rule is involved; refused steps are not recorded, since they change nothing.
- Non-goals: filtering, export, a journal of the setup, lines for Travel routes beyond the action name.

## Capabilities

### New Capabilities
- `game-journal`: what is kept and how it is shown.

### Modified Capabilities
- none

## Impact

- `src/engine/types.ts`: `JournalEntry`, `GameState.journal`; `src/engine/journal.ts`: the fold of a finished phase log; `src/engine/actions.ts` (`perform` writes the action), `encounter.ts` and `mythos.ts` (fold on seat change, on the Mythos draw and on the next round).
- `src/table/Panel.tsx`: a Journal section. 2D panel only.
- `content/rules/glossary.md`: no terms involved.
