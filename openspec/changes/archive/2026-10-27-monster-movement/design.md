## Context

See proposal.md. Effects live in `src/engine/effects.ts` behind `subject`, which checks the phase (Encounter, or Mythos after resolution) and the investigator. Monsters on the board are `MonsterOnBoard` (`id`, `instance`, `space`, `health`) in `GameState.monsters`; the cup is `monsterCup`. `fight` in `src/engine/encounter.ts` returns a defeated non-epic token to the cup by appending it. `neighbors` and `distance` in `src/content/board.ts` give adjacency and the shortest-route length. `Effects.tsx` renders the effect controls; `pieces.ts` redraws monsters from state.

## Goals / Non-Goals

**Goals:**
- Monster effects reuse the phase gate, the log and the board helpers; no monster AI or text parsing.

**Non-Goals:**
- Reckoning automation, monster health reset on movement, set-aside bookkeeping (see proposal).

## Decisions

### D1. The phase gate is split from the investigator check
`subject` keeps its signature; its phase check moves into `textPhase(state)` so monster effects share it without an investigator. Layer: engine.
- Rejected: passing the active investigator to monster effects. Card text moves monsters whoever is encountering.

### D2. `moveMonster(state, content, monster, space)` names the space
Finds the token by `id` and `instance`, refusing "no <name> on the board"; refuses an unknown space as `moveInvestigator` does; sets `space`; logs "the <name> moves to <Space>". Lost health stays. Layer: engine.
- Rejected: a path check. Card text moves regardless of paths.

### D3. `moveMonsterToward(state, content, monster)` walks one path
Standing investigators in seat order; the nearest by `distance` (first wins a tie). Distance 0: log "the <name> is already with <Investigator>" and return unchanged. Otherwise the first neighbour in `neighbors` order whose distance to that investigator is one less becomes the space, logged as in D2. Layer: engine.
- Rejected: offering the tie choice in the panel. One more select for a case the players can resolve with Move.

### D4. `discardMonster(state, content, monster)` follows `fight`
Removes the token; a non-epic token is appended to `monsterCup` as `fight` does; an epic token is dropped. Log "the <name> is discarded and returns to the cup" or "the <name> is discarded and leaves the game". Layer: engine.
- Rejected: reshuffling the cup with the seeded `reshuffle`. Correct per p.11, but `fight` does not, and one rule in two shapes is worse than one shared deviation; a later change can fix both.

### D5. Panel row, 2D only
`Effects.tsx` adds a row shown when monsters stand on the board: a select of `state.monsters` labelled "<name> on <Space>", keyed by `id#instance`; Move reuses the existing space select; Toward nearest investigator; Discard. The 3D table needs nothing: `pieces.ts` already draws tokens from `state.monsters`. Layer: view.
- Rejected: buttons on the Encounter monster list. Those are the active investigator's monsters only; card text reaches any.

## Risks / Trade-offs

- Ties broken silently → the log names the destination; Move covers the players' choice.
- A moved monster keeps lost health → correct per the rules (health tokens stay on the token).
- An epic monster can be moved by any text → the rulebook limits it to its own effects; the players read the card.

## Open Questions

- None.
