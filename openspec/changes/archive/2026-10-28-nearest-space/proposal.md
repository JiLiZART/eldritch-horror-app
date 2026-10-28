## Why

"Move to the nearest City space", "the nearest space containing a Gate", "the nearest Sea space" are everyday card lines, and the rules define nearest exactly: the fewest paths on the shortest route, the investigator's own space counting when it matches (`inspired/EH_reference.pdf` p.2 "Ближайший"; `inspired/manual_eng.pdf` p.3). The engine already computes it for a defeated investigator's city, but card text still makes the players count paths and pick a space by hand.

## What Changes

- Move to the nearest: card text moves an investigator to the nearest city, wilderness or sea space, or to the nearest space holding a gate or a clue; the investigator's own space wins when it matches; with no matching space the move is refused naming what was sought.
- The defeat relocation uses the same nearest rule, so the two never disagree.
- The Investigator group offers a choice of what to seek with a Move to nearest button.
- **Deviations**: among several nearest spaces the first in board order is taken, as for the defeated, instead of the active investigator's choice.
- Non-goals: nearest for monsters and spawns, nearest investigator for monster movement (already modelled), distance shown on the table.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `card-effects`: an investigator is moved to the nearest matching space.

## Impact

- `src/content/board.ts`: `nearest(board, from, candidates)`; `src/engine/effects.ts`: `moveInvestigatorToNearest`; `src/engine/encounter.ts`: `defeat` uses `nearest`; `src/table/Effects.tsx`: a select and a button. 2D panel only.
- `content/rules/glossary.md`: Nearest exists; no new terms.
