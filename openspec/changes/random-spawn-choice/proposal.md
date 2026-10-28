## Why

Spawning a monster on a random space draws the top clue token for the space and, with none left, the rules hand the choice to the lead investigator (EH_reference.pdf p.11); the engine refuses then. The investigator's random move now takes the lead's name in that case; the random spawn is the last random-space effect that only refuses.

## What Changes

- The random monster spawn takes an optional named space, used only when no clue token is left; the Board effects group shows a space select then.
- **Deviations**: none.
- Non-goals: gates and clues (they spawn on named spaces or by their own tokens).

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `card-effects`: the lead's choice replaces the refusal for a random spawn with no clue token left.

## Impact

- `src/engine/effects/board.ts`: `spawnMonsterRandomly(state, content, id, chosen?)`; `src/table/effects/Board.tsx`: the select; tests. Engine and panel.
