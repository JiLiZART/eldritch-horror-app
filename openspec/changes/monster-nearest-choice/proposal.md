## Why

A monster moving toward the nearest investigator breaks ties by seat order and board order; the rules give the choice to the active investigator (EH_reference.pdf p.2; the card-effects spec records the deviation). The investigator's nearest-space move now asks the players; the monster's step is the same shape of question, one space along a shortest route.

## What Changes

- The step toward the nearest investigator takes an optional chosen neighbour; with several candidate steps and no choice the engine refuses naming them; the Monsters effects group lists the candidate steps to pick from when there are several.
- **Deviations**: moving an epic monster stays the players' call.
- Non-goals: monster movement in the Mythos phase's printed movement (not modelled), choosing which investigator rather than which step (the step covers both).

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `card-effects`: ties in a monster's step toward the nearest investigator are the players' choice.

## Impact

- `src/engine/effects/monsters.ts`: `monsterSteps` and the `chosen` parameter; `src/table/effects/Monsters.tsx`: the choice; tests. Engine and panel.
