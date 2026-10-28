## Context

See proposal.md. The test picks one candidate step uniformly; the candidate lists hold about 30 card-text effects against 2 advancing steps, so a 400-step budget spends itself on round 1 and three Solve mystery picks end most games.

## Goals / Non-Goals

**Goals:**
- Same test, weighted; phase invariants as plain assertions; every seed deep enough to matter.

**Non-Goals:**
- A separate harness (see proposal).

## Decisions

### D1. Weights as repetition
Each candidate carries a weight; the picker draws from the expanded list. Advancing steps weigh 8, ordinary effects 1, game-ending effects (solve mystery, final mystery, advance doom, devour) weigh 1 in 20 picks of the whole, since they must still happen sometimes. Layer: test.
- Rejected: removing the ending effects. Awakening and victory must stay reachable.

### D2. Phase invariants in `check`
Active and lead standing and not removed; `phase.card` and `phase.combat` only in the Encounter phase; `round` equal to the previous or previous plus 1, growing only when the previous phase was Mythos; `usedComponents` empty right after a round starts; every `replacedBy` names an investigator in the game. Layer: test.

### D3. Depth assertion
After the loop, `round >= 5` unless the phase is `won` or `lost`; the step budget rises to 1500. Layer: test.

## Risks / Trade-offs

- Deeper play may find more engine bugs → fixed and reported in the apply summary, as before.
- Runtime grows with the budget → six seeds at 1500 steps stay well under a few seconds.

## Open Questions

- None.
