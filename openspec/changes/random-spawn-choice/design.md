## Context

See proposal.md. `spawnMonsterRandomly` draws through `randomSpace`; `clueTokensLeft` says whether a token is left; the Board group has a Spawn a monster on a random space control.

## Goals / Non-Goals

**Goals:**
- Same shape as the investigator's random move.

**Non-Goals:**
- See proposal.

## Decisions

### D1. Optional choice
`spawnMonsterRandomly(state, content, id, chosen?)`: with a token left it draws as today; with none and a known `chosen` it spawns there, logging that the lead named it; with none and no `chosen` it throws the current message. Layer: engine, tested.

### D2. The panel asks
The Board group shows a select of the board's spaces beside the control only when `clueTokensLeft` is false, passing the pick. Layer: panel.

## Risks / Trade-offs

- None.

## Open Questions

- None.
