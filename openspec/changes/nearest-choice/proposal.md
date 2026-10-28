## Why

When card text moves an investigator to the nearest space of a kind and several spaces tie, the rules give the choice to the active investigator (EH_reference.pdf p.2 "nearest"; the card-effects spec records the gap). The engine takes the first in board order, a deviation listed since the card-effects change. The board graph already yields every nearest space; the panel only needs to ask.

## What Changes

- Moving to the nearest space of a kind takes an optional chosen space; with several nearest and no choice the engine refuses naming them; the Investigator effects group lists the tied spaces to pick from when there are several.
- **Deviations**: none for investigators; a monster moving toward the nearest investigator still breaks ties by seat order (separate change).
- Non-goals: the monster tie, random-space choice with an empty pool (the lead's choice is refused as today).

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `card-effects`: ties among nearest spaces are the players' choice.

## Impact

- `src/content/board.ts`: `nearestAll`; `src/engine/effects/investigator.ts`: `moveInvestigatorToNearest(state, content, id, kind, chosen?)`; `src/table/effects/Investigator.tsx`: the choice; tests. Engine and panel.
