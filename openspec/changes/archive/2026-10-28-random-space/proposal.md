## Why

"Move to a random space" and "spawn 1 Monster on a random space" appear on mythos and encounter cards, and the rules fix how the space is drawn: discard a clue token from the pool and read its front (`inspired/manual_eng.pdf` p.4 "Random space"; `inspired/EH_reference.pdf` p.11 "Случайные локации"). The panel makes the players pick a space by hand and skips the clue token the rule spends.

## What Changes

- A random space: the top clue token of the pool is discarded to the clue discard and its printed space used; an empty pool first takes back its discard, as the clue rules say; with no token anywhere the effect is refused and the panel says the lead investigator chooses the space, with the usual named-space controls.
- Card text moves an investigator to a random space and spawns a monster on a random space.
- The Investigator group offers Move to a random space; the Board group offers Spawn monster on a random space.
- **Deviations**: "nearest" stays the players' call.
- Non-goals: random spaces for tokens and gates, the reshuffle of discarded clues into the pool when the pool is empty beyond what the clue rules already do.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `card-effects`: a random space for moves and monster spawns.

## Impact

- `src/engine/effects.ts`: `randomSpace`, `moveInvestigatorRandomly`, `spawnMonsterRandomly`; `src/table/Effects.tsx`: two buttons. 2D panel only.
- `content/rules/glossary.md`: Random space exists; no new terms.
