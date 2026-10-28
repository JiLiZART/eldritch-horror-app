## Context

See proposal.md. `InvestigatorState.clues` is a count used in 74 places across engine, panel and tests; the pool and discard hold token ids that are space ids. `gainClue` knows the id it takes; `placeInvestigator` splices starting clues off the pool copy and drops the ids; `replaceInvestigator` reuses it with copies.

## Goals / Non-Goals

**Goals:**
- Token identity restored where it matters, the pool and the discard, without touching the 74 count sites.

**Non-Goals:**
- Per-investigator token lists (see proposal).

## Decisions

### D1. `GameState.heldClues: string[]`
Every token out of the pool and off the board and not on the discard, in gain order; the invariant is its length equals the sum of the investigators' counts. Layer: game state.
- Rejected: `clues: string[]` per investigator. Faithful to the cardboard, but it reaches 21 files for a distinction the rules never read.

### D2. `spendHeldClue(state)` in `effects.ts`
Moves the last held id onto the front of `clueDiscard`; `spendClue`, `rerollDie` and `devour` (once per held clue) call it after their own refusals. `gainClue` pushes the id it takes. Layer: engine.

### D3. Setup collects the starting ids
`placeInvestigator` takes a `heldClues` array and pushes what it splices; `setupGame` and `replaceInvestigator` pass their copies and write them back. Layer: engine.

## Risks / Trade-offs

- A state saved before this change lacks `heldClues` → the loader only checks for `phase`; `spendHeldClue` on an undefined list would throw. The player abandons and starts again, as with any older save.

## Open Questions

- None.
