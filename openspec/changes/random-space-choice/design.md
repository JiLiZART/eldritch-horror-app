## Context

See proposal.md. `randomSpace` in `effects/shared.ts` draws the top clue token, reshuffling the discard into an empty pool, and throws when none is left; `moveInvestigatorRandomly` calls it; the Investigator group has a Move to a random space control.

## Goals / Non-Goals

**Goals:**
- The token rule unchanged; the choice only when the rule hands it to the lead.

**Non-Goals:**
- See proposal.

## Decisions

### D1. `clueTokensLeft(state)`
True when the pool or the discard holds a token. Layer: engine, tested through the move.

### D2. Optional choice
`moveInvestigatorRandomly(state, content, id, chosen?)`: with a token left it draws as today and ignores `chosen`; with none and a known `chosen` it moves there, logging that the lead chose; with none and no `chosen` it throws the current message. Layer: engine.

### D3. The panel asks
The Investigator group shows a select of the active sets' spaces beside the control only when `clueTokensLeft` is false, passing the pick. Layer: panel.

## Risks / Trade-offs

- None.

## Open Questions

- None.
