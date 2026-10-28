## Context

See proposal.md. `gainClue` already rebuilds an empty pool from the discard with the seeded `reshuffle` and takes the top token; clue token ids are the space ids printed on their fronts. `moveInvestigator` and `spawnMonsterByText` take a space id.

## Goals / Non-Goals

**Goals:**
- One draw helper; the two effects call the named-space effects with the drawn space.

**Non-Goals:**
- "Nearest" (see proposal).

## Decisions

### D1. `randomSpace(state)` in `effects.ts`
Rebuilds an empty pool from the discard as `gainClue` does, takes the top token, puts it on `clueDiscard`, returns `{ state, space }`; with nothing to draw throws "no clue token is left: the lead investigator chooses the space". Layer: engine.
- Rejected: a shared pool helper with `gainClue`. The two differ in where the token ends (the sheet or the discard); four lines each read better than a parameter.

### D2. `moveInvestigatorRandomly(state, content, id)` and `spawnMonsterRandomly(state, content, id)`
Each draws, logs "a clue token names London as the random space", then calls the named-space effect. Layer: engine.

### D3. Two buttons
`Effects.tsx`: Move to a random space in the Investigator group, Spawn monster on a random space in the Board group. Layer: view.

## Risks / Trade-offs

- Drawing bumps `rolls` only when the pool was rebuilt → consistent with `gainClue`.

## Open Questions

- None.
